import { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // Send to your backend
      const response = await api.post('/Auth/google-signin', {
        idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success(`Welcome back, ${user.displayName}!`);
        navigate('/home');
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.data.message || 'Authentication failed');
      }
      
    } catch (error) {
      console.error('Google Auth Error:', error);
      
      let errorMessage = 'Failed to sign in with Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked. Please allow popups for this site.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    signInWithGoogle,
    signOut,
    loading
  };
};