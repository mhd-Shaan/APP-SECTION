import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  CircularProgress,
  CardHeader
} from '@mui/material';
import { CheckCircle, Mail, RefreshCw, ShieldCheck, ArrowLeft } from 'lucide-react';
import Footer from '@/component/Footer';
import Navbar from '@/component/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UpdateEmail = () => {
  const { user } = useSelector((state) => state.user);
  const [activeStep, setActiveStep] = useState(0);
  const [currentEmail, setCurrentEmail] = useState(user?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [currentOtp, setCurrentOtp] = useState('');
  const [newOtp, setNewOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState({
    sendCurrentOtp: false,
    verifyCurrentOtp: false,
    sendNewOtp: false,
    verifyNewOtp: false
  });

  const steps = [
    'Verify Current Email',
    'Update Email Address',
    'Verify New Email',
    'Completion'
  ];

  const handleSendCurrentOtp = async () => {
    try {
      setLoading(prev => ({ ...prev, sendCurrentOtp: true }));
      const response = await axios.post('http://localhost:5000/existemail-sendotp', { email: currentEmail });
      setOtpSent(true);
      toast.success(response?.data?.message || `OTP sent to ${currentEmail}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(prev => ({ ...prev, sendCurrentOtp: false }));
    }
  };

  const handleVerifyCurrentOtp = async () => {
    if (!currentOtp) return toast.error('Please enter OTP');

    try {
      setLoading(prev => ({ ...prev, verifyCurrentOtp: true }));
      const response = await axios.post('http://localhost:5000/existemail-checkotp', {
        email: currentEmail,
        otp: currentOtp
      });
      toast.success(response?.data?.message || 'Email verified successfully');
      setActiveStep(1);
      setOtpSent(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(prev => ({ ...prev, verifyCurrentOtp: false }));
    }
  };

  const handleSendNewOtp = async () => {
    if (!newEmail.includes('@')) return toast.error('Please enter a valid email');

    try {
      setLoading(prev => ({ ...prev, sendNewOtp: true }));
      const response = await axios.post('http://localhost:5000/updateemail-sendotp', { email: newEmail });
      setOtpSent(true);
      toast.success(response?.data?.message || `OTP sent to ${newEmail}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(prev => ({ ...prev, sendNewOtp: false }));
    }
  };

  const handleVerifyNewOtp = async () => {
    if (!newOtp) return toast.error('Please enter OTP');

    try {
      setLoading(prev => ({ ...prev, verifyNewOtp: true }));
      const response = await axios.post('http://localhost:5000/checking&saveemail', {
        existingemail: currentEmail,
        email: newEmail,
        otp: newOtp
      });
      toast.success(response?.data?.message || 'Email updated successfully');
      setActiveStep(3);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update email');
    } finally {
      setLoading(prev => ({ ...prev, verifyNewOtp: false }));
    }
  };

  const handleBack = () => {
    setOtpSent(false);
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 mb-3">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader
            title="Update Email Address"
            subheader="Secure process to change your account email"
            className="border-b"
            titleTypographyProps={{ className: "font-bold text-black" }}
            subheaderTypographyProps={{ className: "text-black" }}
          />

          <CardContent className="bg-white">
            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      style: {
                        color: activeStep >= steps.indexOf(label) ? '#facc15' : '#9ca3af',
                      }
                    }}
                  >
                    <span className={activeStep >= steps.indexOf(label) ? "font-bold text-black" : "text-gray-500"}>
                      {label}
                    </span>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded">
                  <Mail className="w-5 h-5 text-black" />
                  <Typography className="text-black">{currentEmail}</Typography>
                </div>

                {!otpSent ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSendCurrentOtp}
                    disabled={loading.sendCurrentOtp}
                    startIcon={loading.sendCurrentOtp ?
                      <CircularProgress size={20} style={{ color: 'black' }} /> :
                      <Mail className="text-black" />
                    }
                    style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                  >
                    {loading.sendCurrentOtp ? 'Sending...' : 'Send Verification OTP'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <TextField
                      label="Enter OTP"
                      variant="outlined"
                      fullWidth
                      value={currentOtp}
                      onChange={(e) => setCurrentOtp(e.target.value)}
                      inputProps={{ maxLength: 6 }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerifyCurrentOtp}
                      disabled={loading.verifyCurrentOtp}
                      startIcon={loading.verifyCurrentOtp ?
                        <CircularProgress size={20} style={{ color: 'black' }} /> :
                        <ShieldCheck className="text-black" />
                      }
                      style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      {loading.verifyCurrentOtp ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSendCurrentOtp}
                      disabled={loading.sendCurrentOtp}
                      startIcon={<RefreshCw className="text-black" />}
                      style={{ borderColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <TextField
                  label="New Email Address"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setOtpSent(false);
                    setActiveStep(2);
                  }}
                  disabled={!newEmail.includes('@')}
                  style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                >
                  Continue
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  startIcon={<ArrowLeft className="text-black" />}
                  style={{ color: '#000', fontWeight: 'bold' }}
                >
                  Back
                </Button>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded">
                  <Mail className="w-5 h-5 text-black" />
                  <Typography className="text-black">{newEmail}</Typography>
                </div>
                {!otpSent ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSendNewOtp}
                    disabled={loading.sendNewOtp}
                    startIcon={loading.sendNewOtp ?
                      <CircularProgress size={20} style={{ color: 'black' }} /> :
                      <Mail className="text-black" />
                    }
                    style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                  >
                    {loading.sendNewOtp ? 'Sending...' : 'Send Verification OTP'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <TextField
                      label="Enter OTP"
                      variant="outlined"
                      fullWidth
                      value={newOtp}
                      onChange={(e) => setNewOtp(e.target.value)}
                      inputProps={{ maxLength: 6 }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerifyNewOtp}
                      disabled={loading.verifyNewOtp}
                      startIcon={loading.verifyNewOtp ?
                        <CircularProgress size={20} style={{ color: 'black' }} /> :
                        <ShieldCheck className="text-black" />
                      }
                      style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      {loading.verifyNewOtp ? 'Updating...' : 'Verify & Update Email'}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSendNewOtp}
                      disabled={loading.sendNewOtp}
                      startIcon={<RefreshCw className="text-black" />}
                      style={{ borderColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  startIcon={<ArrowLeft className="text-black" />}
                  style={{ color: '#000', fontWeight: 'bold' }}
                >
                  Back
                </Button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <CheckCircle className="text-green-500" size={48} />
                <Typography variant="h6" className="text-black font-semibold text-center">
                  Email Updated Successfully!
                </Typography>
                <Typography className="text-gray-600 text-center">
                  Your account email has been changed to <span className="font-semibold">{newEmail}</span>.
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UpdateEmail;
