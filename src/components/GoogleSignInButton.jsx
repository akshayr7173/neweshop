import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Google } from '@mui/icons-material';
import { auth, googleProvider, signInWithPopup } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const GoogleButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
  border: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#4285f4',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(66, 133, 244, 0.2)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    transform: 'none',
    boxShadow: 'none',
  }
}));

const GoogleIcon = styled(Google)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: '1.2rem',
  color: '#4285f4',
}));

const GoogleSignInButton = ({ variant = 'signin' }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the token to your backend for verification and user creation/login
      const response = await api.post('/Auth/google-signin', {
        idToken: idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      });

      // If successful, log the user in
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success(`Welcome ${user.displayName}!`);
        navigate('/home');
      } else {
        throw new Error(response.data.message || 'Google sign-in failed');
      }
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonText = variant === 'signin' 
    ? 'Continue with Google' 
    : 'Sign up with Google';

  return (
    <GoogleButton
      fullWidth
      onClick={handleGoogleSignIn}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
    >
      {loading ? 'Signing in...' : buttonText}
    </GoogleButton>
  );
};

export default GoogleSignInButton;