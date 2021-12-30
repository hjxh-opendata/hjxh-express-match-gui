var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('prisma/dev.db');

let s = `CREATE TABLE "Post" (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  "authorId" INTEGER NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "public"."User"(id)
);`;

s = s.split('\n').join(' ');

const s2 = `CREATE TABLE "Profile" (
  id SERIAL PRIMARY KEY NOT NULL,
  bio TEXT,
  "userId" INTEGER UNIQUE NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id)
);`;

db.serialize(function () {
  db.run(s);

  // db.each('SELECT row AS id, info FROM User', function (err, row) {
  //   console.log(row.id + ': ' + row.info);
  // });
});

db.close();
