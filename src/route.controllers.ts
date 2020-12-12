import { IScout } from './models';
import { findScoutByNameAndBirthday, getScout, getScoutWithTheirEvaluations } from './database.controllers';
import jwt from 'jsonwebtoken';
import { SECRET } from './constants';

export async function getEvaluationsForScout(scoutId: string, userId: string): Promise<IScout | null> {
    const scout = await getScoutWithTheirEvaluations(scoutId);
    const user = await getScout(userId);
    if (user && scout) {
        return user.permissionLevel < 3 ? filterEvaluations(scout, user._id) : scout;
    }
    return null;
}

function filterEvaluations(scout: IScout, viewerId: string): IScout {
    // @ts-ignore
    scout.evaluationsAsSubject = scout.evaluationsAsSubject.filter(evaluation => evaluation.author._id === viewerId);
    return scout;
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

export async function createTokenForUser(name: string, dateOfBirthString: string): Promise<string | null> {
    const user = await findScoutByNameAndBirthday(name, new Date(dateOfBirthString));
    if (user) {
        return jwt.sign({userId: user._id}, SECRET);
    } else {
        return null;
    }
}