import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginuser } from "@/redux/userslice";
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
} from "@mui/material";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/loginusers",
        formData,
        { withCredentials: true }
      );
      toast.success("Welcome back!");
      dispatch(loginuser(response.data));
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />

      {/* Left Side - Login Form */}
      <Grid item xs={12} md={6} container justifyContent="center" alignItems="center">
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <Typography component="h1" variant="h5">
              Login 
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>

              {/* Centered Sign Up Text */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  If you don't have an account?{" "}
                  <Link to="/register" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                    Sign Up
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
          alt="Login Background"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>
    </Grid>
  );
}
