import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation
import { TextField, Button, Typography, Container, Paper, Box, Grid, Modal, Backdrop, Fade } from "@mui/material";
import {toast} from 'react-hot-toast'

function UserRegister() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false); // Controls OTP modal visibility
  const [registrationData, setRegistrationData] = useState(null); // Stores registration data for OTP verification
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP input state

  const navigate = useNavigate();

const register =async(data)=>{
  try {
    const res = await axios.post("http://localhost:5000/registeruser", data);
    if (res.status === 200) {
      toast.success(res.data.msg || "OTP sent to your email");
      setRegistrationData(data); // Save registration data for OTP verification
      setShowOtpModal(true); // Show OTP modal
    }   

   
  } catch (error) {    
    console.error("Error during registration:", error);
    toast.error(error.response?.data?.error || "Failed to register");
  }
}

const verifyOtp = async ()=>{
  const otpValue = otp.join("")
  try {
    const res = await axios.post("http://localhost:5000/verify-otp",{
      ...registrationData,
      otp:otpValue,
    })

    if(res.status === 201){
      toast.success('registrarion succesfully');
      navigate('/login')
    }
  } catch (error) {
    toast.error(error.response.data.error)
    console.log(error.response.data.error);
    
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    register(data)
  
  }
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  }
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
            Create an Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign up to start using our platform.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Sign Up
            </button>
          </form>
           {/* Signup Link */}
           <p className="text-center text-gray-600 mt-4">
            if you have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              login 
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-500">
        <img
          src="https://imgs.search.brave.com/AnJsDxgrQpq8OjvLnjQHkiUlBjwgUBQa8l10M77fEhY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzcwLzM0LzIy/LzM2MF9GXzE3MDM0/MjIzNV9MVUQ2am5E/VE9ZSWMyTWprS1BC/cmx3SThvOURaemFM/QS5qcGc"
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <Modal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={showOtpModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Enter OTP
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputProps={{ maxLength: 1 }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  sx={{ width: "40px", textAlign: "center" }}
                />
              ))}
            </Box>
            <Box textAlign="center" marginTop={2}>
              <Button variant="contained" color="primary" onClick={verifyOtp}>
                Verify OTP
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default UserRegister
