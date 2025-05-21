import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginuser } from "@/redux/userslice";
import { toast } from "react-hot-toast";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      dispatch(loginuser(response.data));
      navigate("/home");
      window.location.reload();
      toast.success("Welcome back!");
    } catch (error) {
      console.log('hi');
      
      toast.error(error.response?.data?.error || "Login failed");
      console.log(error);
      
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, color: '#000' }}>
            Customer Login
          </Typography>

          <Typography variant="h6" component="h2" sx={{ mb: 3, color: '#333' }}>
            Registered Customers
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: '#555' }}>
            If you have an account, sign in with your email address.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
              Email *
            </Typography>
            <TextField
              fullWidth
              name="email"
              variant="outlined"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#000' }}>
              Password *
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#FFD700', 
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Forgot Your Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#e6c200'
                }
              }}
            >
              SIGN IN
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Don't have an account?
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  borderColor: '#FFD700',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#e6c200',
                    backgroundColor: 'rgba(255, 215, 0, 0.08)'
                  }
                }}
              >
                CREATE ACCOUNT
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}