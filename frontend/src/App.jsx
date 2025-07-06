import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Pages & Components
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import Userlogin from "./pages/Userlogin";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductDetails from "./component/ProductDetails";
import ForgetPassword from "./pages/ForgetPassword";
import MainLayout from "./component/SearchResults";
import Profile from "./pages/Profile";
import UpdateEmail from "./pages/UpdateEmail";
import CheckoutPage from "./pages/CheckoutPage"; // ⛳ fixed default import
import useCheckAuth from "./hooks/useCheckAuth";
import Checkout from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";
import UserOrders from "./pages/Orders";

// ✅ Stripe promise outside the component
const stripePromise = loadStripe(
  "pk_test_51ROUXJFa7eTaeNImKyHNkuEYOPkftv4T2VXmXwDtgtwWMeoKEPi1MKgq5KcG6NDhZkgUCuqAbKELPjtiarQwGqZZ00J4vqqiIr"
);

function App() {
  const { loading } = useCheckAuth();
  const { user } = useSelector((state) => state.user);
  const addresses = user?.user?.addresses || [];

  console.log(addresses);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Home /> : <Userlogin />} />
          <Route
            path="/register"
            element={user ? <Home /> : <UserRegister />}
          />
          <Route path="/home" element={user ? <Home /> : <Userlogin />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={user ? <Cart /> : <Userlogin />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/search" element={<MainLayout />} />
          <Route path="/profile" element={user ? <Profile /> : <Userlogin />} />
          <Route path="/orders" element={user ? <UserOrders/> : <Userlogin/>}></Route>
          <Route
            path="/update-email"
            element={user ? <UpdateEmail /> : <Userlogin />}
          />





          <Route
  path="/checkout"
  element={
    <Elements stripe={stripePromise}>
      {user ? (
        user.user?.addresses && user.user.addresses.length > 0
          ? <PaymentPage />
          : <Checkout />
      ) : (
        <Userlogin />
      )}
    </Elements>
  }
/>

        </Routes>
      </Router>
    </>
  );
}

export default App;
