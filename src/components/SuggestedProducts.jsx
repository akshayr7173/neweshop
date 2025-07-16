import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Skeleton,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  TrendingUp, 
  PersonalVideo, 
  ShoppingCart,
  Favorite,
  FavoriteBorder 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const SuggestionsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4, 0),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217, 70, 239, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const ProductImage = styled(CardMedia)({
  height: 180,
  objectFit: 'cover',
  cursor: 'pointer',
});

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '6px 12px',
  fontSize: '0.875rem',
}));

const PersonalizedChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: theme.palette.success.main,
  color: 'white',
  fontSize: '0.75rem',
  height: 24,
  fontWeight: 600,
  zIndex: 2,
}));

const SuggestedProducts = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalized, setPersonalized] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('/auth/suggestions', { headers });
      
      setSuggestions(response.data.suggestions || []);
      setPersonalized(response.data.personalized || false);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackProductView = async (productId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post('/auth/track-search', {
        productId,
        actionType: 'view'
      }, { headers });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  };

  const handleProductClick = (productId) => {
    trackProductView(productId);
    navigate(`/product/${productId}`);
  };

  const addToCart = async (product, e) => {
    e.stopPropagation();
    
    if (!token) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/Cart/add', {
        productId: product.id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/assets/default.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return `https://localhost:7040/${imageUrl.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <SuggestionsContainer>
          <Container maxWidth="lg">
            <SectionHeader>
              <Skeleton variant="text" width={300} height={40} />
            </SectionHeader>
            <Grid container spacing={3}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ borderRadius: '16px' }}>
                    <Skeleton variant="rectangular" height={180} />
                    <CardContent>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={32} width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </SuggestionsContainer>
      </Container>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <SuggestionsContainer>
        <Container maxWidth="lg">
          <SectionHeader>
            <SectionTitle>
              {personalized ? (
                <>
                  <PersonalVideo sx={{ color: '#10b981' }} />
                  Recommended for You
                </>
              ) : (
                <>
                  <TrendingUp sx={{ color: '#f59e0b' }} />
                  Trending Products
                </>
              )}
            </SectionTitle>
            {personalized && (
              <Chip 
                label="Personalized" 
                color="success" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </SectionHeader>

          <Grid container spacing={3}>
            {suggestions.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard onClick={() => handleProductClick(product.id)}>
                  {personalized && (
                    <PersonalizedChip label="For You" size="small" />
                  )}
                  
                  <ProductImage
                    component="img"
                    image={getImageUrl(product.imageUrl)}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/assets/default.png';
                    }}
                  />
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        height: '2.6em',
                      }}
                    >
                      {product.title}
                    </Typography>

                    <PriceText sx={{ mb: 1 }}>
                      ₹{product.price}
                    </PriceText>

                    {product.category && (
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ mb: 2, fontSize: '0.75rem' }}
                      />
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <ActionButton
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={(e) => addToCart(product, e)}
                        sx={{
                          background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0284c7, #c026d3)',
                          }
                        }}
                      >
                        Add to Cart
                      </ActionButton>
                    </Box>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SuggestionsContainer>
    </Container>
  );
};

export default SuggestedProducts;