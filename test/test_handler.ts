import { handleParseFileBase } from '../src/main/handlers/handleParseFile';

const fp: string = process.argv[2];

const withHeader = process.argv[3] === '1';

handleParseFileBase(
  null,
  fp,
  withHeader,
  (_, err) => {
    console.dir(JSON.stringify(err));
  },
  (_, err) => {
    console.dir(JSON.stringify(err));
  }
);
