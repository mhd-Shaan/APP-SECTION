import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const amount = location.state?.amount;

 

  useEffect(() => {
    if (!amount) {
      setError('No amount specified');
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/create-payment-intent',
          { totalPrice: Math.round(amount * 100) }, // convert to paise
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.log('Error creating payment intent:', err);
        setError('Failed to start checkout');
        toast.error('Could not start payment');
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.log(error);
        
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        navigate('/success');
      }
    } catch (err) {
        console.log(error);
        
      toast.error('Payment failed. Try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 max-w-xl mx-auto w-full pt-20 pb-10">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {loading ? (
          <div className="text-center text-gray-600">Preparing checkout...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
            <div className="border border-gray-300 rounded p-2">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#32325d',
                      '::placeholder': { color: '#a0aec0' },
                    },
                    invalid: { color: '#e53e3e' },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || !clientSecret || processing}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mt-4"
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
