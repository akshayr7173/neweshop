import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Rating,
  Divider,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Bolt,
  LocalShipping,
  Security,
  Verified,
} from "@mui/icons-material";

const ProductContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '500px',
  objectFit: 'cover',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
}));

const BuyNowButton = styled(ActionButton)({
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
  },
});

const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://localhost:7040/api/Product/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/src/assets/default.png";
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `https://localhost:7040${imageUrl}`;
    }
    
    return `https://localhost:7040/${imageUrl}`;
  };

  const addToCart = async () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (isInCart) {
      toast.info("Product already in cart");
      return;
    }

    try {
      await axios.post(
        `https://localhost:7040/api/Cart/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsInCart(true);
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error", err);
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        await axios.delete(`https://localhost:7040/api/Wishlist/Remove/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `https://localhost:7040/api/Wishlist/Add`,
          { productId: product.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `https://localhost:7040/api/Cart/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now error", err);
      toast.error("Failed to process order");
    }
  };

  if (loading) {
    return (
      <ProductContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </ProductContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductContainer>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error || "Product not found"}
        </Alert>
      </ProductContainer>
    );
  }

  const isOutOfStock = product.quantity === 0;
  const originalPrice = product.price * 1.2;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <ProductContainer>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <ProductImage
            src={getImageUrl(product.imageUrl)}
            alt={product.title || product.name}
            onError={(e) => {
              e.target.src = "/src/assets/default.png";
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {product.title || product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={4.2} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                (4.2) • 1,234 reviews
              </Typography>
            </Box>

            {product.category && (
              <Chip 
                label={product.category} 
                variant="outlined" 
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          <PriceBox>
            <CurrentPrice>₹{product.price}</CurrentPrice>
            {discountPercent > 0 && (
              <>
                <OriginalPrice>₹{Math.round(originalPrice)}</OriginalPrice>
                <Chip 
                  label={`${discountPercent}% OFF`} 
                  color="success" 
                  size="small"
                />
              </>
            )}
          </PriceBox>

          {isOutOfStock && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
              This product is currently out of stock
            </Alert>
          )}

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <BuyNowButton
              startIcon={<Bolt />}
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              sx={{ flex: 1, minWidth: '200px' }}
            >
              Buy Now
            </BuyNowButton>
            
            <ActionButton
              variant="outlined"
              startIcon={<ShoppingCart />}
              onClick={addToCart}
              disabled={isOutOfStock || isInCart}
              sx={{ flex: 1, minWidth: '200px' }}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </ActionButton>
            
            <ActionButton
              variant="outlined"
              startIcon={isWishlisted ? <Favorite /> : <FavoriteBorder />}
              onClick={toggleWishlist}
              color={isWishlisted ? "error" : "primary"}
            >
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </ActionButton>
          </Box>

          {/* Features */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FeatureCard>
                <LocalShipping sx={{ color: 'primary.main', mb: 1 }} />
                <Typography variant="caption" display="block">
                  Free Delivery
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={4}>
              <FeatureCard>
                <Security sx={{ color: 'primary.main', mb: 1 }} />
                <Typography variant="caption" display="block">
                  Secure Payment
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={4}>
              <FeatureCard>
                <Verified sx={{ color: 'primary.main', mb: 1 }} />
                <Typography variant="caption" display="block">
                  Authentic Product
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ProductContainer>
  );
};

export default ProductDetails;