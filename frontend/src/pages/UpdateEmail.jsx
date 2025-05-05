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
  Alert,
  CardHeader
} from '@mui/material';
import { CheckCircle, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import Footer from '@/component/Footer';
import Navbar from '@/component/Navbar';

const UpdateEmail = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [currentEmail, setCurrentEmail] = useState('user@example.com');
  const [newEmail, setNewEmail] = useState('');
  const [currentOtp, setCurrentOtp] = useState('');
  const [newOtp, setNewOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = [
    'Verify Current Email',
    'Update Email Address',
    'Verify New Email',
    'Completion'
  ];

  const handleSendCurrentOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setSuccess('OTP sent to your current email address');
    }, 1500);
  };

  const handleVerifyCurrentOtp = () => {
    if (currentOtp === '123456') {
      setActiveStep(1);
      setSuccess('Email verified successfully');
      setError('');
    } else {
      setError('Invalid OTP');
    }
  };

  const handleSendNewOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      setSuccess(`OTP sent to ${newEmail}`);
    }, 1500);
  };

  const handleVerifyNewOtp = () => {
    if (newOtp === '123456') {
      setActiveStep(3);
      setSuccess('Email updated successfully');
      setError('');
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <>
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
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
                        backgroundColor: 'white',
                        border: '2px solid #d1d5db'
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

            {error && (
              <Alert severity="error" className="mb-4" style={{ backgroundColor: '#fee2e2', color: 'black' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" className="mb-4" style={{ backgroundColor: '#dcfce7', color: 'black' }}>
                {success}
              </Alert>
            )}

            {/* Step 1: Verify Current Email */}
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
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} style={{ color: 'black' }} /> : <Mail className="text-black" />}
                    style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                  >
                    Send Verification OTP
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
                      className="[&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiInputLabel-root]:text-black"
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerifyCurrentOtp}
                      startIcon={<ShieldCheck className="text-black" />}
                      style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Verify OTP
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSendCurrentOtp}
                      startIcon={<RefreshCw className="text-black" />}
                      style={{ borderColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Update Email Address */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <TextField
                  label="New Email Address"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="[&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiInputLabel-root]:text-black"
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
              </div>
            )}

            {/* Step 3: Verify New Email */}
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
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} style={{ color: 'black' }} /> : <Mail className="text-black" />}
                    style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                  >
                    Send Verification OTP
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
                      className="[&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiInputLabel-root]:text-black"
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerifyNewOtp}
                      startIcon={<ShieldCheck className="text-black" />}
                      style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Verify OTP
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSendNewOtp}
                      startIcon={<RefreshCw className="text-black" />}
                      style={{ borderColor: '#facc15', color: 'black', fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Completion */}
            {activeStep === 3 && (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                <Typography variant="h6" className="font-bold text-black">Email Updated Successfully!</Typography>
                <Typography className="text-black">
                  Your email address has been changed to <span className="font-semibold">{newEmail}</span>
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => window.location.reload()}
                  style={{ backgroundColor: '#facc15', color: 'black', fontWeight: 'bold', marginTop: '1rem' }}
                >
                  Done
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer/>
    </>
  );
};

export default UpdateEmail;