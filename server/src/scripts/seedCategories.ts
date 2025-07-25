import prisma from "../lib/prisma";

const defaultCategories = [
  {
    name: "Gaming",
  },
  { name: "Music" },
  {
    name: "Education",
  },
  {
    name: "Entertainment",
  },
  { name: "News" },
  { name: "Cooking" },
  { name: "Fitness" },
  { name: "Travel" },
  { name: "Technology" },
  { name: "Sports" },
];

async function seed() {
  console.log("🌱 Seeding database with default categories...");

  try {
    // Delete existing categories
    await prisma.category.deleteMany({});

    // Create default categories
    const createdCategories = await prisma.category.createMany({
      data: defaultCategories,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully seeded ${createdCategories.count} categories`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
