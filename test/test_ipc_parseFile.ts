import { handleParseFileBase } from '../src/main/modules/parseFile/handler';

const fp: string = process.argv[2];

handleParseFileBase({
  fp,
  isErp: true,
  withHeader: true,
  onPreParseError: (e) => {
    console.error(e);
  },
  onValidateError: () => {
    // console.dir(err);
  },
  onParseError: () => {
    // console.dir(err);
  },
  onData: () => {
    // console.dir(data);
  },
});
