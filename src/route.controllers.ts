import { IEvaluation, IScout, ScoutType } from './models';
import {
    createArrayOfScouts,
    findScoutByNameAndBirthday,
    getEvaluations,
    getScout,
    getScoutWithTheirEvaluations
} from './database.controllers';
import jwt from 'jsonwebtoken';
import {
    AZURE_CONTAINER_NAME,
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
    AZURE_STORAGE_ACCOUNT_NAME,
    PermissionLevel,
    SECRET
} from './constants';
import { createDate, createQueryName } from './utils';
import csv from 'csvtojson/index';
import { json2csvAsync } from 'json-2-csv';
import { recommendationNumberToString } from '../static/src/SharedUtils';
import { BlobServiceClient, newPipeline, StorageSharedKeyCredential } from '@azure/storage-blob';
import intoStream from 'into-stream';
import AdmZip from 'adm-zip';

const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

export async function getEvaluationsForScout(scoutId: string, userId: string): Promise<IScout | null> {
    const scout = await getScoutWithTheirEvaluations(scoutId);
    const user = await getScout(userId);
    if (user && scout) {
        return user.permissionLevel < PermissionLevel.SENIOR_STAFF ? filterEvaluations(scout, user._id) : scout;
    }
    return null;
}

export function filterEvaluations(scout: IScout, viewerId: string): IScout {
    // @ts-ignore
    scout.evaluationsAsSubject = scout.evaluationsAsSubject.filter((evaluation: IEvaluation) => evaluation.author._id.toString() === viewerId);
    return scout;
}

export async function processCsv(file: Express.Multer.File, courseId: string) {
    const jsonData: any[] = await csv().fromFile(file.path);
    const participantArray: any[] = jsonData.filter(row => row['Scout Type'].toLowerCase() === 'participant').map(row => {
        return {
            firstName: row['First Name'],
            lastName: row['Last Name'],
            dateOfBirth: createDate(row['Date of Birth']),
            position: row['Position'],
            team: row['Team'],
            permissionLevel: row['Permission Level']
        };
    });
    const staffArray: any[] = jsonData.filter(row => row['Scout Type'].toLowerCase() === 'staff').map(row => {
        return {
            firstName: row['First Name'],
            lastName: row['Last Name'],
            dateOfBirth: row['Date of Birth'],
            position: row['Position'],
            team: row['Team'],
            permissionLevel: row['Permission Level']
        };
    });
    return [...(await createArrayOfScouts(participantArray, courseId, ScoutType.Participant)),
        ...(await createArrayOfScouts(staffArray, courseId, ScoutType.Staff))];
}

export async function processImage(file: Express.Multer.File, scoutId: string) {
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(scoutId);
    await blockBlobClient.uploadStream(intoStream(file.buffer), undefined, undefined, {blobHTTPHeaders: {blobContentType: 'image/jpeg'}});
}

export async function getImage(scoutId: string): Promise<Buffer | null> {
    console.log('scoutId', scoutId);
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(scoutId);
    if (await blockBlobClient.exists()) {
        console.log('image exists');
        return blockBlobClient.downloadToBuffer();
    } else {
        console.log('image null');
        return null;
    }
}

export async function getImageZip(scouts: IScout[]): Promise<Buffer> {
    const zipFile = new AdmZip();
    for (let i = 0; i < scouts.length; i++) {
        console.log('C', scouts[i].lastName);
        let scoutImageBuffer = await getImage(scouts[i]._id);
        if (scoutImageBuffer) {
            console.log('D', scouts[i].lastName);
            zipFile.addFile(`${scouts[i].firstName}${scouts[i].lastName}.jpg`, scoutImageBuffer);
        }
    }
    return zipFile.toBuffer();
}

export async function createEvaluationCsv(courseId?: string): Promise<String> {
    const evaluationJson = await createFlatEvaluationJson(courseId);
    return await json2csvAsync(evaluationJson);
}

async function createFlatEvaluationJson(courseId?: string): Promise<any[]> {
    let evaluations = await getEvaluations();
    if (courseId) {
        evaluations = evaluations.filter(evaluation => evaluation.scout.course.toString() === courseId);
    }
    return evaluations.map(evaluation => {
        return {
            'Course': evaluation.author.course.unitName,
            'Course Date': evaluation.author.course.startDate,
            'First Name': evaluation.scout.firstName,
            'Last Name': evaluation.scout.lastName,
            'Date of Birth': evaluation.scout.dateOfBirth,
            'Team': evaluation.scout.team,
            'Position': evaluation.scout.position,
            'Author First Name': evaluation.author.firstName,
            'Author Last Name': evaluation.author.lastName,
            'Author Date of Birth': evaluation.author.dateOfBirth,
            'Author Position': evaluation.author.position,
            'Day': evaluation.day,
            'Knowledge': evaluation.knowledge,
            'Skill': evaluation.skill,
            'Confidence': evaluation.confidence,
            'Motivation': evaluation.motivation,
            'Enthusiasm': evaluation.enthusiasm,
            'Recommended for Staff': recommendationNumberToString(evaluation.recommend),
            'Comments': evaluation.comments,
            // @ts-ignore
            'Created': evaluation.createdAt,
            // @ts-ignore
            'Updated': evaluation.updatedAt
        }
    });
}

export function getUserIdFromToken(token: string): string | null {
    try {
        const payload: any = jwt.verify(token, SECRET);
        return payload.userId;
    } catch {
        return null;
    }
}

export async function checkPermission(userId: string, minimumPermissionRequired: number): Promise<boolean> {
    try {
        const user = await getScout(userId);
        if (user) {
            return user.permissionLevel >= minimumPermissionRequired;
        }
        return false;
    } catch {
        return false;
    }
}

export async function createTokenForUser(firstName: string, lastName: string, dateOfBirthString: string): Promise<string | null> {
    const user = await findScoutByNameAndBirthday(createQueryName(firstName, lastName), createDate(dateOfBirthString));
    if (user) {
        return jwt.sign({userId: user._id}, SECRET);
    } else {
        return null;
    }
}