export const compatInfo = {
    serverVersion: 2.0,
    minClientVersion: 4.0
};

export const DB_URL: string = process.env.DB_URL ?? '';

export const SECRET: string = process.env.SECRET ?? '';

export const ADMIN_PERMISSION_LEVEL = 4;
export const SENIOR_STAFF_PERMISSION_LEVEL = 3;