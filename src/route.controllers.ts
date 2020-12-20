import { IEvaluation, IScout, ScoutType } from './models';
import {
    createArrayOfScouts,
    findScoutByNameAndBirthday,
    getEvaluations,
    getScout,
    getScoutWithTheirEvaluations
} from './database.controllers';
import jwt from 'jsonwebtoken';
import { SECRET, SENIOR_STAFF_PERMISSION_LEVEL } from './constants';
import { createDate, createQueryName } from './utils';
import csv from 'csvtojson/index';
import { json2csvAsync } from 'json-2-csv';
import { recommendationNumberToString } from '../static/src/SharedUtils';

export async function getEvaluationsForScout(scoutId: string, userId: string): Promise<IScout | null> {
    const scout = await getScoutWithTheirEvaluations(scoutId);
    const user = await getScout(userId);
    if (user && scout) {
        return user.permissionLevel < SENIOR_STAFF_PERMISSION_LEVEL ? filterEvaluations(scout, user._id) : scout;
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

export async function createEvaluationCsv(): Promise<String> {
    const evaluationJson = await createFlatEvaluationJson();
    return await json2csvAsync(evaluationJson);
}

async function createFlatEvaluationJson(): Promise<any[]> {
    return (await getEvaluations()).map(evaluation => {
        return {
            'Course': evaluation.author.course.unitName,
            'Course Date': evaluation.author.course.startDate,
            'First Name': evaluation.scout.firstName,
            'Last Name': evaluation.scout.lastName,
            'Date of Birth': evaluation.scout.dateOfBirth,
            'Team': evaluation.scout.team,
            'Position': evaluation.scout.postion,
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