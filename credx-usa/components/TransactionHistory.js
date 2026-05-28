'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Gift,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function TransactionHistory({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({ total: 0, monthly: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactionData();
    }
  }, [user]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      
      // Fetch payment history
      const paymentsResponse = await fetch(`/api/stripe/payment?user_id=${user.uid}`);
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setTransactions(paymentsData.payments || []);
      }

      // Fetch user rewards
      const userResponse = await fetch(`/api/user?user_id=${user.uid}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setRewards({
          total: userData.user?.total_rewards || 0,
          monthly: userData.user?.monthly_rewards || 0,
          history: userData.user?.rewards_history || []
        });
      }
    } catch (error) {
      console.error('Transaction fetch error:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Status', 'Rewards Earned', 'Card'],
      ...transactions.map(tx => [
        new Date(tx.created_at).toLocaleDateString(),
        tx.description || 'Bill Payment',
        `$${tx.amount}`,
        tx.status,
        tx.rewards_earned || 0,
        tx.card_brand ? `${tx.card_brand} ****${tx.card_last4}` : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credx_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transactions exported to CSV');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      succeeded: 'default',
      pending: 'secondary',
      failed: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalSpent = transactions.reduce((sum, tx) => sum + (tx.status === 'succeeded' ? tx.amount : 0), 0);
  const totalRewardsEarned = transactions.reduce((sum, tx) => sum + (tx.rewards_earned || 0), 0);
  const successfulTransactions = transactions.filter(tx => tx.status === 'succeeded').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Gift className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rewards Earned</p>
              <p className="text-2xl font-bold text-gray-900">{totalRewardsEarned} pts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Successful Payments</p>
              <p className="text-2xl font-bold text-gray-900">{successfulTransactions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${successfulTransactions > 0 ? (totalSpent / successfulTransactions).toFixed(0) : '0'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <CardDescription>Your recent payment transactions and rewards</CardDescription>
          </div>
          <Button onClick={exportTransactions} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-4">Start making payments to see your transaction history here.</p>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Make a Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id || index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {transaction.description || 'Bill Payment'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()} • 
                        {transaction.card_brand && transaction.card_last4 
                          ? ` ${transaction.card_brand} ****${transaction.card_last4}`
                          : ' Payment Method'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${transaction.amount}</p>
                      {transaction.rewards_earned > 0 && (
                        <p className="text-sm text-orange-600">+{transaction.rewards_earned} pts</p>
                      )}
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Gift className="h-5 w-5 mr-2 text-orange-600" />
            Rewards Summary
          </CardTitle>
          <CardDescription>
            Earn 1 point for every dollar spent • 1000 points = $10 cash back
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-3xl font-bold text-orange-600 mb-2">{rewards.total}</h3>
              <p className="text-gray-600">Total Points Earned</p>
              <p className="text-sm text-gray-500 mt-1">
                Cash value: ${(rewards.total / 100).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{rewards.monthly}</h3>
              <p className="text-gray-600">This Month</p>
              <p className="text-sm text-gray-500 mt-1">
                On track for {Math.round(rewards.monthly * 12 / new Date().getMonth() + 1)} yearly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}