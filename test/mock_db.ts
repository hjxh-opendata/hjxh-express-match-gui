import { createDefaultDatabase } from '../src/main/base/db/conn';

const db = '/Users/mark/Library/Application Support/hjxh_data.sqlite';
console.log({ db });
export default async () => createDefaultDatabase(db);
