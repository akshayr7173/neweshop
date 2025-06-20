import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalOffer,
  Receipt,
  ShoppingCartCheckout,
  Download,
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const CheckoutPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  marginBottom: theme.spacing(2),
}));

const CouponCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
  }
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
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  }
}));

import { alpha } from "@mui/material/styles";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    loadCoupons();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, discount]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { items, totalAmount } = res.data;
      const formattedItems = items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.productId,
          title: item.product,
          price: item.price,
          imageUrl: item.imageUrl,
        },
      }));

      setCartItems(formattedItems);
      setSubtotal(totalAmount);
    } catch (error) {
      console.error("Error fetching cart", error);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      const res = await api.get("/Coupon", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableCoupons(res.data || []);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  const calculateTotal = () => {
    const finalTotal = subtotal - discount;
    setTotal(Math.max(finalTotal, 0));
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post(`/Coupon/Apply/${code}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const discountAmount = res.data.discountAmount || 0;
      setDiscount(discountAmount);
      setAppliedCoupon({ code, discount: discountAmount });
      setCouponCode("");
      toast.success(`Coupon applied! You saved ₹${discountAmount}`);
    } catch (error) {
      console.error("Error applying coupon", error);
      toast.error("Invalid or expired coupon code");
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const handleConfirm = async () => {
    if (!address.trim()) {
      setError("Delivery address is required!");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const orderDetails = {
        address: address.trim(),
        paymentMode,
        couponCode: appliedCoupon?.code || null,
      };

      const res = await api.post("/Cart/Checkout", orderDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mark coupon as used if applied
      if (appliedCoupon?.code) {
        try {
          await api.post(`/Coupon/MarkAsUsed/${appliedCoupon.code}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (couponError) {
          console.error("Error marking coupon as used", couponError);
        }
      }

      setLastOrderId(res.data.orderId);
      toast.success("Order placed successfully!");
      
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Checkout failed", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadInvoice = async () => {
    if (!lastOrderId) return;
    
    try {
      window.open(`https://localhost:7040/api/Order/invoice/${lastOrderId}`, '_blank');
    } catch (error) {
      console.error("Error downloading invoice", error);
      toast.error("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <CheckoutContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {lastOrderId && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: '12px' }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Download />}
              onClick={downloadInvoice}
            >
              Download Invoice
            </Button>
          }
        >
          Order placed successfully! Order ID: #{lastOrderId}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Order Details */}
        <Grid item xs={12} md={8}>
          {/* Cart Items */}
          <CheckoutPaper sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Items ({cartItems.length})
            </Typography>
            
            {cartItems.map((item) => (
              <ProductCard key={item.id}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }}
                      image={item.product.imageUrl || "/assets/default.png"}
                      alt={item.product.title}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </ProductCard>
            ))}
          </CheckoutPaper>

          {/* Delivery Address */}
          <CheckoutPaper sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Delivery Address
            </Typography>
            <StyledTextField
              fullWidth
              multiline
              rows={3}
              label="Complete Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              required
            />
          </CheckoutPaper>

          {/* Payment Method */}
          <CheckoutPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <FormControlLabel 
                  value="cod" 
                  control={<Radio />} 
                  label="Cash on Delivery (COD)" 
                />
                <FormControlLabel 
                  value="upi" 
                  control={<Radio />} 
                  label="UPI Payment" 
                />
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label="Credit/Debit Card" 
                />
              </RadioGroup>
            </FormControl>
          </CheckoutPaper>
        </Grid>

        {/* Right Column - Order Summary & Coupons */}
        <Grid item xs={12} md={4}>
          {/* Available Coupons */}
          <CheckoutPaper sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
              Available Coupons
            </Typography>
            
            {availableCoupons.length > 0 ? (
              availableCoupons.map((coupon) => (
                <CouponCard 
                  key={coupon.code} 
                  onClick={() => applyCoupon(coupon.code)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {coupon.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Save ₹{coupon.discountAmount}
                        </Typography>
                      </Box>
                      <Chip label="Apply" size="small" color="primary" />
                    </Box>
                  </CardContent>
                </CouponCard>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No coupons available
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledTextField
                size="small"
                label="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={() => applyCoupon(couponCode)}
                disabled={!couponCode.trim()}
                sx={{ borderRadius: '12px' }}
              >
                Apply
              </Button>
            </Box>
          </CheckoutPaper>

          {/* Order Summary */}
          <CheckoutPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
              </Box>
              
              {appliedCoupon && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Coupon ({appliedCoupon.code})
                    <Button 
                      size="small" 
                      onClick={removeCoupon}
                      sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                    >
                      ✕
                    </Button>
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    -₹{discount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery</Typography>
                <Typography variant="body2" color="success.main">FREE</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <CheckoutButton
              fullWidth
              size="large"
              startIcon={<ShoppingCartCheckout />}
              onClick={handleConfirm}
              disabled={processing || cartItems.length === 0}
            >
              {processing ? 'Processing...' : `Place Order • ₹${total.toFixed(2)}`}
            </CheckoutButton>
          </CheckoutPaper>
        </Grid>
      </Grid>
    </CheckoutContainer>
  );
};

export default Checkout;