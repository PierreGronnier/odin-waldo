const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // Supprimer l'existant (optionnel mais pratique en dev)
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

  // ===== GAME 1 =====
  await prisma.game.create({
    data: {
      name: "The Dutch Proverbs",
      imageUrl: "TheDutchProverbs.webp",
      characters: {
        create: [
          {
            name: "The shepherdess",
            x: 79.39272375205687,
            y: 11.887548949988995,
          },
          {
            name: "The old man",
            x: 10.907697043070316,
            y: 61.450536034123715,
          },
          {
            name: "Wild Bears",
            x: 65.75501325610055,
            y: 33.71201115096641,
          },
          {
            name: "The prisoner",
            x: 34.81074940690678,
            y: 55.79815754142082,
          },
        ],
      },
    },
  });

  // ===== GAME 2 =====
  await prisma.game.create({
    data: {
      name: "Children’s Games",
      imageUrl: "TheElderChildrensGames.webp",
      characters: {
        create: [
          {
            name: "The statue",
            x: 3.854135164542749,
            y: 73.42126404051992,
          },
          {
            name: "Blue dress",
            x: 69.82903569592166,
            y: 41.678997429049744,
          },
          {
            name: "Fighting",
            x: 78.21919282607286,
            y: 27.270834163743622,
          },
          {
            name: "Sleeping",
            x: 35.02322360100111,
            y: 30.413691306600764,
          },
        ],
      },
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
