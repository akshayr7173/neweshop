import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Receipt, 
  LocalShipping, 
  CheckCircle,
  Schedule,
  ShoppingBag
} from "@mui/icons-material";
import api from "../api/axios";

const OrdersContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const OrderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const OrderItemCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { bg: '#dcfce7', color: '#166534' };
      case 'shipped':
        return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'processing':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'pending':
        return { bg: '#fee2e2', color: '#dc2626' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const colors = getStatusColor();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    borderRadius: '8px',
  };
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Order/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle />;
      case 'shipped':
        return <LocalShipping />;
      case 'processing':
        return <Schedule />;
      default:
        return <Receipt />;
    }
  };

  const downloadInvoice = (orderId) => {
    window.open(`https://localhost:7040/api/Order/invoice/${orderId}`, '_blank');
  };

  if (loading) {
    return (
      <OrdersContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your orders
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingBag sx={{ fontSize: '5rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            When you place orders, they will appear here
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = "/"}
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
        orders.map((order) => (
          <OrderCard key={order.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusChip
                  icon={getStatusIcon(order.status)}
                  label={order.status || 'Processing'}
                  status={order.status}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {order.orderItems?.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <OrderItemCard>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <img
                          src={item.product?.imageUrl || "/assets/default.png"}
                          alt={item.product?.title}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {item.product?.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Qty: {item.quantity} × ₹{item.price}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </OrderItemCard>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Payment:</strong> {order.paymentMethod || 'COD'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Delivery Address:</strong> {order.address}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Total: ₹{order.totalAmount}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Receipt />}
                  onClick={() => downloadInvoice(order.id)}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Download Invoice
                </Button>
              </Box>
            </Box>
          </OrderCard>
        ))
      )}
    </OrdersContainer>
  );
};

export default Orders;