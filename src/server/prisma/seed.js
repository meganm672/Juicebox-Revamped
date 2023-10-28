const prisma = require("../../../client");


async function main() {
  console.log("seeding the database");
  try {
    const createUser = await prisma.users.createMany({
      data: 
        {
          username: 'albert',
          password: 'bertie99',
          name: 'Al Bert',
          location: 'Sidney, Australia',
          posts:{
            create:{
              title: "First Post About Dogs",
              content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
              tags: ["#happy", "#youcandoanything"],
              active: true,
         
            }
          },

          active: true
        }
    
      //   {
      //     username: 'sandra',
      //     password: '2sandy4me',
      //     name: 'Just Sandra',
      //     location: 'Ain\'t tellin\'',
      //     posts:{
      //       create:{
      //         title: "First Post About Cats",
      //         content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      //         tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
      //       }
      //     }
      //   },
      //   {
      //     username: 'glamgal',
      //     password: 'soglam',
      //     name: 'Joshua',
      //     location: 'Upper East Side',
      //     posts:{
      //       create:{
      //         title: "First Post About Frogs",
      //         content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      //         tags: ["#happy", "#worst-day-ever"]
      //       }
      //     }
      //   }
      // ]
    })
    return createUser
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