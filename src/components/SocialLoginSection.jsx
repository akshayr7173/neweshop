import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleSignInButton from './GoogleSignInButton';

const SocialSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(248, 250, 252, 0.8)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(3),
}));

const SocialTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const QuickSignIn = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const SocialLoginSection = ({ variant = 'signin', title, subtitle }) => {
  const defaultTitle = variant === 'signin' 
    ? 'Quick Sign In' 
    : 'Quick Sign Up';
    
  const defaultSubtitle = variant === 'signin'
    ? 'Sign in with your Google account for faster access'
    : 'Create your account instantly with Google';

  return (
    <SocialSection elevation={0}>
      <SocialTitle variant="h6">
        {title || defaultTitle}
      </SocialTitle>
      
      <QuickSignIn>
        {subtitle || defaultSubtitle}
      </QuickSignIn>
      
      <GoogleSignInButton variant={variant} />
      
      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary">
          or continue with email
        </Typography>
      </Divider>
    </SocialSection>
  );
};

export default SocialLoginSection;