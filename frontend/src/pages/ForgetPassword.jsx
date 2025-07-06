import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Mail, LockClock } from '@mui/icons-material';
import { 
  Button, 
  TextField, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  InputAdornment,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import { useSelector } from 'react-redux';

function ForgetPassword() {
  const { user } = useSelector((state) => state.user);

  const [email, setEmail] = useState(user?.user.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null); // Separate message state for dialog
  const navigate = useNavigate();
  

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/forget-password-otp', { email });
      setMessage({
        text: response?.data?.message || `OTP has been sent to ${email}`,
        type: 'success'
      });
      setOpenOtpDialog(true);
      setActiveStep(2);
      setDialogMessage(null); // Clear any previous dialog messages
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Failed to send OTP. Please try again.',
        type: 'error'
      });
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/forgetpassword-verify-otp', { email, otp });
      setDialogMessage({
        text: response?.data?.message || 'OTP verified successfully',
        type: 'success'
      });
      setTimeout(() => {
        setActiveStep(3);
        setOtp('');
        setOpenOtpDialog(false);
        setMessage({
          text: 'Please set your new password',
          type: 'success'
        });
      }, 1000);
    } catch (error) {
      setDialogMessage({
        text: error.response?.data?.error || 'Invalid OTP. Please try again.',
        type: 'error'
      });
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({
        text: 'Passwords do not match',
        type: 'error'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put('http://localhost:5000/passwordupdate', { 
        email, 
        password: newPassword, 
        confirmPassword 
      });

      setMessage({
        text: response?.data?.message || 'Password reset successfully! Redirecting to login...',
        type: 'success'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || 'Failed to reset password. Please try again.',
        type: 'error'
      });
    }
    setIsLoading(false);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            color: 'gray',
            mb: 2,
            textTransform: 'none'
          }}
        >
          Back
        </Button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {activeStep === 1 ? 'Forgot Password?' : 
             activeStep === 2 ? 'Verify OTP' : 'Reset Password'}
          </h1>
          <p className="text-gray-600">
            {activeStep === 1 ? 'Enter your email to receive a verification code' :
             activeStep === 2 ? 'Enter the OTP sent to your email' : 
             'Enter your new password'}
          </p>
        </div>

        {/* Alert Message */}
        {message?.text && (
          <Alert severity={message.type || 'info'} className="mb-6">
            {typeof message.text === 'string' ? message.text : 'Something went wrong'}
          </Alert>
        )}

        {/* Step 1: Email Form */}
        {activeStep === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
              className="bg-white border border-gray-200 rounded-lg"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 2,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e6c200' }
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Send OTP'}
            </Button>
          </form>
        )}

        {/* OTP Dialog */}
       {/* OTP Dialog */}
<Dialog 
  open={openOtpDialog} 
  onClose={() => setOpenOtpDialog(false)}
  PaperProps={{
    style: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      overflow: 'visible'
    }
  }}
  BackdropProps={{
    style: { 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)'
    }
  }}
>
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    position: 'relative'
  }}>
    <DialogTitle className="flex justify-between items-center" style={{ padding: 0 }}>
      <span>Enter Verification Code</span>
      <IconButton 
        onClick={() => setOpenOtpDialog(false)}
        style={{ position: 'absolute', right: '8px', top: '8px' }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent style={{ padding: '16px 0' }}>
      <div className="space-y-4">
        {/* Dialog-specific alert message */}
        {dialogMessage?.text && (
          <Alert severity={dialogMessage.type || 'info'} className="mb-4">
            {typeof dialogMessage.text === 'string' ? dialogMessage.text : 'Verification error'}
          </Alert>
        )}

        <p className="text-gray-600">We've sent a 6-digit code to {email}</p>

        <TextField
          fullWidth
          label="OTP Code"
          variant="outlined"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          inputProps={{ maxLength: 6 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockClock className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerifyOtp}
          disabled={isLoading || otp.length !== 6}
          sx={{
            py: 2,
            backgroundColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#e6c200' }
          }}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Verify OTP'}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Didn't receive code?{' '}
          <Button
            onClick={handleSendOtp}
            sx={{
              color: '#FFD700',
              p: 0,
              textTransform: 'none'
            }}
          >
            Resend
          </Button>
        </div>
      </div>
    </DialogContent>
  </div>
</Dialog>

        {/* Step 3: Reset Password Form */}
        {activeStep === 3 && (
          <form className="space-y-6">
            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              inputProps={{ minLength: 6 }}
              className="bg-white border border-gray-200 rounded-lg"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              inputProps={{ minLength: 6 }}
              className="bg-white border border-gray-200 rounded-lg"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || !confirmPassword}
              sx={{
                py: 2,
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e6c200' }
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : 'Reset Password'}
            </Button>
          </form>
        )}

        {!user && (
  <div className="mt-6 text-center text-sm text-gray-500">
    Remember your password?{' '}
    <Button
      onClick={() => navigate('/login')}
      sx={{
        color: '#FFD700',
        p: 0,
        textTransform: 'none'
      }}
    >
      Sign in
    </Button>
  </div>
)}


      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ForgetPassword;