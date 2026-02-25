'use client';

import { useMemo } from 'react';
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
    errors,
  } = useDashboard();

  // Sort recent transactions by latest date first (descending)
  const sortedRecentTransactions = useMemo(() => {
    if (!recentTransactions) return [];
    return [...recentTransactions].sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
    );
  }, [recentTransactions]);

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const hasErrors = errors.stats || errors.trend || errors.category || errors.recent;

  return (
    <div className="min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        Dashboard
      </h1>

      {/* Error Alert */}
      {hasErrors && (
        <Alert variant="destructive" className="max-w-3xl animate-in slide-in-from-top-2">
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
      <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Trend Bar Chart */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64 sm:h-72 lg:h-80">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTrend || []}
                    margin={{ top: 12, right: 12, left: -8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value !== undefined ? formatCurrency(value) : '—'
                      }
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill="#10B981"
                      name="Income"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#EF4444"
                      name="Expense"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category Pie Chart */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64 sm:h-72 lg:h-80">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-md" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={expenseByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      innerRadius="50%"
                      paddingAngle={2}
                      dataKey="total"
                      nameKey="category_name"
                      animationDuration={1500}
                    >
                      {(expenseByCategory || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.category_color || COLORS[index % COLORS.length]}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value !== undefined ? formatCurrency(value) : '—'
                      }
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-6">
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 sm:h-16 w-full rounded-lg" />
              ))
            ) : sortedRecentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm sm:text-base">
                No recent transactions found
              </p>
            ) : (
              sortedRecentTransactions.map((t, idx) => (
                <div
                  key={t.id}
                  className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 hover:from-white/80 hover:to-white/50 dark:hover:from-gray-700/80 dark:hover:to-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-semibold shrink-0 text-sm sm:text-base shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: t.category_color || '#3B82F6' }}
                    >
                      {t.category_name?.[0]?.toUpperCase() || 'T'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {t.description}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {t.account_name} • {t.category_name}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(t.transaction_date).toLocaleDateString()}
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
      <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <Skeleton className="h-3.5 w-20 sm:w-24 mb-2.5" />
          <Skeleton className="h-7 sm:h-8 w-28 sm:w-36" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trendUp !== undefined ? trendUp : (trend || 0) >= 0;

  return (
    <Card className="group border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold">{value}</p>

            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(trend).toFixed(1)}% from last month
              </div>
            )}
          </div>

          <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-9 sm:h-10 w-40 sm:w-52" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 sm:h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-72 sm:h-80 lg:h-96 rounded-xl" />
        <Skeleton className="h-72 sm:h-80 lg:h-96 rounded-xl" />
      </div>
      <Skeleton className="h-80 sm:h-96 rounded-xl" />
    </div>
  );
}