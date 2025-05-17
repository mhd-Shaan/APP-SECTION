import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardElement } from '@stripe/react-stripe-js';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = ({ userAddress }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState('summary');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState(userAddress || null);

  // Fetch cart from backend or location state
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/viewcart', {
          withCredentials: true,
        });
        if (res.data?.cart?.items) {
          setCartItems(res.data.cart.items);
          calculateTotal(res.data.cart.items);
        }
      } catch (error) {
        toast.error('Failed to load cart data');
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
      calculateTotal(location.state.cartItems);
      setLoading(false);
    } else {
      fetchCartData();
    }
  }, [location.state]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.priceAtAddTime || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddress = {
      fullName: formData.get('fullName'),
      phone: formData.get('mobile'),
      pincode: formData.get('pinCode'),
      houseNumber: formData.get('addressLine1'),
      address: formData.get('addressLine2'),
      landmark: formData.get('landmark'),
      city: formData.get('city'),
    };

    try {
      const res = await axios.post(
        'http://localhost:5000/addaddress',
        newAddress,
        { withCredentials: true }
      );
      if (res.data?.message) {
        setAddress(newAddress);
        setIsAddressDialogOpen(false);
        toast.success('Address saved successfully');
      } else {
        toast.error('Failed to save address');
      }
    } catch (err) {
      toast.error('Error saving address');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 mt-12 flex justify-center">
          <div className="text-xl">Loading your cart...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 mt-12">
        {step === 'summary' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Secure checkout</h1>

            {/* Delivery Address */}
            <section className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Delivery address</h2>
              {address ? (
                <div className="mb-4">
                  <p className="font-medium">{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  <p>{address.addressLine2}</p>
                  <p>
                    {address.landmark && `${address.landmark}, `}
                    {address.city}
                  </p>
                  <p>PIN: {address.pinCode}</p>
                  <p>Mobile: {address.mobile}</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    Change address
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                  onClick={() => setIsAddressDialogOpen(true)}
                >
                  + Add a new delivery address
                </Button>
              )}
            </section>

            {/* Payment Info */}
            <section className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Payment method</h2>
              <p className="text-sm text-gray-600">
                Need help? Check our help pages or contact us 24x7.
              </p>
            </section>

            {/* Order Summary */}
            <section className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                Review items and shipping
              </h2>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>
                      {item.product?.productName || 'Product'} × {item.quantity}
                    </span>
                    <span>
                      ₹
                      {(item.priceAtAddTime || item.product?.price || 0) *
                        item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Order Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </section>

            <Button
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={() => {
                if (!address) {
                  toast.error('Please add a delivery address');
                  return;
                }
                setStep('payment');
              }}
              disabled={!address}
            >
              Proceed to Payment
            </Button>
          </div>
        )}

        {/* Address Modal */}
        <Dialog
          open={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {address ? 'Edit' : 'Add'} delivery address
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddressSubmit}>
              <div className="grid gap-2">
                <Input
                  name="fullName"
                  placeholder="Full name"
                  defaultValue={address?.fullName}
                  required
                />
                <Input
                  name="mobile"
                  placeholder="Mobile number"
                  defaultValue={address?.mobile}
                  required
                />
                <Input
                  name="pinCode"
                  placeholder="6 digits PIN code"
                  defaultValue={address?.pinCode}
                  required
                />
                <Input
                  name="addressLine1"
                  placeholder="Flat, House no., Building"
                  defaultValue={address?.addressLine1}
                  required
                />
                <Input
                  name="addressLine2"
                  placeholder="Area, Street, Sector"
                  defaultValue={address?.addressLine2}
                  required
                />
                <Input
                  name="landmark"
                  placeholder="Landmark (optional)"
                  defaultValue={address?.landmark}
                />
                <Input
                  name="city"
                  placeholder="Town/City"
                  defaultValue={address?.city}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-500 text-white hover:bg-yellow-600 mt-5"
              >
                {address ? 'Update' : 'Use this'} address
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Payment</h1>
            <div className="mb-4">
              <h3 className="font-medium">Deliver to:</h3>
              <p>
                {address.fullName}, {address.addressLine1}, {address.city} -{' '}
                {address.pinCode}
              </p>
            </div>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                },
              }}
            />
            <Button
              className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={() =>
                navigate('/payment', {
                  state: {
                    amount: totalPrice,
                    address,
                  },
                })
              }
            >
              Pay ₹{totalPrice}
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
