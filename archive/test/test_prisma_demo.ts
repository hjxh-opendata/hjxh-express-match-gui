import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .catch(console.log)
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(() => null); // ref: https://stackoverflow.com/a/60627437/9422455
