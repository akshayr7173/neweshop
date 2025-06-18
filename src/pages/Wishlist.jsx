import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Delete, 
  ShoppingCart, 
  Favorite,
  FavoriteBorder
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const WishlistContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const WishlistCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
}));

const WishlistPage = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Fetch wishlist error", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/Wishlist/Remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (err) {
      console.error("Remove from wishlist error", err);
      setError("Failed to remove from wishlist");
    }
  };

  const addToCart = async (product) => {
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
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(product.id);
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart error", err);
      setError("Failed to add to cart");
    }
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <WishlistContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {wishlist.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteBorder sx={{ fontSize: '5rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Save items you love for later by clicking the heart icon
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
            }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <WishlistCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl || "/assets/default.png"}
                  alt={item.title}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => viewProduct(item.id)}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      cursor: 'pointer'
                    }}
                    onClick={() => viewProduct(item.id)}
                  >
                    {item.title}
                  </Typography>
                  
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, mb: 2 }}>
                    ₹{item.price}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <ActionButton
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(item)}
                      sx={{
                        background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0284c7, #c026d3)',
                        }
                      }}
                    >
                      Add to Cart
                    </ActionButton>
                    
                    <ActionButton
                      variant="outlined"
                      onClick={() => viewProduct(item.id)}
                    >
                      View Details
                    </ActionButton>
                    
                    <IconButton
                      color="error"
                      onClick={() => removeFromWishlist(item.id)}
                      sx={{ borderRadius: '8px' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </WishlistCard>
            </Grid>
          ))}
        </Grid>
      )}
    </WishlistContainer>
  );
};

export default WishlistPage;