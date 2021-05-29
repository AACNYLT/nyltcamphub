export const compatInfo = {
    serverVersion: 2.0,
    minClientVersion: 4.0
};

export const DB_URL: string = process.env.DB_URL ?? '';
export const AZURE_STORAGE_ACCOUNT_NAME: string = process.env.AZURE_STORAGE_ACCOUNT_NAME ?? '';
export const AZURE_STORAGE_ACCOUNT_ACCESS_KEY: string = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY ?? '';

export const SECRET: string = process.env.SECRET ?? '';

export const AZURE_CONTAINER_NAME: string = 'camphub-images';


export enum PermissionLevel {
    PARTICIPANT = 1,
    STAFF = 2,
    SENIOR_STAFF = 3,
    ADMIN = 4
}