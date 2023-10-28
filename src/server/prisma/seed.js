const prisma = require("../../../client");


async function main() {
  console.log("seeding the database");
  try {
    await prisma.users.create({
      data: {
        username: 'katmeow',
        password: 'kitten12345',
        name: 'lucy lu',
        location: 'Sidney, Australia',
        active: true,
        posts: {
          create: [
            {
              title: "First Post",
              content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#youcandoanything" }
                ]
              }
            },
            {
              title: "My Post about cats",
              content: "This is my first post about cats. I really love cats lets hope i can convey this in my post.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#catscatscats" }
                ]
              }
            },
            {
              title: "My Post about dogs",
              content: "This is my first post about dogs. All dogs are puppies no matter their age.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#dogsdogsdogs" }
                ]
              }
            }
          ]
        }
      },
    })
    await prisma.users.create({
      data: {
        username: 'pumpkinkings',
        password: 'mermaid25',
        name: 'jack',
        location: 'Ain\'t tellin\'',
        active: true,
        posts: {
          create: [
            {
              title: "How does this work?",
              content: "Seriously, does this even do anything?",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#worst-day-ever" }
                ]
              }
            },
            {
              title: "My Post about cats",
              content: "This is my first post about cats. I really love cats lets hope i can convey this in my post.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#catscatscats" }
                ]
              }
            },
            {
              title: "My Post about dogs",
              content: "This is my first post about dogs. All dogs are puppies no matter their age.",
              tags: {
                create: [
                  { name: "#happy" },
                  { name: "#dogsdogsdogs" }
                ]
              }
            }
          ]
        }
      }
    }),
      await prisma.users.create({
        data: {
          username: 'fashioncater',
          password: 'kitten123',
          name: 'simba',
          location: 'Upper East Side',
          active: true,
          posts: {
            create: [
              {
                title: "Living the Glam Life",
                content: "Do you even? I swear that half of you are posing.",
                tags: {
                  create: [
                    { name: "#happy" },
                    { name: "#youcandoanything" },
                    { name: "#canmandoeverything" }
                  ]
                }
              },
              {
                title: "My Post about cats",
                content: "This is my first post about cats. I really love cats lets hope i can convey this in my post.",
                tags: {
                  create: [
                    { name: "#happy" },
                    { name: "#catscatscats" }
                  ]
                }
              },
              {
                title: "My Post about dogs",
                content: "This is my first post about dogs. All dogs are puppies no matter their age.",
                tags: {
                  create: [
                    { name: "#happy" },
                    { name: "#dogsdogsdogs" }
                  ]
                }
              }
            ]
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