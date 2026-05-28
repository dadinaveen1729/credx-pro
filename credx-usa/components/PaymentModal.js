'use client';

import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

function PaymentForm({ payment, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: payment.amount,
          user_id: payment.user_id,
          bill_id: payment.id,
          bill_name: payment.name
        }),
      });

      const data = await response.json();
      
      if (!data.client_secret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: payment.name,
          },
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success(`Payment of $${payment.amount} completed successfully!`);
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900">Payment Details</h3>
          <Badge variant="outline">{payment.category}</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Bill Name:</span>
            <span className="font-medium">{payment.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium">{payment.company || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Due Date:</span>
            <span className="font-medium">{payment.due}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-orange-600">${payment.amount}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <label className="font-medium text-gray-900">Card Information</label>
        </div>
        <div className="border rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Lock className="h-4 w-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || processing}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Pay ${payment.amount}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function PaymentModal({ payment, isOpen, onClose, onSuccess }) {
  const stripePromise = getStripe();

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
    onClose();
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Securely pay your bill using your credit or debit card
          </DialogDescription>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            payment={payment} 
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}