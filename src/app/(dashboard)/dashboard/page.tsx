'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { 
    stats, 
    monthlyTrend, 
    expenseByCategory, 
    recentTransactions, 
    isLoading,
    errors 
  } = useDashboard();

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const hasErrors = errors.stats || errors.trend || errors.category || errors.recent;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      {/* Error Alert */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load some dashboard data. Please refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats?.total_balance || 0)}
          icon={Wallet}
          trend={stats?.monthly_change}
          isLoading={isLoading}
        />
        <StatCard
          title="Income (This Month)"
          value={formatCurrency(stats?.total_income || 0)}
          icon={TrendingUp}
          trend={10}
          trendUp={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Expenses (This Month)"
          value={formatCurrency(stats?.total_expense || 0)}
          icon={TrendingDown}
          trend={5}
          trendUp={false}
          isLoading={isLoading}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(stats?.net_savings || 0)}
          icon={DollarSign}
          trend={stats?.monthly_change}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value !== undefined ? formatCurrency(value) : ''
                      }
                    />
                    <Bar dataKey="income" fill="#10B981" name="Income" />
                    <Bar dataKey="expense" fill="#EF4444" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ payload }) => {
                        const { category_name, percentage } = payload;
                        return percentage > 5 ? `${category_name} ${percentage}%` : '';
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="category_name"
                    >
                      {(expenseByCategory || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.category_color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value !== undefined ? formatCurrency(value) : ''
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : recentTransactions?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent transactions</p>
            ) : (
              recentTransactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: transaction.category_color || '#3B82F6' }}
                    >
                      {transaction.category_name?.[0] || 'T'}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.account_name} • {transaction.category_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  isLoading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: number;
  trendUp?: boolean;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <Skeleton className="h-4 w-20 sm:w-24 mb-2" />
          <Skeleton className="h-6 sm:h-8 w-24 sm:w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trendUp !== undefined ? trendUp : (trend || 0) >= 0;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
            <p className="text-lg sm:text-2xl font-bold mt-2">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center mt-2 text-xs sm:text-sm ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 sm:h-10 w-32 sm:w-[200px]" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 sm:h-[120px]" />
        ))}
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-[300px] sm:h-[400px]" />
        <Skeleton className="h-[300px] sm:h-[400px]" />
      </div>
    </div>
  );
}