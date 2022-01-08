import { handleParseFileBase } from './handler';

// const fp: string = process.argv[2];
const fp =
  '/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/data/2021-11/erp/ERP1月廊坊圆通.csv';

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
