// apps/backend/prisma/seed-budget.ts
import { PrismaClient, BudgetPeriod, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting budget seed...');

  // Create or find user
  const email = 'your-email@example.com'; // Change this
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Your Name',
        password: await hash('your-password', 10), // Change this
      },
    });
    console.log('✅ User created');
  }

  // Create accounts based on your actual accounts
  const accounts = [
    { name: 'HSBC Checking', type: AccountType.CHECKING, balance: 50000, bankCode: 'HSBC' },
    { name: 'HSBC Savings', type: AccountType.SAVINGS, balance: 30000, bankCode: 'HSBC' },
    { name: 'Nu Credit Card', type: AccountType.CREDIT_CARD, balance: -5000, bankCode: 'NU' },
    { name: 'Stori Credit Card', type: AccountType.CREDIT_CARD, balance: -3000, bankCode: 'STORI' },
    { name: 'Cash', type: AccountType.CASH, balance: 5000 },
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { 
        name_userId: { 
          name: account.name, 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        ...account,
        userId: user.id,
      },
    });
  }
  console.log('✅ Accounts created');

  // Create category hierarchy based on your expense analysis
  const categories = [
    // Main categories
    { name: 'Income', description: 'All income sources' },
    { name: 'Housing', description: 'Rent, utilities, and home expenses' },
    { name: 'Transportation', description: 'Auto and transportation costs' },
    { name: 'Food & Dining', description: 'Groceries and dining out' },
    { name: 'Education', description: 'Courses and educational expenses' },
    { name: 'Entertainment', description: 'Subscriptions and entertainment' },
    { name: 'Personal Care', description: 'Health, beauty, and personal items' },
    { name: 'Financial', description: 'Savings, investments, and fees' },
    { name: 'Shopping', description: 'Clothing and general shopping' },
    { name: 'Others', description: 'Miscellaneous expenses' },
  ];

  const createdCategories = new Map();
  
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { 
        name_userId: { 
          name: category.name, 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        ...category,
        userId: user.id,
        color: getColorForCategory(category.name),
        icon: getIconForCategory(category.name),
      },
    });
    createdCategories.set(category.name, created);
  }
  console.log('✅ Main categories created');

  // Create subcategories
  const subcategories = [
    { name: 'Rent', parentName: 'Housing' },
    { name: 'Electricity', parentName: 'Housing' },
    { name: 'Internet', parentName: 'Housing' },
    { name: 'Gas', parentName: 'Housing' },
    { name: 'Water', parentName: 'Housing' },
    { name: 'Gasoline', parentName: 'Transportation' },
    { name: 'Car Insurance', parentName: 'Transportation' },
    { name: 'Car Maintenance', parentName: 'Transportation' },
    { name: 'Parking', parentName: 'Transportation' },
    { name: 'Groceries', parentName: 'Food & Dining' },
    { name: 'Restaurants', parentName: 'Food & Dining' },
    { name: 'Food Delivery', parentName: 'Food & Dining' },
    { name: 'Online Courses', parentName: 'Education' },
    { name: 'Books', parentName: 'Education' },
    { name: 'Certifications', parentName: 'Education' },
    { name: 'Netflix', parentName: 'Entertainment' },
    { name: 'Spotify', parentName: 'Entertainment' },
    { name: 'Disney+', parentName: 'Entertainment' },
    { name: 'YouTube Premium', parentName: 'Entertainment' },
    { name: 'Gym', parentName: 'Personal Care' },
    { name: 'Medical', parentName: 'Personal Care' },
    { name: 'Haircut', parentName: 'Personal Care' },
    { name: 'Savings', parentName: 'Financial' },
    { name: 'Investments', parentName: 'Financial' },
    { name: 'Bank Fees', parentName: 'Financial' },
  ];

  for (const subcat of subcategories) {
    const parent = createdCategories.get(subcat.parentName);
    await prisma.category.upsert({
      where: { 
        name_userId: { 
          name: subcat.name, 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: subcat.name,
        parentId: parent.id,
        userId: user.id,
        color: parent.color,
      },
    });
  }
  console.log('✅ Subcategories created');

  // Create budgets based on your actual expense analysis
  // Monthly budgets (from your PDF analysis)
  const monthlyBudgets = [
    { category: 'Housing', amount: 25000, notes: 'Rent + utilities' },
    { category: 'Transportation', amount: 8000, notes: 'Gas + maintenance + insurance' },
    { category: 'Food & Dining', amount: 15000, notes: 'Groceries + restaurants' },
    { category: 'Education', amount: 5000, notes: 'Courses and books' },
    { category: 'Entertainment', amount: 1500, notes: 'Streaming services' },
    { category: 'Personal Care', amount: 3000, notes: 'Gym + medical + grooming' },
    { category: 'Financial', amount: 40000, notes: 'Savings and investments target' },
    { category: 'Shopping', amount: 5000, notes: 'Clothing and household items' },
    { category: 'Others', amount: 7500, notes: 'Buffer for unexpected expenses' },
  ];

  const startDate = new Date();
  startDate.setDate(1); // Start from first day of current month
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1); // One year budget

  for (const budget of monthlyBudgets) {
    const category = createdCategories.get(budget.category);
    if (category) {
      await prisma.budget.upsert({
        where: {
          categoryId_userId_period: {
            categoryId: category.id,
            userId: user.id,
            period: BudgetPeriod.MONTHLY,
          },
        },
        update: {
          amount: budget.amount,
          isActive: true,
        },
        create: {
          name: `${budget.category} Monthly Budget`,
          amount: budget.amount,
          period: BudgetPeriod.MONTHLY,
          startDate,
          endDate,
          categoryId: category.id,
          userId: user.id,
        },
      });
    }
  }
  console.log('✅ Monthly budgets created');

  // Create biweekly budgets for more granular tracking
  const biweeklyBudgets = [
    { category: 'Groceries', amount: 6000, notes: 'Biweekly grocery shopping' },
    { category: 'Gasoline', amount: 3000, notes: 'Biweekly gas budget' },
    { category: 'Restaurants', amount: 2000, notes: 'Dining out budget' },
  ];

  for (const budget of biweeklyBudgets) {
    const category = await prisma.category.findFirst({
      where: { 
        name: budget.category,
        userId: user.id,
      },
    });
    
    if (category) {
      await prisma.budget.create({
        data: {
          name: `${budget.category} Biweekly Budget`,
          amount: budget.amount,
          period: BudgetPeriod.BIWEEKLY,
          startDate,
          endDate,
          categoryId: category.id,
          userId: user.id,
        },
      });
    }
  }
  console.log('✅ Biweekly budgets created');

  // Create annual budgets for big expenses
  const annualBudgets = [
    { category: 'Car Insurance', amount: 15000, notes: 'Annual car insurance' },
    { category: 'Certifications', amount: 20000, notes: 'Professional certifications' },
  ];

  for (const budget of annualBudgets) {
    const category = await prisma.category.findFirst({
      where: { 
        name: budget.category,
        userId: user.id,
      },
    });
    
    if (category) {
      await prisma.budget.create({
        data: {
          name: `${budget.category} Annual Budget`,
          amount: budget.amount,
          period: BudgetPeriod.ANNUAL,
          startDate,
          endDate,
          categoryId: category.id,
          userId: user.id,
        },
      });
    }
  }
  console.log('✅ Annual budgets created');

  // Summary
  const totalMonthlyBudget = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0);
  const monthlyIncome = 140000; // Your net income from the analysis
  const monthlySavingsRate = ((monthlyIncome - (totalMonthlyBudget - 40000)) / monthlyIncome * 100).toFixed(1);

  console.log('\n📊 Budget Summary:');
  console.log(`💰 Monthly Income: $${monthlyIncome.toLocaleString()} MXN`);
  console.log(`📉 Monthly Budget: $${totalMonthlyBudget.toLocaleString()} MXN`);
  console.log(`💵 Monthly Savings: $${(40000).toLocaleString()} MXN`);
  console.log(`📈 Savings Rate: ${monthlySavingsRate}%`);
  console.log(`🎯 Emergency Fund Goal (6 months): $${((totalMonthlyBudget - 40000) * 6).toLocaleString()} MXN`);
}

function getColorForCategory(name: string): string {
  const colors: Record<string, string> = {
    'Income': '#10b981',
    'Housing': '#ef4444',
    'Transportation': '#f59e0b',
    'Food & Dining': '#f97316',
    'Education': '#6366f1',
    'Entertainment': '#8b5cf6',
    'Personal Care': '#ec4899',
    'Financial': '#14b8a6',
    'Shopping': '#f472b6',
    'Others': '#9ca3af',
  };
  return colors[name] || '#6b7280';
}

function getIconForCategory(name: string): string {
  const icons: Record<string, string> = {
    'Income': '💰',
    'Housing': '🏠',
    'Transportation': '🚗',
    'Food & Dining': '🍽️',
    'Education': '📚',
    'Entertainment': '🎬',
    'Personal Care': '💊',
    'Financial': '💳',
    'Shopping': '🛍️',
    'Others': '📌',
  };
  return icons[name] || '📁';
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Budget setup completed successfully!');
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });