const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const features = [
  "date_filter",
  "age_filter",
  "gender_filter",
  "bar_chart_click",
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate() {
  const now = new Date();
  const past = new Date(now);
  past.setDate(now.getDate() - 10);

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

async function main() {
  console.log("Clearing existing data...");
  // remove previous entries to allow repeated seeding
  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  const users = [];

  const bcrypt = require("bcryptjs");
  for (let i = 1; i <= 20; i++) {
    const hashed = await bcrypt.hash("password", 10);
    const user = await prisma.user.create({
      data: {
        username: "user" + i,
        password: hashed,
        age: Math.floor(Math.random() * 60) + 15,
        gender: randomFromArray(["Male", "Female", "Other"]),
      },
    });

    users.push(user);
  }

  console.log("Seeding feature clicks...");

  for (let i = 0; i < 100; i++) {
    const user = randomFromArray(users);

    await prisma.featureClick.create({
      data: {
        user_id: user.id,
        feature_name: randomFromArray(features),
        timestamp: randomDate(),
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
