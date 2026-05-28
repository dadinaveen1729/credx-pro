'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Gift,
  DollarSign,
  Calendar,
  Zap,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ billData, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: billData.amount,
          user_id: user.uid,
          bill_id: billData.id,
          description: `Bill payment for ${billData.name}`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment');
      }

      const { client_secret, rewards_earned } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName || user.email,
            email: user.email,
          },
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success(`Payment successful! You earned ${rewards_earned} points! 🎉`);
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <CardElement options={cardElementOptions} />
      </div>

      {/* Test Card Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Test Card Numbers (Sandbox)</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• Success: <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code></div>
          <div>• Declined: <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0002</code></div>
          <div>• Use any future expiry date and any 3-digit CVC</div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Pay ${billData.amount} Securely
          </>
        )}
      </Button>
    </form>
  );
}

// Separate component that uses useSearchParams - wrapped in Suspense
function PaymentContentWithSearchParams() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billData, setBillData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (user) {
      loadBillData();
    }
  }, [user, searchParams]);

  const loadBillData = () => {
    // Get bill data from URL params or create demo bill
    const billId = searchParams.get('bill_id');
    const amount = searchParams.get('amount');
    const name = searchParams.get('name');

    if (billId && amount && name) {
      setBillData({
        id: billId,
        amount: parseFloat(amount),
        name: decodeURIComponent(name),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'credit_card'
      });
    } else {
      // Default demo bill for testing
      setBillData({
        id: 'demo_bill_001',
        amount: 150.75,
        name: 'Chase Sapphire Credit Card',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'credit_card'
      });
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentResult(paymentIntent);
    setPaymentComplete(true);
    
    // Send notification
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.uid,
        type: 'whatsapp',
        message_type: 'payment_success',
        data: {
          amount: billData.amount,
          bill_name: billData.name,
          payment_id: paymentIntent.id
        }
      })
    }).catch(console.error);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="text-xl font-bold">${billData?.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rewards Earned</p>
                    <p className="text-xl font-bold text-orange-600">
                      {Math.floor((billData?.amount || 0) / 10) * 1000} points
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bill</p>
                    <p className="font-semibold">{billData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-mono text-sm">{paymentResult?.id?.slice(-8)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Return to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentComplete(false)}
                  className="w-full"
                >
                  Make Another Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
          <p className="text-gray-600 mt-2">Complete your bill payment securely with Stripe</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your card information to complete the payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billData && (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      billData={billData} 
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {billData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bill</span>
                      <span className="font-medium">{billData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date</span>
                      <span className="font-medium">
                        {new Date(billData.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-xl font-bold">${billData.amount}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-orange-900">Rewards</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        You'll earn <strong>{Math.floor(billData.amount / 10) * 1000} points</strong> for this payment!
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        1000 points = $10 cashback
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Lock className="h-4 w-4" />
                        <span>256-bit SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="h-4 w-4" />
                        <span>Instant processing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>PCI DSS compliant</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <PaymentContentWithSearchParams />
    </Suspense>
  );
}

export default function PaymentPage() {
  return (
    <AuthProvider>
      <PaymentContent />
    </AuthProvider>
  );
}