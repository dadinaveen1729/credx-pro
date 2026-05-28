'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Globe,
  Shield,
  User,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  TestTube
} from 'lucide-react';
import { toast } from 'sonner';

function SettingsContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      fetchSettings();
    }
  }, [user, loading, router]);

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await fetch(`/api/dashboard/settings?user_id=${user.uid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Settings Error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          settings: settings
        })
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save Settings Error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const sendTestNotification = async (type) => {
    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          action: 'test_notification',
          notification_type: type
        })
      });

      if (response.ok) {
        toast.success(`Test ${type} notification sent!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Test Notification Error:', error);
      toast.error('Failed to send test notification');
    }
  };

  const updateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  if (loading || loadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account preferences and notifications</p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure email alerts and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-bills">Bill Reminders</Label>
                    <Switch
                      id="email-bills"
                      checked={settings?.email_notifications?.bill_reminders || false}
                      onCheckedChange={(value) => updateSetting('email_notifications', 'bill_reminders', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-payments">Payment Confirmations</Label>
                    <Switch
                      id="email-payments"
                      checked={settings?.email_notifications?.payment_confirmations || false}
                      onCheckedChange={(value) => updateSetting('email_notifications', 'payment_confirmations', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-fraud">Fraud Alerts</Label>
                    <Switch
                      id="email-fraud"
                      checked={settings?.email_notifications?.fraud_alerts || false}
                      onCheckedChange={(value) => updateSetting('email_notifications', 'fraud_alerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-weekly">Weekly Summary</Label>
                    <Switch
                      id="email-weekly"
                      checked={settings?.email_notifications?.weekly_summary || false}
                      onCheckedChange={(value) => updateSetting('email_notifications', 'weekly_summary', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-marketing">Marketing Emails</Label>
                    <Switch
                      id="email-marketing"
                      checked={settings?.email_notifications?.marketing || false}
                      onCheckedChange={(value) => updateSetting('email_notifications', 'marketing', value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => sendTestNotification('email')}
                    className="w-full"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
                </CardContent>
              </Card>

              {/* WhatsApp Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    WhatsApp Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure WhatsApp messages and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-bills">Bill Reminders</Label>
                    <Switch
                      id="whatsapp-bills"
                      checked={settings?.whatsapp_notifications?.bill_reminders || false}
                      onCheckedChange={(value) => updateSetting('whatsapp_notifications', 'bill_reminders', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-payments">Payment Confirmations</Label>
                    <Switch
                      id="whatsapp-payments"
                      checked={settings?.whatsapp_notifications?.payment_confirmations || false}
                      onCheckedChange={(value) => updateSetting('whatsapp_notifications', 'payment_confirmations', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-fraud">Fraud Alerts</Label>
                    <Switch
                      id="whatsapp-fraud"
                      checked={settings?.whatsapp_notifications?.fraud_alerts || false}
                      onCheckedChange={(value) => updateSetting('whatsapp_notifications', 'fraud_alerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-daily">Daily Summary</Label>
                    <Switch
                      id="whatsapp-daily"
                      checked={settings?.whatsapp_notifications?.daily_summary || false}
                      onCheckedChange={(value) => updateSetting('whatsapp_notifications', 'daily_summary', value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => sendTestNotification('whatsapp')}
                    className="w-full"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* SMS Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    SMS Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure text message alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-bills">Bill Reminders</Label>
                    <Switch
                      id="sms-bills"
                      checked={settings?.sms_notifications?.bill_reminders || false}
                      onCheckedChange={(value) => updateSetting('sms_notifications', 'bill_reminders', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-payments">Payment Confirmations</Label>
                    <Switch
                      id="sms-payments"
                      checked={settings?.sms_notifications?.payment_confirmations || false}
                      onCheckedChange={(value) => updateSetting('sms_notifications', 'payment_confirmations', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-fraud">Fraud Alerts</Label>
                    <Switch
                      id="sms-fraud"
                      checked={settings?.sms_notifications?.fraud_alerts || false}
                      onCheckedChange={(value) => updateSetting('sms_notifications', 'fraud_alerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-urgent">Urgent Only</Label>
                    <Switch
                      id="sms-urgent"
                      checked={settings?.sms_notifications?.urgent_only || false}
                      onCheckedChange={(value) => updateSetting('sms_notifications', 'urgent_only', value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => sendTestNotification('sms')}
                    className="w-full"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test SMS
                  </Button>
                </CardContent>
              </Card>

              {/* Timing & Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Timing & Frequency
                  </CardTitle>
                  <CardDescription>
                    Configure when and how often you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Bill Reminder (Days Before Due)</Label>
                    <Select
                      value={settings?.reminder_timing?.bill_reminder_days?.toString() || '3'}
                      onValueChange={(value) => updateSetting('reminder_timing', 'bill_reminder_days', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings?.reminder_timing?.timezone || 'America/New_York'}
                      onValueChange={(value) => updateSetting('reminder_timing', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="morning-summary">Morning Summary (8 AM)</Label>
                    <Switch
                      id="morning-summary"
                      checked={settings?.reminder_timing?.morning_summary || false}
                      onCheckedChange={(value) => updateSetting('reminder_timing', 'morning_summary', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="evening-summary">Evening Summary (6 PM)</Label>
                    <Switch
                      id="evening-summary"
                      checked={settings?.reminder_timing?.evening_summary || false}
                      onCheckedChange={(value) => updateSetting('reminder_timing', 'evening_summary', value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would go here */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Account settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">General preferences coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={saveSettings}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  );
}