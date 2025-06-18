import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BoltIcon from "@mui/icons-material/Bolt";
import api from "../api/axios";
import { toast } from 'react-toastify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
    '& .product-image': {
      transform: 'scale(1.05)',
    },
    '& .quick-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: "cover",
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(26, 26, 26, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  width: 40,
  height: 40,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(26, 26, 26, 1)' 
      : 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  }
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
}));

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: 'white',
  fontSize: '0.75rem',
  height: 24,
  fontWeight: 600,
}));

const BuyButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
  }
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '10px 20px',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.3)',
  }
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Calculate discount percentage (mock data)
  const originalPrice = product.price * 1.2; // Assuming 20% discount
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Fix image URL - handle both relative and absolute URLs including Google images
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/src/assets/default.png";
    
    // If it's already a full URL (including Google images), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, construct the full URL
    if (imageUrl.startsWith('/')) {
      return `https://localhost:7040${imageUrl}`;
    }
    
    // If it doesn't start with /, add it
    return `https://localhost:7040/${imageUrl}`;
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await api.delete(`/Wishlist/Remove/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await api.post("/Wishlist/Add", {
          userId: parseInt(userId),
          productId: product.id
        }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      await api.post("/Cart/add", {
        userId: parseInt(userId),
        productId: product.id,
        quantity: 1
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      navigate("/login");
      return;
    }

    // Add to cart first, then navigate to checkout
    try {
      await api.post("/Cart/add", {
        userId: parseInt(userId),
        productId: product.id,
        quantity: 1
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Navigate directly to checkout
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now error:", err);
      toast.error("Failed to process order");
      // Fallback to product details page
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <StyledCard className="animate-fade-in-up">
      <Box sx={{ position: 'relative' }}>
        <ProductImage
          className="product-image"
          component="img"
          image={getImageUrl(product.imageUrl)}
          alt={product.title || product.name}
          onClick={() => navigate(`/product/${product.id}`)}
          onError={(e) => {
            e.target.src = "/src/assets/default.png";
          }}
        />
        
        <QuickActions className="quick-actions">
          <ActionButton onClick={handleWishlistToggle}>
            {isWishlisted ? (
              <FavoriteIcon sx={{ color: 'error.main' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </ActionButton>
          <ActionButton onClick={handleAddToCart}>
            <ShoppingCartIcon />
          </ActionButton>
        </QuickActions>

        {discountPercent > 0 && (
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <DiscountChip label={`${discountPercent}% OFF`} size="small" />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            cursor: 'pointer',
            color: 'text.primary',
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title || product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.2} precision={0.1} size="small" readOnly />
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            (4.2)
          </Typography>
        </Box>

        <PriceBox>
          <CurrentPrice>₹{product.price}</CurrentPrice>
          {discountPercent > 0 && (
            <OriginalPrice>₹{Math.round(originalPrice)}</OriginalPrice>
          )}
        </PriceBox>

        {product.category && (
          <Chip 
            label={product.category} 
            size="small" 
            variant="outlined"
            sx={{ mt: 1, fontSize: '0.75rem' }}
          />
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <BuyButton
          variant="contained"
          startIcon={<BoltIcon />}
          onClick={handleBuyNow}
          fullWidth
        >
          Buy Now
        </BuyButton>
        <AddToCartButton
          variant="outlined"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          fullWidth
        >
          Add to Cart
        </AddToCartButton>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;