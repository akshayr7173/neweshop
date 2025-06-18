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
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: 'auto',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(3),
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff',
  border: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    transform: 'translateY(-2px)',
  },
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  fontSize: '1.5rem',
  marginLeft: theme.spacing(1),
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <LogoSection>
                <ShoppingBag sx={{ color: '#0ea5e9', fontSize: '2rem' }} />
                <LogoText>MyShop</LogoText>
              </LogoSection>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
              <FooterTitle variant="h6">Contact Info</FooterTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  123 Shopping Street, Mumbai, India
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  support@myshop.com
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Customer support available 24/7
              </Typography>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} MyShop. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FooterLink href="/privacy" sx={{ display: 'inline', mb: 0 }}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" sx={{ display: 'inline', mb: 0 }}>
              Terms of Service
            </FooterLink>
            <FooterLink href="/cookies" sx={{ display: 'inline', mb: 0 }}>
              Cookie Policy
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;