import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Divider,
  Grid
} from "@mui/material";
import Navbar from "@/component/Navbar";

export default function UserRegister() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/registeruser", formData);
      toast.success(res.data.msg || "OTP sent to your email");
      setRegistrationData(formData);
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to register");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        ...registrationData,
        otp: otp.join(""),
      });

      if (res.status === 201) {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 6, 
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}>
          {/* Header Section */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold', 
              color: '#000',
              mb: 1
            }}>
              Create Your Account
            </Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
              Join our spare parts community today
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
                  Full Name *
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  variant="outlined"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
                  Email Address *
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  variant="outlined"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
                  Password *
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  variant="outlined"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                mt: 3,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#e6c200'
                }
              }}
            >
              REGISTER NOW
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" sx={{ color: '#555' }}>
                Already have an account? {' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#FFD700', 
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* OTP Modal */}
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
              textAlign: "center"
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Verify Your Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Enter the 6-digit code sent to your email
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  type="text"
                  inputProps={{ maxLength: 1 }}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp);
                  }}
                  sx={{ 
                    width: "40px", 
                    "& .MuiInputBase-input": { 
                      textAlign: "center" 
                    } 
                  }}
                />
              ))}
            </Box>
            
            <Button 
              variant="contained"
              fullWidth
              onClick={verifyOtp}
              sx={{
                py: 1.5,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              VERIFY OTP
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}