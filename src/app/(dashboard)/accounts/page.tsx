'use client';

import { useState } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Plus, Pencil, Trash2, Wallet } from 'lucide-react';
import { AccountType } from '@/types';

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
];

export default function AccountsPage() {
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null); // now number
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount(id);
      toast({ title: 'Account deleted successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <AccountsSkeleton />;
  }

  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.is_active ? acc.balance : 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new account.
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              onSubmit={async (data) => {
                await createAccount(data);
                setIsCreateOpen(false);
                toast({ title: 'Account created successfully' });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Balance</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
            <Wallet className="h-12 w-12 text-blue-100" />
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((account) => (
          <Card key={account.id} className={!account.is_active ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-base sm:text-lg font-semibold">{account.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(account.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="capitalize">{account.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Balance</span>
                  <span className="font-semibold">{formatCurrency(account.balance)}</span>
                </div>
                {account.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{account.description}</p>
                )}
                {!account.is_active && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update the account details below.
            </DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <AccountForm
              initialData={editingAccount}
              onSubmit={async (data) => {
                await updateAccount({ id: editingAccount.id, data });
                setEditingAccount(null);
                toast({ title: 'Account updated successfully' });
              }}
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
              This action cannot be undone. This will permanently delete the account.
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

function AccountForm({
  initialData,
  onSubmit,
}: {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balanceInput, setBalanceInput] = useState(initialData?.balance?.toString() || '0');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'checking',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const balanceNum = parseFloat(balanceInput) || 0;
      await onSubmit({ ...formData, balance: balanceNum });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Account Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as AccountType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Initial Balance</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          value={balanceInput}
          onChange={(e) => setBalanceInput(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Account' : 'Create Account'}
      </Button>
    </form>
  );
}

function AccountsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40 sm:w-[200px]" />
      <Skeleton className="h-[100px] sm:h-[120px]" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] sm:h-[200px]" />
        ))}
      </div>
    </div>
  );
}