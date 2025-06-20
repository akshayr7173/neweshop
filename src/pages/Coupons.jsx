import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalOffer,
  ContentCopy,
  CheckCircle,
  Schedule,
  Add,
} from "@mui/icons-material";
import api from "../api/axios";
import { toast } from "react-toastify";

const CouponsContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const CouponCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: `2px dashed ${theme.palette.primary.main}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
  },
}));

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Coupon", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data || []);
    } catch (error) {
      console.error("Error fetching coupons", error);
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const generateCoupon = async () => {
    try {
      setGenerating(true);
      await api.post("/Coupon/Generate", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("New coupon generated!");
      fetchCoupons();
    } catch (error) {
      console.error("Error generating coupon", error);
      toast.error("Failed to generate coupon");
    } finally {
      setGenerating(false);
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
  };

  const getStatusChip = (coupon) => {
    if (coupon.isUsed) {
      return <Chip label="Used" color="default" size="small" icon={<CheckCircle />} />;
    }
    
    const expiryDate = new Date(coupon.expiryDate);
    const now = new Date();
    
    if (expiryDate < now) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    
    return <Chip label="Active" color="success" size="small" icon={<Schedule />} />;
  };

  if (loading) {
    return (
      <CouponsContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </CouponsContainer>
    );
  }

  return (
    <CouponsContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            My Coupons
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and use your discount coupons
          </Typography>
        </Box>
        <GenerateButton
          startIcon={<Add />}
          onClick={generateCoupon}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate New Coupon'}
        </GenerateButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {coupons.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 8, borderRadius: '16px' }}>
          <LocalOffer sx={{ fontSize: '5rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No coupons available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Generate your first coupon to start saving on your orders
          </Typography>
          <GenerateButton
            startIcon={<Add />}
            onClick={generateCoupon}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Your First Coupon'}
          </GenerateButton>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {coupons.map((coupon) => (
            <Grid item xs={12} sm={6} md={4} key={coupon.id}>
              <CouponCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <LocalOffer sx={{ color: 'primary.main', fontSize: '2rem' }} />
                    {getStatusChip(coupon)}
                  </Box>
                  
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'monospace' }}>
                    {coupon.code}
                  </Typography>
                  
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600, mb: 2 }}>
                    Save ₹{coupon.discountAmount}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Valid until: {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={() => copyCouponCode(coupon.code)}
                    disabled={coupon.isUsed}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    Copy Code
                  </Button>
                </CardContent>
              </CouponCard>
            </Grid>
          ))}
        </Grid>
      )}
    </CouponsContainer>
  );
};

export default Coupons;