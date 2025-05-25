import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbConfig } from '../../config/dbConfig';
import * as schema from './schema';

const pool = new Pool(dbConfig);

export const db = drizzle(pool, { schema });