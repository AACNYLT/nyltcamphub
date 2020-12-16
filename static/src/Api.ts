import { ICourse, IScout } from '../../src/models';
import { COURSE_URL, LOG_IN_URL } from './Constants';

export async function getTokenForUser(user: IScout): Promise<string | null> {
    const response = await fetch(LOG_IN_URL, {
        method: 'POST', body: JSON.stringify(user), headers: {
            'Content-Type': 'application/json'
        }
    });
    switch (response.status) {
        case 200:
            return await response.text();
        case 401:
            return null;
        default:
            throw new Error('Non-200|401 response calling /login');
    }
}

export async function getScoutForToken(token: string): Promise<IScout> {
    const response = await fetch(COURSE_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const course = await response.json() as IScout;
    if (course) {
        return course;
    } else {
        throw new Error(`Unable to parse response. Response code ${response.status}`)
    }
}