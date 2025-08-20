import { SeedData } from './types';

// Base seed data derived from "Estimated expenses Mexico.xlsx"
export const seedData: SeedData = {
  users: [
    {
      id: 'user-1',
      email: 'demo@budget-app.com',
      password: '$2b$10$YnSrOei7fb5KHc89dAnO/ubZY5dp2M.A9L6XEt4g8264nJ5pim6I2', // hashed "password123"
    },
  ],

  accounts: [
    // Based on "Cuentas" sheet - Mexican banking accounts
    {
      id: 'account-hsbc',
      accountName: 'HSBC World Elite',
      type: 'Credit',
      bank: 'HSBC',
      accountNumber: '4069061****',
      clabe: '021180047******',
      balance: 0,
      userId: 'user-1',
    },
    {
      id: 'account-hsbc-ahorro',
      accountName: 'HSBC Ahorro',
      type: 'Savings',
      bank: 'HSBC',
      accountNumber: '4069062****',
      clabe: '021180041******',
      balance: 15000,
      userId: 'user-1',
    },
    {
      id: 'account-santander',
      accountName: 'Santander',
      type: 'Debit',
      bank: 'Santander',
      accountNumber: '6056706****',
      clabe: '014180617******',
      balance: 25000,
      userId: 'user-1',
    },
    {
      id: 'account-bbva',
      accountName: 'BBVA',
      type: 'Debit',
      bank: 'BBVA',
      accountNumber: '1537718****',
      clabe: '012180027******',
      balance: 18000,
      userId: 'user-1',
    },
    {
      id: 'account-nu',
      accountName: 'Nu',
      type: 'Credit',
      bank: 'Nu',
      accountNumber: '1774042****',
      clabe: '638180017******',
      balance: 0,
      userId: 'user-1',
    },
    {
      id: 'account-nu-debito',
      accountName: 'Nu Dalia Debito',
      type: 'Debit',
      bank: 'Nu',
      clabe: '638180018******',
      balance: 12000,
      userId: 'user-1',
    },
    {
      id: 'account-uala',
      accountName: 'Uala',
      type: 'Debit',
      bank: 'Uala',
      accountNumber: '1385800****',
      clabe: '638180019******',
      balance: 8500,
      userId: 'user-1',
    },
    {
      id: 'account-stori',
      accountName: 'Stori+',
      type: 'Credit',
      bank: 'Stori',
      accountNumber: '5579000****',
      balance: 0,
      userId: 'user-1',
    },
    {
      id: 'account-efectivo',
      accountName: 'Efectivo',
      type: 'Cash',
      balance: 2500,
      userId: 'user-1',
    },
  ],

  budgets: [
    {
      id: 'budget-familia',
      name: 'Presupuesto Familiar 2025',
      description: 'Presupuesto principal para gastos familiares y educación de los niños',
      ownerId: 'user-1',
    },
  ],

  categories: [
    // Based on expense patterns from "Actual" sheet
    {
      id: 'cat-educacion',
      name: 'Educación',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-hogar',
      name: 'Gastos del Hogar',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-auto',
      name: 'Automóvil',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-subscripciones',
      name: 'Subscripciones',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-seguros',
      name: 'Seguros y Mantenimiento',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-entretenimiento',
      name: 'Entretenimiento',
      budgetId: 'budget-familia',
    },
    {
      id: 'cat-salud',
      name: 'Salud',
      budgetId: 'budget-familia',
    },
  ],

  expenses: [
    // Education expenses (highest category from Excel)
    {
      id: 'exp-colegiatura-lena',
      description: 'Colegiatura Lena',
      amount: 18500,
      date: new Date('2024-09-15'),
      categoryId: 'cat-educacion',
      budgetId: 'budget-familia',
      accountId: 'account-hsbc',
    },
    {
      id: 'exp-colegiatura-leander',
      description: 'Colegiatura Leander',
      amount: 12300,
      date: new Date('2024-09-15'),
      categoryId: 'cat-educacion',
      budgetId: 'budget-familia',
      accountId: 'account-uala',
    },
    {
      id: 'exp-clases-aleman',
      description: 'Clases de alemán',
      amount: 2000,
      date: new Date('2024-09-15'),
      notes: '4 clases al mes',
      categoryId: 'cat-educacion',
      budgetId: 'budget-familia',
      accountId: 'account-hsbc',
    },
    
    // Home expenses
    {
      id: 'exp-luz',
      description: 'Luz',
      amount: 500,
      date: new Date('2024-09-05'),
      categoryId: 'cat-hogar',
      budgetId: 'budget-familia',
      accountId: 'account-nu',
    },
    {
      id: 'exp-gas',
      description: 'Gas',
      amount: 650,
      date: new Date('2024-09-08'),
      categoryId: 'cat-hogar',
      budgetId: 'budget-familia',
      accountId: 'account-bbva',
    },
    {
      id: 'exp-renta',
      description: 'Renta',
      amount: 37500,
      date: new Date('2024-09-01'),
      categoryId: 'cat-hogar',
      budgetId: 'budget-familia',
      accountId: 'account-hsbc-ahorro',
    },

    // Auto expenses
    {
      id: 'exp-verificacion',
      description: 'Verificación vehicular',
      amount: 100,
      date: new Date('2024-09-10'),
      categoryId: 'cat-auto',
      budgetId: 'budget-familia',
      accountId: 'account-nu',
    },
    {
      id: 'exp-tenencia',
      description: 'Tenencia',
      amount: 208.33,
      date: new Date('2024-09-12'),
      categoryId: 'cat-auto',
      budgetId: 'budget-familia',
      accountId: 'account-stori',
    },
    {
      id: 'exp-gasolina',
      description: 'Gasolina',
      amount: 3500,
      date: new Date('2024-09-14'),
      categoryId: 'cat-auto',
      budgetId: 'budget-familia',
      accountId: 'account-bbva',
    },

    // Subscriptions
    {
      id: 'exp-netflix',
      description: 'Netflix',
      amount: 299,
      date: new Date('2024-09-01'),
      categoryId: 'cat-subscripciones',
      budgetId: 'budget-familia',
      accountId: 'account-nu',
    },
    {
      id: 'exp-prime',
      description: 'Amazon Prime',
      amount: 74.92,
      date: new Date('2024-09-03'),
      categoryId: 'cat-subscripciones',
      budgetId: 'budget-familia',
      accountId: 'account-stori',
    },
    {
      id: 'exp-hbo',
      description: 'HBO Max',
      amount: 133,
      date: new Date('2024-09-05'),
      categoryId: 'cat-subscripciones',
      budgetId: 'budget-familia',
      accountId: 'account-nu',
    },
  ],

  transfers: [
    // Based on "Totales y Transferencias" sheet patterns
    {
      id: 'transfer-1',
      amount: 5000,
      date: new Date('2024-09-15'),
      description: 'Transferencia para gastos del hogar',
      sourceAccountId: 'account-santander',
      destinationAccountId: 'account-uala',
      userId: 'user-1',
    },
    {
      id: 'transfer-2',
      amount: 15000,
      date: new Date('2024-09-01'),
      description: 'Ahorro mensual',
      sourceAccountId: 'account-santander',
      destinationAccountId: 'account-hsbc-ahorro',
      userId: 'user-1',
    },
  ],
};