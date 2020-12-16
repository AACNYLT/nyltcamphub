import { IScout } from '../../src/models';
import { LOG_IN_URL } from './Constants';

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
            throw 'Non-200|401 response calling /login';
    }
}