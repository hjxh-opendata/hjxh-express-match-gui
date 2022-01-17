import assert from 'assert';

import { validateArea } from '../src/main/modules/parseFile/handler/validators/validate_area/validateArea';

export const test_validate_area = (s1: string, s2: string) => {
  const s = validateArea(s1);
  console.log({ s1, s, s2 });
  assert(s === s2);
};

test_validate_area(process.argv[2], process.argv[3]);
