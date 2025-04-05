import React, { use, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import Userlogin from "./pages/Userlogin";
import useCheckAuth from "./hooks/useCheckAuth"; // ✅ Fixed Hook Name
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading } = useCheckAuth(); // ✅ Hook now returns loading
  const { user } = useSelector((state) => state.user);

 

  if (loading) {
    return <h1>Loading...</h1>; // ✅ Prevent rendering until auth check completes
  }

  return (
    <>
          <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Home/>:<Userlogin />} />
          <Route path="/register" element={user ? <Home/>:<UserRegister />} />
          <Route
            path="/home"
            element={user  ? <Home /> : <Userlogin />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
