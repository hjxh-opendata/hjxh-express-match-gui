import path from 'path';
import { app } from 'electron';

const sqlite3 = require('sqlite3').verbose();

// it's flexible for test
const dbDir = app === undefined ? '.' : app.getPath('userData');
const dbPath = path.join(dbDir, 'foobar.db');

export const db = new sqlite3.Database(':memory:');

