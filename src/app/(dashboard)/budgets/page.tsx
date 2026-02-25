'use client';

import { useState } from 'react';
import { useBudgets } from '@/hooks/useBudgets';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Plus, AlertTriangle, Pencil, Trash2, PiggyBank } from 'lucide-react';
import { BudgetPeriod } from '@/types';

const periods: { value: BudgetPeriod; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function BudgetsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null); // Added for delete confirmation
  const { toast } = useToast();

  const { budgets, alerts, isLoading, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories('expense');

  const handleDelete = async (id: number) => {
    try {
      await deleteBudget(id);
      toast({ title: 'Budget deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete budget',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateBudget({ id: editingBudget.id, data });
      setEditingBudget(null);
      toast({ title: 'Budget updated' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update budget',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Dialog */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Budgets</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create Budget</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
              <DialogDescription>
                Set a budget for an expense category.
              </DialogDescription>
            </DialogHeader>
            <BudgetForm
              categories={categories || []}
              onSubmit={async (data) => {
                await createBudget(data);
                setIsCreateOpen(false);
                toast({ title: 'Budget created' });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((budget) => (
            <Alert key={budget.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Budget Alert</AlertTitle>
              <AlertDescription>
                You've used {Math.round(budget.percentage_used || 0)}% of your{' '}
                {budget.category_name} budget ({formatCurrency(budget.spent || 0)} of{' '}
                {formatCurrency(budget.amount)})
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {budgets?.map((budget) => {
          const percentage = Math.min(budget.percentage_used || 0, 100);
          const isOverBudget = (budget.spent || 0) > budget.amount;
          const isNearLimit = percentage >= (budget.alert_threshold || 80);

          return (
            <Card key={budget.id}>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: budget.category_color || '#3B82F6' }}
                  >
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{budget.category_name}</CardTitle>
                    <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                  </div>
                </div>
                <div className="flex gap-1 self-end sm:self-auto">
                  <Button variant="ghost" size="icon" onClick={() => setEditingBudget(budget)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(budget.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(budget.spent || 0)}
                      <span className="text-sm font-normal text-gray-500">
                        {' '}
                        / {formatCurrency(budget.amount)}
                      </span>
                    </p>
                    <p
                      className={`text-sm ${
                        isOverBudget
                          ? 'text-red-600'
                          : isNearLimit
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {isOverBudget
                        ? `Over budget by ${formatCurrency((budget.spent || 0) - budget.amount)}`
                        : `${formatCurrency(budget.remaining || 0)} remaining`}
                    </p>
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
                    }`}
                  >
                    {Math.round(budget.percentage_used || 0)}%
                  </span>
                </div>

                <Progress
                  value={percentage}
                  className={`h-2 ${
                    isOverBudget ? 'bg-red-200' : isNearLimit ? 'bg-yellow-200' : 'bg-green-200'
                  }`}
                />

                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-1">
                  <span>Alert at {budget.alert_threshold}%</span>
                  <span>
                    {new Date(budget.start_date).toLocaleDateString()}
                    {budget.end_date && ` - ${new Date(budget.end_date).toLocaleDateString()}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget details.
            </DialogDescription>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm
              categories={categories || []}
              initialData={editingBudget}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  handleDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BudgetForm({
  categories,
  initialData,
  onSubmit,
}: {
  categories: any[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category_id: initialData?.category_id?.toString() || '', // string
    amount: initialData?.amount?.toString() || '',
    period: initialData?.period || 'monthly',
    start_date: initialData?.start_date
      ? new Date(initialData.start_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().split('T')[0]
      : '',
    alert_threshold: initialData?.alert_threshold?.toString() || '80',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseData = {
        amount: parseFloat(formData.amount),
        period: formData.period,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        alert_threshold: parseInt(formData.alert_threshold, 10),
      };

      // Only include category_id when creating a new budget
      const submitData = initialData
        ? baseData
        : { ...baseData, category_id: Number(formData.category_id) }; // convert to number

      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category field - disabled when editing */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          disabled={!!initialData}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}> {/* value as string */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount, Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Period</Label>
          <Select
            value={formData.period}
            onValueChange={(value) => setFormData({ ...formData, period: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      {/* Alert Threshold */}
      <div className="space-y-2">
        <Label>Alert Threshold (%)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          value={formData.alert_threshold}
          onChange={(e) => setFormData({ ...formData, alert_threshold: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Budget' : 'Create Budget'}
      </Button>
    </form>
  );
}