import 'dotenv/config';
import { Config } from 'drizzle-kit';
import { dbConfig } from './config/dbConfig';

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: dbConfig,
} satisfies Config;