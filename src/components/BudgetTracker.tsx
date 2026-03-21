import { useState } from 'react';
import { Wallet, Plus, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface BudgetTrackerProps {
  totalBudget: number;
}

export function BudgetTracker({ totalBudget }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Accommodation',
    'Transportation',
    'Food & Dining',
    'Attractions',
    'Shopping',
    'Other'
  ];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentageSpent = (totalSpent / totalBudget) * 100;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = () => {
    if (category && amount && description) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        category,
        amount: parseFloat(amount),
        description,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      setExpenses([...expenses, newExpense]);
      setCategory('');
      setAmount('');
      setDescription('');
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-5 text-rose-600" />
                Budget Overview
              </CardTitle>
              <CardDescription>Track your spending in Japan</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="size-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record your spending to track your budget</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (¥)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="What did you spend on?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddExpense} className="w-full bg-rose-600 hover:bg-rose-700">
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Budget</span>
              <span className="font-medium">¥{totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spent</span>
              <span className="font-medium text-rose-600">¥{totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ¥{remaining.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(percentageSpent, 100)} className="h-2 mt-4" />
            <p className="text-xs text-gray-500 text-center mt-1">
              {percentageSpent.toFixed(1)}% of budget used
            </p>
          </div>

          {Object.keys(categoryTotals).length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <PieChart className="size-4" />
                Spending by Category
              </h4>
              <div className="space-y-2">
                {Object.entries(categoryTotals).map(([cat, total]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{cat}</span>
                    <span className="font-medium">¥{total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expenses.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Recent Expenses
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {expenses.slice().reverse().map((expense) => (
                  <div key={expense.id} className="flex items-start justify-between text-sm p-2 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-xs text-gray-500">{expense.category} • {expense.date}</p>
                    </div>
                    <span className="font-medium text-rose-600">¥{expense.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
