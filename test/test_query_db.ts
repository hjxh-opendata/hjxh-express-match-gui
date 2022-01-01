import { dbQueryErp } from '../src/main/modules/queryDB/db';

const testQueryDB = async () => {
  const data = await dbQueryErp({ skip: 0, limit: 10 });
  console.log({ data });
};

testQueryDB();
