import { handleParseFileBase } from '../src/main/modules/parseFile/handler';

const fp: string = process.argv[2];

const withHeader = process.argv[3] === '1';

handleParseFileBase(
  fp,
  withHeader,
  (err) => {
    console.dir(err);
  },
  (err) => {
    console.dir(err);
  },
  (data) => {
    if (data.progress === undefined) {
      console.dir(data);
    }
  }
);
