import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  ShoppingBag,
} from '@mui/icons-material';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1f2937',
  color: 'white',
  marginTop: 'auto',
  paddingTop: '4rem',
  paddingBottom: '2rem',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: '2rem',
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: '1rem',
  color: 'white',
  fontSize: '1.125rem',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#d1d5db',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.75rem',
  transition: 'color 0.2s ease',
  fontSize: '0.875rem',
  fontWeight: 500,
  '&:hover': {
    color: '#3b82f6',
    textDecoration: 'none',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#374151',
  color: '#d1d5db',
  margin: '0 0.25rem',
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    transform: 'translateY(-2px)',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  fontSize: '1.75rem',
  marginLeft: '0.5rem',
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <LogoSection>
                <ShoppingBag sx={{ color: '#3b82f6', fontSize: '2rem' }} />
                <LogoText>MyShop</LogoText>
              </LogoSection>
              <Typography variant="body2" sx={{ color: '#d1d5db', mb: 2, lineHeight: 1.6 }}>
                Your one-stop destination for quality products at amazing prices. 
                Shop with confidence and enjoy fast, reliable delivery.
              </Typography>
              <Stack direction="row" spacing={1}>
                <SocialButton size="small">
                  <Facebook fontSize="small" />
                </SocialButton>
                <SocialButton size="small">
                  <Twitter fontSize="small" />
                </SocialButton>
                <SocialButton size="small">
                  <Instagram fontSize="small" />
                </SocialButton>
                <SocialButton size="small">
                  <LinkedIn fontSize="small" />
                </SocialButton>
              </Stack>
            </FooterSection>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">Quick Links</FooterTitle>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/products">Products</FooterLink>
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/deals">Deals</FooterLink>
              <FooterLink href="/new-arrivals">New Arrivals</FooterLink>
            </FooterSection>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">Customer Service</FooterTitle>
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/returns">Returns</FooterLink>
              <FooterLink href="/shipping">Shipping Info</FooterLink>
              <FooterLink href="/track-order">Track Order</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </FooterSection>
          </Grid>

          {/* Account */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">Account</FooterTitle>
              <FooterLink href="/profile">My Account</FooterLink>
              <FooterLink href="/orders">Order History</FooterLink>
              <FooterLink href="/wishlist">Wishlist</FooterLink>
              <FooterLink href="/become-seller">Sell on MyShop</FooterLink>
            </FooterSection>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle>Contact Info</FooterTitle>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <LocationOn sx={{ fontSize: '1.25rem', mr: 1.5, color: '#9ca3af', mt: 0.25 }} />
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                  123 Shopping Street, Mumbai, India
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone sx={{ fontSize: '1.25rem', mr: 1.5, color: '#9ca3af' }} />
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ fontSize: '1.25rem', mr: 1.5, color: '#9ca3af' }} />
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                  support@myshop.com
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 500 }}>
                Customer support available 24/7
              </Typography>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#374151' }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © {currentYear} MyShop. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FooterLink href="/privacy" sx={{ display: 'inline', mb: 0, fontSize: '0.875rem' }}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" sx={{ display: 'inline', mb: 0, fontSize: '0.875rem' }}>
              Terms of Service
            </FooterLink>
            <FooterLink href="/cookies" sx={{ display: 'inline', mb: 0, fontSize: '0.875rem' }}>
              Cookie Policy
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;