import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'foobar.db');

const db = new Database(dbPath, { verbose: console.log, fileMustExist: false });

const createTable = '';
db.exec(createTable);


const insert = db.prepare('INSERT INTO cats (name, age) VALUES (@name, @age)');

const insertMany = db.transaction((cats) => {
  cats.forEach(cat => insert.run(cat));
});

insertMany([
  { name: 'Joey', age: 2 },
  { name: 'Sally', age: 4 },
  { name: 'Junior', age: 1 }
]);

console.log('inserted db');

export default db;
