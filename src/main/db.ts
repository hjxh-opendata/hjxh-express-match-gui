import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// it's flexible for test
const dbDir = app === undefined ? '.' : app.getPath('userData');
const dbPath = path.join(dbDir, 'foobar.db');

export default new Database(dbPath, { verbose: console.log, fileMustExist: false });

