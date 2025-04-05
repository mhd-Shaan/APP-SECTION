import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";

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
      console.log(error);
      
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />

      {/* Left Side - Register Form */}
      <Grid item xs={12} md={6} container justifyContent="center" alignItems="center">
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Already have an account? {" "}
                  <Link to="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                    Login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Grid>

      {/* Right Side - Image */}
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", bgcolor: "gray.100" }}>
        <Box
          component="img"
          src="https://dcassetcdn.com/design_img/2793673/484367/484367_15258317_2793673_cf010444_image.png"
          alt="Register Background"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

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
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp);
                  }}
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
    </Grid>
  );
}
