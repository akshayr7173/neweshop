import { toast } from 'react-toastify';

export const handleAuthError = (error) => {
  console.error('Auth Error:', error);
  
  const errorMessages = {
    'auth/popup-closed-by-user': 'Sign-in cancelled by user',
    'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.'
  };

  const message = errorMessages[error.code] || error.message || 'An unexpected error occurred';
  toast.error(message);
  
  return message;
};

export const validateAuthData = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.name && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatUserData = (firebaseUser) => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    provider: firebaseUser.providerData[0]?.providerId || 'email'
  };
};

export const getAuthRedirectPath = (user) => {
  // Redirect logic based on user role or other criteria
  if (user.role === 'admin') {
    return '/admin';
  } else if (user.role === 'seller') {
    return '/seller/dashboard';
  } else {
    return '/home';
  }
};