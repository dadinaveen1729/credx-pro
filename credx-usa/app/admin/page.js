'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  Trash2,
  CheckCircle,
  Loader2,
  Crown,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

function AdminContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      // Check if user is admin
      const isUserAdmin = user.email === 'admin@credxusa.com' || 
                         user.email?.includes('admin') ||
                         user.uid === 'admin_user';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast?.error('Access denied. Admin privileges required.');
        router.push('/dashboard');
        return;
      }

      fetchAdminData();
    }
  }, [user, loading, router]);

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch users with error handling
      try {
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users || []);
        }
      } catch (error) {
        console.log('Users fetch failed:', error);
        setUsers([]);
      }

      // Fetch payments with error handling
      try {
        const paymentsResponse = await fetch('/api/admin/payments');
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPayments(paymentsData.payments || []);
        }
      } catch (error) {
        console.log('Payments fetch failed:', error);
        setPayments([]);
      }

      setLoadingData(false);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      setLoadingData(false);
      if (toast?.error) toast.error('Failed to load admin data');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        if (toast?.success) toast.success('User deleted successfully');
        fetchAdminData();
      } else {
        if (toast?.error) toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      if (toast?.error) toast.error('Failed to delete user');
    }
  };

  const exportUserData = () => {
    try {
      const csvContent = [
        ['Email', 'Display Name', 'Signup Method', 'Total Payments', 'Rewards', 'Created At'],
        ...users.map(user => [
          user.email || '',
          user.display_name || '',
          user.signup_method || 'Unknown',
          user.total_payments || 0,
          user.total_rewards || 0,
          user.created_at || ''
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credx-users-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      if (toast?.success) toast.success('User data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      if (toast?.error) toast.error('Failed to export user data');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalRewards = users.reduce((sum, user) => sum + (user.total_rewards || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage CREDX USA platform and users</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-orange-600">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-3xl font-bold text-green-600">${totalPayments.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Rewards</p>
                  <p className="text-3xl font-bold text-blue-600">{totalRewards} pts</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of CREDX USA platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Payment system operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>AI Financial Advisor active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Database connections stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Authentication system working</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage registered users and their accounts</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={exportUserData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={fetchAdminData} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Badge variant="outline">{filteredUsers.length} users</Badge>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user, index) => (
                    <div key={user.uid || index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{user.display_name || 'No Name'}</h4>
                            <Badge variant="outline">
                              {user.signup_method || 'Unknown'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Payments: ${user.total_payments || 0}</span>
                            <span>Rewards: {user.total_rewards || 0} pts</span>
                            <span>Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user.uid || user.firebase_uid)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {users.length === 0 ? 'No users found.' : 'No users match your search.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>Monitor platform payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {payments.slice(0, 20).map((payment, index) => (
                    <div key={payment._id || index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">${payment.amount?.toFixed(2) || '0.00'}</p>
                          <p className="text-sm text-gray-600">{payment.user_email || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">
                            {payment.created_at ? new Date(payment.created_at).toLocaleString() : 'Unknown Date'}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {payment.status || 'completed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {payments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No payment data available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}