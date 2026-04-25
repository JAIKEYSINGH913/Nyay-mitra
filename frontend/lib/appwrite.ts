import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ea8a7a002018cfcf34');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database & Collection IDs
export const NYAY_DB_ID = 'nyay_mitra';
export const COLLECTIONS = {
    PROFILES: 'profiles',
    CHAT_HISTORY: 'chat_history',
    MESSAGES: 'messages',
    SERVICE_HISTORY: 'service_history'
};

export { client, ID };
