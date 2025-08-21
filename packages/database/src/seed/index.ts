import { PrismaClient } from "@prisma/client";
import { seedData } from "./data";

export async function seedDatabase(prisma: PrismaClient) {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.transfer.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.category.deleteMany();
    await prisma.budgetCollaborator.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Seed users
    console.log("👤 Seeding users...");
    for (const user of seedData.users) {
      await prisma.user.create({
        data: user,
      });
    }

    // Seed accounts
    console.log("🏦 Seeding accounts...");
    for (const account of seedData.accounts) {
      const { clabe, ...accountData } = account;
      await prisma.account.create({
        data: {
          ...accountData,
          // Convert clabe to CLABE to match schema field name
          CLABE: clabe,
        },
      });
    }

    // Seed budgets
    console.log("💰 Seeding budgets...");
    for (const budget of seedData.budgets) {
      await prisma.budget.create({
        data: budget,
      });
    }

    // Seed categories
    console.log("📂 Seeding categories...");
    for (const category of seedData.categories) {
      await prisma.category.create({
        data: category,
      });
    }

    // Seed expenses
    console.log("💸 Seeding expenses...");
    for (const expense of seedData.expenses) {
      await prisma.expense.create({
        data: expense,
      });
    }

    // Seed transfers
    console.log("🔄 Seeding transfers...");
    for (const transfer of seedData.transfers) {
      await prisma.transfer.create({
        data: transfer,
      });
    }

    console.log("✅ Database seeding completed successfully!");

    // Print summary
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.budget.count(),
      prisma.category.count(),
      prisma.expense.count(),
      prisma.transfer.count(),
    ]);

    console.log(`
📊 Seeded data summary:
   👥 Users: ${counts[0]}
   🏦 Accounts: ${counts[1]}
   💰 Budgets: ${counts[2]}
   📂 Categories: ${counts[3]}
   💸 Expenses: ${counts[4]}
   🔄 Transfers: ${counts[5]}
    `);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Export for use in scripts
export { seedData } from "./data";
export * from "./types";
