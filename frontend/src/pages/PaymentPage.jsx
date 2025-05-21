import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import { useSelector } from 'react-redux';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const addresses = user?.user?.addresses || [];

  console.log(addresses);
  

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');

  const amount = location.state?.amount || 54900; // in paise
  const orderTotal = (amount / 100).toFixed(2);
  const deliveryFee = 40.00;
  const promotionApplied = 140.00;
  const subtotal = (parseFloat(orderTotal) + deliveryFee - promotionApplied).toFixed(2);

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
          { totalPrice: amount },
          { withCredentials: true }
        );
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Failed to start checkout');
        toast.error('Could not start payment');
        setLoading(false);
      }
    };

    if (paymentMethod === 'card') {
      createPaymentIntent();
    } else {
      setLoading(false);
    }
  }, [amount, paymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      handleCashOnDelivery();
      return;
    }

    if (!stripe || !elements) return;
    await handleCardPayment();
  };

  const handleCashOnDelivery = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/create-order',
        {
          orderItems: location.state?.items || [],
          shippingAddress: location.state?.address || {},
          paymentMethod: 'cod',
          itemsPrice: parseFloat(orderTotal),
          shippingPrice: deliveryFee,
          totalPrice: parseFloat(subtotal),
          userId: location.state?.userId || null
        },
        { withCredentials: true }
      );
      toast.success('Order placed successfully!');
      navigate('/success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      toast.error('Failed to place order');
      console.error(err);
    }
  };

  const handleCardPayment = async () => {
    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const res = await axios.post(
          'http://localhost:5000/create-order',
          {
            orderItems: location.state?.items || [],
            shippingAddress: location.state?.address || {},
            paymentMethod: 'card',
            itemsPrice: parseFloat(orderTotal),
            shippingPrice: deliveryFee,
            totalPrice: parseFloat(subtotal),
            userId: location.state?.userId || null
          },
          { withCredentials: true }
        );
        toast.success('Payment successful!');
        navigate('/success', { state: { orderId: res.data.orderId } });
      }
    } catch (err) {
      toast.error('Payment failed. Try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow p-4 flex items-center justify-center">
          <div className="text-xl">Loading payment options...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-12">
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Secure checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base">Delivering to</h3>
                <p className="text-sm text-gray-600">
                  {addresses?.houseNumber || '432, Example Street'},<br />
                  {addresses?.city || 'City'}, {addresses?.address || 'kannur kannadiparmba'}, {addresses.pinCode || '670604'}
                </p>
                <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                  Add delivery instructions
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Use a gift card, voucher or promo code</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Code" 
                    className="flex-1" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-sm sm:text-base">Payment method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="text-sm sm:text-base">Credit or debit card</Label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="ml-6 space-y-3">
                      <div className="border rounded-lg p-3 sm:p-4">
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
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="text-sm sm:text-base">Cash on Delivery / Pay on Delivery</Label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 ml-6">
                    Cash, UPI, and Cards accepted. 
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-xs sm:text-sm">Know more</Button>
                  </p>
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base">Order Summary</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between"><span>Items:</span><span>${orderTotal}</span></div>
                  <div className="flex justify-between"><span>Delivery:</span><span>${deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total:</span><span>${(parseFloat(orderTotal) + deliveryFee).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Promotion Applied:</span><span className="text-green-600">-${promotionApplied.toFixed(2)}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold"><span>Order Total:</span><span>${subtotal}</span></div>
                </div>

                <Button
                  className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-sm sm:text-base"
                  onClick={handleSubmit}
                  disabled={processing || (paymentMethod === 'card' && !clientSecret)}
                >
                  {processing ? 'Processing...' : `Place your order - $${subtotal}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our privacy notice and conditions of use.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Help Section */}
        <section>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-medium text-sm sm:text-base mb-2">Need help?</h3>
              <p className="text-sm text-gray-600 mb-2">
                Please contact our customer support or visit our{' '}
                <Link to="/help" className="text-blue-600 underline">Help Center</Link>.
              </p>
              <p className="text-sm text-gray-600">Call us at: <span className="font-medium">+1 800 123 4567</span></p>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
