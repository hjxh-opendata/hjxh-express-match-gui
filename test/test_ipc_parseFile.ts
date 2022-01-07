import { handleParseFileBase } from '../src/main/modules/parseFile/handler';

const fp: string = process.argv[2];

handleParseFileBase({
  fp,
  withHeader: true,
  onValidateError: (err) => {
    console.dir(err);
  },
  onParseError: (err) => {
    console.dir(err);
  },
  onData: (data) => {
    console.dir(data);
  },
});
