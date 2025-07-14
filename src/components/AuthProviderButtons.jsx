import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Google, 
  Facebook, 
  GitHub, 
  Apple,
  Security 
} from '@mui/icons-material';

const ProviderButton = styled(Button)(({ theme, provider }) => {
  const getProviderStyles = () => {
    switch (provider) {
      case 'google':
        return {
          borderColor: '#4285f4',
          color: '#4285f4',
          '&:hover': {
            backgroundColor: '#4285f4',
            color: 'white',
            borderColor: '#4285f4',
          }
        };
      case 'facebook':
        return {
          borderColor: '#1877f2',
          color: '#1877f2',
          '&:hover': {
            backgroundColor: '#1877f2',
            color: 'white',
            borderColor: '#1877f2',
          }
        };
      case 'github':
        return {
          borderColor: '#333',
          color: '#333',
          '&:hover': {
            backgroundColor: '#333',
            color: 'white',
            borderColor: '#333',
          }
        };
      case 'apple':
        return {
          borderColor: '#000',
          color: '#000',
          '&:hover': {
            backgroundColor: '#000',
            color: 'white',
            borderColor: '#000',
          }
        };
      default:
        return {};
    }
  };

  return {
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 24px',
    border: '2px solid',
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing(1),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    ...getProviderStyles()
  };
});

const SecurityNote = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(76, 175, 80, 0.1)' 
    : 'rgba(76, 175, 80, 0.05)',
  borderRadius: '12px',
  marginTop: theme.spacing(2),
  border: `1px solid ${theme.palette.success.main}20`,
}));

const AuthProviderButtons = ({ onGoogleSignIn, loading }) => {
  const providers = [
    {
      name: 'google',
      label: 'Continue with Google',
      icon: <Google />,
      onClick: onGoogleSignIn,
      available: true
    },
    {
      name: 'facebook',
      label: 'Continue with Facebook',
      icon: <Facebook />,
      onClick: () => console.log('Facebook auth not implemented'),
      available: false
    },
    {
      name: 'github',
      label: 'Continue with GitHub',
      icon: <GitHub />,
      onClick: () => console.log('GitHub auth not implemented'),
      available: false
    },
    {
      name: 'apple',
      label: 'Continue with Apple',
      icon: <Apple />,
      onClick: () => console.log('Apple auth not implemented'),
      available: false
    }
  ];

  return (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          mb: 2, 
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        Choose your preferred sign-in method
      </Typography>

      {providers.map((provider) => (
        <ProviderButton
          key={provider.name}
          provider={provider.name}
          fullWidth
          variant="outlined"
          startIcon={provider.icon}
          onClick={provider.onClick}
          disabled={!provider.available || (provider.name === 'google' && loading)}
        >
          {provider.name === 'google' && loading 
            ? 'Signing in...' 
            : provider.label
          }
          {!provider.available && (
            <Typography variant="caption" sx={{ ml: 1, opacity: 0.6 }}>
              (Coming Soon)
            </Typography>
          )}
        </ProviderButton>
      ))}

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          or continue with email
        </Typography>
      </Divider>

      <SecurityNote>
        <Security sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
          Your data is secure and encrypted. We never store your social media passwords.
        </Typography>
      </SecurityNote>
    </Box>
  );
};

export default AuthProviderButtons;