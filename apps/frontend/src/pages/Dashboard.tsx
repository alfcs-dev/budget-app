import React from 'react';
import { useAuth } from '../providers/hooks/useAuth';
import { useAccounts, useExpenses, useCategoryExpenses, useHealthCheck } from '../hooks/api-hooks';
import { AccountType, formatCurrencyMXN } from '@budget-manager/database';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: healthData } = useHealthCheck();
  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: educationExpenses } = useCategoryExpenses('cat-educacion');

  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
  const creditAccounts = accounts?.filter(acc => acc.type === AccountType.CREDIT) || [];
  const debitAccounts = accounts?.filter(acc => acc.type === AccountType.DEBIT) || [];
  const savingsAccounts = accounts?.filter(acc => acc.type === AccountType.SAVINGS) || [];

  if (accountsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Manager</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${healthData?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {healthData?.status === 'healthy' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrencyMXN(totalBalance)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{accounts?.length || 0} accounts</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Education Expenses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {educationExpenses ? formatCurrencyMXN(educationExpenses.total) : '$0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Current month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            {expenses ? formatCurrencyMXN(expenses.reduce((sum, exp) => sum + exp.amount, 0)) : '$0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-1">{expenses?.length || 0} transactions</p>
        </div>
      </div>

      {/* Mexican Bank Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Mexican Bank Accounts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Savings Accounts */}
              {savingsAccounts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Savings</h3>
                  {savingsAccounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-sm text-gray-500">{account.bank} • {account.type}</p>
                        {account.CLABE && (
                          <p className="text-xs text-gray-400">CLABE: {account.CLABE}</p>
                        )}
                      </div>
                      <p className="font-bold text-green-600">{formatCurrencyMXN(account.balance)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Debit Accounts */}
              {debitAccounts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Debit</h3>
                  {debitAccounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-sm text-gray-500">{account.bank} • {account.type}</p>
                        {account.CLABE && (
                          <p className="text-xs text-gray-400">CLABE: {account.CLABE}</p>
                        )}
                      </div>
                      <p className="font-bold text-blue-600">{formatCurrencyMXN(account.balance)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Credit Accounts */}
              {creditAccounts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Credit</h3>
                  {creditAccounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-sm text-gray-500">{account.bank} • {account.type}</p>
                        {account.CLABE && (
                          <p className="text-xs text-gray-400">CLABE: {account.CLABE}</p>
                        )}
                      </div>
                      <p className="font-bold text-purple-600">{formatCurrencyMXN(account.balance)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
          </div>
          <div className="p-6">
            {expensesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : expenses && expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.slice(0, 5).map(expense => (
                  <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Category: {expense.categoryId}</span>
                        <span>•</span>
                        <span>{new Date(expense.date).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                    <p className="font-bold text-red-600">-{formatCurrencyMXN(expense.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No expenses found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};