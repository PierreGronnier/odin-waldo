const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

  // ===== GAME 1 =====
  await prisma.game.create({
    data: {
      name: "The Dutch Proverbs",
      imageUrl: "the-dutch-proverbs/main.webp",
      characters: {
        create: [
          {
            name: "Fear makes the old woman trot",
            imageUrl: "the-dutch-proverbs/the-shepardess.png",
            description:
              "Meaning : An unexpected event can reveal unknown qualities",
            x: 79.39,
            y: 11.88,
          },
          {
            name: "To sit between two stools in the ashes",
            imageUrl: "the-dutch-proverbs/old-man.png",
            description: "Meaning : To be indecisive",
            x: 10.9,
            y: 61.45,
          },
          {
            name: "Wild bears prefer each other's company",
            imageUrl: "the-dutch-proverbs/wild-bears.png",
            description:
              "Meaning : Peers get along better with each other than with outsiders",
            x: 94.46,
            y: 26.07,
          },
          {
            name: "Bang one’s head against the wall",
            imageUrl: "the-dutch-proverbs/the-prisoner.png",
            description:
              "Meaning : To continue trying to do something that seems hopeless",
            x: 34.81,
            y: 55.79,
          },
        ],
      },
    },
  });

  // ===== GAME 2 =====
  await prisma.game.create({
    data: {
      name: "Children’s Games",
      imageUrl: "childrens-games/main.webp",
      characters: {
        create: [
          {
            name: "A doll",
            imageUrl: "childrens-games/doll.png",
            description: "Playing with doll",
            x: 3.85,
            y: 73.42,
          },
          {
            name: "A hand game",
            imageUrl: "childrens-games/A-hand-game.png",
            description:
              "Possibly the morra, a hand game - similar to rock, paper, scissors - that dates back thousands of years to ancient Roman and Greek times",
            x: 37.65,
            y: 70.38,
          },
          {
            name: "Hobby-horse",
            imageUrl: "childrens-games/hobby-horse.png",
            description:
              "Riding a wooden hobby horse made of a straight stick with a small horse's head",
            x: 38.79,
            y: 91.56,
          },
          {
            name: "Raisinbread man",
            imageUrl: "childrens-games/raisinbread-man.png",
            description:
              "A man-shaped loaf of bread, most likely some sort of Dutch duivekater, offered during wakes or at Christmas",
            x: 87.94,
            y: 53.86,
          },
        ],
      },
    },
  });

  // ===== GAME 3 =====
  await prisma.game.create({
    data: {
      name: "The Garden of Earthly Delights",
      imageUrl: "TheGardenofEarthlyDelights/main.jpg",
    },
  });

  // ===== GAME 4 =====
  await prisma.game.create({
    data: {
      name: "Along the river during the Qingming festival",
      imageUrl: "AlongtheRiverDuringtheQingmingFestival/main.jpg",
    },
  });

  console.log("✅ Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
