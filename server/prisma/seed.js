const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  await prisma.character.deleteMany();
  await prisma.score.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.game.deleteMany();

  // ===== GAME 1 =====
  await prisma.game.create({
    data: {
      name: "The Dutch Proverbs",
      imageUrl: "the-dutch-proverbs/main.webp",
      description: JSON.stringify({
        artist: "Pieter Bruegel the Elder",
        year: "1559",
        location: "Gemäldegalerie, Berlin",
        intro:
          "Over 100 Flemish proverbs brought to life in a single painting.",
        body: "Also known as 'The Blue Cloak', this oil painting on oak panel shows a Flemish village where nearly every figure illustrates a proverb. At the center, a woman drapes a blue cloak over her husband, symbolizing deceit. Around them, villagers perform familiar sayings: filling a pond after the calf has drowned, carrying daylight in a basket, or banging one's head against a wall. Scholars have identified around 120 proverbs woven into the scene. Some survive in modern language, while others faded over time. Bruegel observes human folly with irony rather than judgment, and the popularity of the composition led his son, Pieter Brueghel the Younger, to produce numerous copies.",
        funFact:
          "In 2024, a puzzle video game titled 'Proverbs' recreated the painting as a massive 54,000-piece grid, allowing players to uncover each proverb individually. It received strongly positive reviews.",
        youtubeUrl: "https://www.youtube.com/watch?v=tboRw6CPXjI",
        youtubeLabel:
          "Bruegel's Netherlandish Proverbs explained in detail (HD)",
      }),
      characters: {
        create: [
          {
            name: "Fear makes the old woman trot",
            imageUrl: "the-dutch-proverbs/the-shepardess.png",
            description:
              "Meaning: An unexpected event can reveal hidden strength or unknown qualities in a person.",
            x: 79.39,
            y: 11.88,
          },
          {
            name: "To sit between two stools in the ashes",
            imageUrl: "the-dutch-proverbs/old-man.png",
            description:
              "Meaning: To be indecisive and risk losing everything as a result.",
            x: 10.9,
            y: 61.45,
          },
          {
            name: "Wild bears prefer each other's company",
            imageUrl: "the-dutch-proverbs/wild-bears.png",
            description:
              "Meaning: People of the same kind tend to stick together. Peers get along better with each other than with outsiders.",
            x: 94.46,
            y: 26.07,
          },
          {
            name: "The prisoner",
            imageUrl: "the-dutch-proverbs/the-prisoner.png",
            description:
              "One of the few figures in the painting for which no clearly documented proverb has been identified. Nearly five centuries of linguistic and cultural change may explain why the meaning has been lost.",
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
      name: "Children's Games",
      imageUrl: "childrens-games/main.webp",
      description: JSON.stringify({
        artist: "Pieter Bruegel the Elder",
        year: "1560",
        location: "Kunsthistorisches Museum, Vienna",
        intro: "More than 200 children absorbed in over 80 different games.",
        body: "Seen from an elevated viewpoint, an entire town square is filled exclusively with children. The Kunsthistorisches Museum identifies more than 80 distinct games played simultaneously, including hoops, stilts, leapfrog, blind man's buff, hobby horses, mock weddings, and knucklebones. The children range from toddlers to adolescents and wear miniature versions of adult clothing. Scholars believe this painting may have been conceived as part of a broader reflection on the stages of life, possibly representing Youth. Bruegel portrays children immersed in their activities with the same seriousness that adults bring to politics, commerce, or religion. A Flemish poem from the sixteenth century compared humanity to children lost in trivial pursuits, an idea Bruegel was likely aware of.",
        funFact:
          "Many of the games depicted, such as marbles, leapfrog, spinning tops, and blind man's buff, are still played today in forms remarkably similar to those of the sixteenth century.",
      }),
      characters: {
        create: [
          {
            name: "A doll",
            imageUrl: "childrens-games/doll.png",
            description:
              "A doll, one of the simplest and oldest toys depicted in the painting.",
            x: 3.85,
            y: 73.42,
          },
          {
            name: "A hand game",
            imageUrl: "childrens-games/A-hand-game.png",
            description:
              "Possibly the morra, a hand-gesture game similar to rock, paper, scissors that dates back thousands of years to ancient Roman and Greek times.",
            x: 37.65,
            y: 70.38,
          },
          {
            name: "Hobby horse",
            imageUrl: "childrens-games/hobby-horse.png",
            description:
              "A child riding a wooden hobby horse made of a straight stick with a small carved horse's head, a toy that appears across cultures and centuries.",
            x: 38.79,
            y: 91.56,
          },
          {
            name: "Raisinbread man",
            imageUrl: "childrens-games/raisinbread-man.png",
            description:
              "A man-shaped loaf of bread, most likely a Dutch duivekater, a festive bread traditionally offered during wakes or at Christmas celebrations.",
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
      description: JSON.stringify({
        artist: "Hieronymus Bosch",
        year: "circa 1490 to 1510",
        location: "Museo Nacional del Prado, Madrid",
        intro:
          "Paradise, earthly pleasure, and damnation unfolding from left to right.",
        body: "This triptych presents a sweeping narrative. The left panel depicts God presenting Eve to Adam within an already extraordinary garden populated by exotic animals and fantastic architecture. The central panel is one of the most debated images in Western art history, showing hundreds of nude figures engaged in ambiguous pleasures among oversized fruits and strange crystalline structures. The right panel portrays a terrifying vision of Hell, where musical instruments become tools of torment and human excess meets punishment. A haunting tree-like figure with a human face gazes outward, often interpreted as a self-referential presence. Bosch never left written explanations of his imagery. The work is generally associated with the court of Engelbert II of Nassau and has been at the Prado since the sixteenth century, drawing millions of visitors each year.",
        funFact:
          "Surrealist artists such as Joan Miro and Salvador Dali studied this painting closely and cited Bosch as a major influence on their own imaginative worlds.",
        youtubeUrl: "https://www.youtube.com/watch?v=vBG621XEegk",
        youtubeLabel:
          "Hieronymus Bosch, The Garden of Earthly Delights: Great Art Explained",
      }),
      characters: {
        create: [
          {
            name: "Adam and Eve",
            imageUrl: "TheGardenofEarthlyDelights/adam-and-eve.png",
            description:
              "A man and a woman often interpreted as Adam and Eve, though their identity remains debated. They evoke the origin of humanity and the awakening of desire, innocence standing at the threshold of temptation.",
            x: 72.16,
            y: 88.63,
          },
          {
            name: "The horned demon",
            imageUrl: "TheGardenofEarthlyDelights/the-horned-demon.png",
            description:
              "A horned creature mounted on horseback, advancing with authority and menace. He symbolizes punishment and the organized violence of damnation, a relentless force driving the consequences of human excess.",
            x: 79.74,
            y: 21,
          },
          {
            name: "A rabbit",
            imageUrl: "TheGardenofEarthlyDelights/rabbit.png",
            description:
              "Traditionally linked to fertility and instinct, the rabbit here takes on a darker tone, reflecting how natural impulses can become deeply unsettling when desire spirals out of control.",
            x: 22.41,
            y: 78,
          },
          {
            name: "The seated man",
            imageUrl: "TheGardenofEarthlyDelights/a-pensive-man.png",
            description:
              "A solitary man seated within a strange hollow structure, quietly observing the surrounding chaos. Often interpreted as a subtle self-reference by Bosch himself, the painter watching his own vision of Hell unfold.",
            x: 85.46,
            y: 42.6,
          },
        ],
      },
    },
  });

  // ===== GAME 4 =====
  await prisma.game.create({
    data: {
      name: "Along the River During the Qingming Festival",
      imageUrl: "AlongtheRiverDuringtheQingmingFestival/main.jpg",
      description: JSON.stringify({
        artist: "Court artists of the Qing dynasty",
        year: "18th century",
        location: "Palace Museum, Beijing",
        intro:
          "A richly colored imperial version of the famous Qingming scroll.",
        body: "This version of 'Along the River During the Qingming Festival' was produced by court artists during the Qing dynasty in the eighteenth century. Unlike the earlier Northern Song monochrome ink scroll attributed to Zhang Zeduan, this imperial adaptation is executed in vivid colors and with heightened decorative detail. The composition retains the panoramic format and gradual narrative unfolding from countryside to city, but the architecture, costumes, and urban atmosphere reflect Qing-era aesthetics. Merchants, officials, performers, travelers, and laborers animate the vast scene, offering an idealized vision of prosperity and social harmony under imperial rule. The famous bridge scene remains a central moment of movement and tension, yet the overall tone emphasizes order, wealth, and refinement.",
        funFact:
          "Several Qing dynasty versions of the Qingming scroll were commissioned by the imperial court, meant not only to celebrate daily life but also to project stability and grandeur under imperial authority.",
      }),
      characters: {
        create: [
          {
            name: "Li the Launderer",
            imageUrl: "AlongtheRiverDuringtheQingmingFestival/Li.png",
            description:
              "Dressed in a blue tunic, Li kneels by the riverbank using a wooden mallet to beat his laundry against a flat stone. A woven basket sits nearby, ready to carry his clean clothes back home.",
            x: 28.76,
            y: 69.3,
          },
          {
            name: "Clumsy Chao",
            imageUrl: "AlongtheRiverDuringtheQingmingFestival/Chao.png",
            description:
              "This unfortunate traveler has just tumbled off his donkey and lies sprawled on the ground. His hat has rolled away, and his donkey looks back in surprise at the sudden mess!",
            x: 73.47,
            y: 94.77,
          },
          {
            name: "Master Wun",
            imageUrl: "AlongtheRiverDuringtheQingmingFestival/Wun.png",
            description:
              "A bearded hermit sitting perfectly still amidst the city chaos, with a mysterious gourd by his side. Is he reaching deep spiritual enlightenment, or has he just had a bit too much rice wine?",
            x: 63.27,
            y: 76.01,
          },
          {
            name: "The Stage Stealers (Long & Feng)",
            imageUrl: "AlongtheRiverDuringtheQingmingFestival/Long.png",
            description:
              "Perched on their wooden platform, this dramatic pair performs a heated scene for the massive crowd below. With their bright robes and grand gestures, they are the undisputed stars of the riverbank.",
            x: 83.39,
            y: 62.64,
          },
          {
            name: "Sleepy Song",
            imageUrl: "AlongtheRiverDuringtheQingmingFestival/Song.png",
            description:
              "Tucked away under the shade of a large tree, Song has decided that the city's hustle is the perfect soundtrack for a nap. While everyone else rushes to trade and travel, he's comfortably curled up on his mat, dreaming the day away.",
            x: 36.36,
            y: 70.07,
          },
        ],
      },
    },
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
