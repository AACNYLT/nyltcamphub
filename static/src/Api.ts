import { ICourse, IScout } from '../../src/models';
import { ALL_COURSE_URL, COURSE_URL, LOG_IN_URL, SCOUT_URL } from './Constants';

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

export async function getAllCourses(token: string): Promise<ICourse[]> {
    const response = await fetch(ALL_COURSE_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const courses = await response.json() as ICourse[];
    if (courses) {
        return courses;
    } else {
        throw new Error(`Unable to parse response. Response code ${response.status}`)
    }
}

export async function deleteCourse(courseId: string, token: string) {
    const response = await fetch(`${COURSE_URL}/${courseId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.ok) {
        return;
    } else {
        throw new Error(`Error deleting course. Response code ${response.status}`)
    }
}

export async function getScout(scoutId: string, token: string): Promise<IScout | null> {
    const response = await fetch(`${SCOUT_URL}/${scoutId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status >= 200 && response.status <300) {
        return await response.json() as IScout;
    } else if (response.status === 400) {
        return null;
    } else {
        throw new Error(`Error getting scout. Response code ${response.status}`)
    }
}

export async function saveEvaluation(evaluation: any, scoutId: string, token: string): Promise<IScout> {
    const response = await fetch(`${SCOUT_URL}/${scoutId}/evaluations`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluation)
    });
    if (response.status >= 200 && response.status <300) {
        return await response.json() as IScout;
    } else {
        throw new Error(`Error saving evaluation. Response code ${response.status}`)
    }
}