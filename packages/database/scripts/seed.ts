#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/seed';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    await seedDatabase(prisma);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();