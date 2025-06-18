import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Delete, 
  Add, 
  Remove, 
  ShoppingCartCheckout,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CartContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const CartCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  }
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  position: 'sticky',
  top: theme.spacing(2),
}));

const CheckoutButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
  background: 'linear-gradient(135deg, #10b981, #059669)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669, #047857)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
  }
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '8px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  }
}));

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
      calculateTotal(res.data);
    } catch (error) {
      console.error("Error fetching cart", error);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    setTotalBill(total);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // Update quantity in backend (assuming API exists)
      await api.put(`/Cart/${itemId}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Update quantity error", err);
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/Cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCartItems();
    } catch (err) {
      console.error("Delete error", err);
      setError("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    
    try {
      await Promise.all(
        cartItems.map((item) =>
          api.delete(`/Cart/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setCartItems([]);
      setTotalBill(0);
    } catch (err) {
      console.error("Clear cart error", err);
      setError("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <CartContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCartIcon sx={{ fontSize: '5rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added anything to your cart yet
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
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <CartCard key={item.id}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        image={item.product?.imageUrl || "/assets/default.png"}
                        alt={item.product?.title}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: '12px',
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.product?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.product?.description?.substring(0, 100)}...
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        ₹{item.product?.price}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QuantityButton
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </QuantityButton>
                          
                          <TextField
                            value={item.quantity}
                            size="small"
                            sx={{
                              width: 60,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                textAlign: 'center',
                              },
                              '& input': {
                                textAlign: 'center',
                                padding: '8px',
                              }
                            }}
                            inputProps={{ min: 1, type: 'number' }}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 1;
                              updateQuantity(item.id, newQty);
                            }}
                          />
                          
                          <QuantityButton
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Add fontSize="small" />
                          </QuantityButton>
                        </Box>
                        
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Total: ₹{(item.product?.price * item.quantity).toFixed(2)}
                        </Typography>
                        
                        <IconButton
                          onClick={() => removeItem(item.id)}
                          color="error"
                          sx={{ borderRadius: '8px' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </CartCard>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <SummaryCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal ({cartItems.length} items)</Typography>
                  <Typography variant="body2">₹{totalBill.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2" color="success.main">FREE</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">₹{(totalBill * 0.18).toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{(totalBill * 1.18).toFixed(2)}
                </Typography>
              </Box>
              
              <CheckoutButton
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartCheckout />}
                onClick={handleCheckout}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </CheckoutButton>
              
              <Button
                variant="outlined"
                fullWidth
                color="error"
                onClick={clearCart}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Clear Cart
              </Button>
            </SummaryCard>
          </Grid>
        </Grid>
      )}
    </CartContainer>
  );
};

export default Cart;