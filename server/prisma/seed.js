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
            name: "The shepardess",
            imageUrl: "the-dutch-proverbs/the-shepardess.png",
            x: 79.39,
            y: 11.88,
          },
          {
            name: "The old man",
            imageUrl: "the-dutch-proverbs/old-man.png",
            x: 10.9,
            y: 61.45,
          },
          {
            name: "Wild Bears",
            imageUrl: "the-dutch-proverbs/wild-bears.png",
            x: 94.46,
            y: 26.07,
          },
          {
            name: "The prisoner",
            imageUrl: "the-dutch-proverbs/the-prisoner.png",
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
            name: "The statue",
            imageUrl: "childrens-games/statue.webp",
            x: 3.85,
            y: 73.42,
          },
          {
            name: "Blue dress",
            imageUrl: "childrens-games/blue-dress.webp",
            x: 69.82,
            y: 41.67,
          },
          {
            name: "Fighting",
            imageUrl: "childrens-games/fighting.webp",
            x: 78.21,
            y: 27.27,
          },
          {
            name: "Sleeping",
            imageUrl: "childrens-games/sleeping.webp",
            x: 35.02,
            y: 30.41,
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
