import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usersData = [ // we only have on user here
  {
   title:"Task 1",
   description:"Task Description",
   priority:"High",
   category:"Routine Task",
   time:new Date()
  }
]

const main = async () => {
  console.log('start seeding …') 
  for (const _user of usersData) {
    const user = await prisma.task.create({
      data: _user
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log('seeding done');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })