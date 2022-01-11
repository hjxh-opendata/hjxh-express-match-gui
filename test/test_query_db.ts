import { queryDB } from '../src/main/modules/queryDB/db';

const testQueryDB = async () => {
  const data = await queryDB({ skip: 0, limit: 10 });
  console.log({ data });
};

testQueryDB();
