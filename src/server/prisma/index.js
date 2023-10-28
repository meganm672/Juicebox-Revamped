const prisma = require("../../../client");
const { faker } = require("@faker-js/faker");

async function main() {
  console.log("seeding the database");
  try {
    await Promise.all(
      [...Array(4)].map(() => {
        prisma.users.create({
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            location: faker.location.city(),
            posts:{
              create: [...Array(4)].map(()=>{
                
              })
            }
          }
        })
      })
    )
  } catch (error) {
    console.error(error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })