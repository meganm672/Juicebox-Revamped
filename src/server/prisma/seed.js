const prisma = require("../../../client");


async function main() {
  console.log("seeding the database");
  try {
    await prisma.users.create({
      data: {
        username: 'lucylulu',
        password: 'kitten12345',
        name: 'lucy lu',
        location: 'Sidney, Australia',
        active: true,
        posts: {
          create: {
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
            tags: {
              create: [
                { name: "#happy" },
                { name: "#youcandoanything" }
              ]
            }
          }
        }
      },
    })
    await prisma.users.create({
      data: {
        username: 'ariel',
        password: 'mermaid25',
        name: 'ariel',
        location: 'Ain\'t tellin\'',
        active: true,
        posts: {
          create: {
            title: "How does this work?",
            content: "Seriously, does this even do anything?",
            tags: {
              create: [
                { name: "#happy" },
                { name: "#worst-day-ever" }
              ]
            }
          }
        }
      }
    }),
      await prisma.users.create({
        data: {
          username: 'fashioncat',
          password: 'kitten123',
          name: 'alvin',
          location: 'Upper East Side',
          active: true,
          posts: {
            create: {
              title: "Living the Glam Life",
              content: "Do you even? I swear that half of you are posing.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#youcandoanything" },
                  { name: "#canmandoeverything" }
                ]
              }
            }
          }
        }
      })

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