interface FakePrisma {
  erp: {
    create: any;
    upsert: any;
    findMany: any;
  };
}

// prettier-ignore
// export const prisma: FakePrisma = { erp: { create: () => {console.log('fake-database: creating one');}, findMany: () => {console.log('fake-database: finding many');}, upsert: () => {console.log('fake-database: upserting one');} } };
