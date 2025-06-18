import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  Box,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LocalFireDepartment, 
  Timer, 
  TrendingUp,
  ArrowForward 
} from "@mui/icons-material";

const FlashDealsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
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
  color: '#dc2626',
}));

const DealCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: '16px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)',
  }
}));

const DealBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: '#dc2626',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.75rem',
  zIndex: 2,
  animation: 'pulse 2s infinite',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#dc2626',
    borderRadius: 4,
  }
}));

const CountdownTimer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
}));

const FlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await axios.get("https://localhost:7040/api/Product/Trending");
      setDeals(res.data);
    } catch (err) {
      console.error("Error fetching trending products", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: '#dc2626' }} />
      </Box>
    );
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <FlashDealsContainer className="animate-fade-in-up">
      <SectionHeader>
        <SectionTitle>
          <LocalFireDepartment sx={{ color: '#dc2626' }} />
          🔥 Trending Deals
        </SectionTitle>
        <Button 
          endIcon={<ArrowForward />}
          sx={{ 
            color: '#dc2626',
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.08)' }
          }}
        >
          View All Trending
        </Button>
      </SectionHeader>

      <CountdownTimer>
        <Timer sx={{ color: '#dc2626' }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>
          Ends in: {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </Typography>
      </CountdownTimer>

      <Grid container spacing={3}>
        {deals.map((product, index) => {
          // Mock data for demo
          const originalPrice = product.price * 1.4;
          const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
          const soldPercentage = Math.random() * 80 + 10; // 10-90%
          const soldCount = Math.floor(Math.random() * 500 + 50);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <DealCard>
                <Box sx={{ position: 'relative' }}>
                  <DealBadge label={`${discountPercent}% OFF`} />
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.imageUrl || "/assets/default.png"}
                    alt={product.title}
                    sx={{ objectFit: "cover" }}
                  />
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {product.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 700 }}>
                      ₹{product.price}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}
                    >
                      ₹{Math.round(originalPrice)}
                    </Typography>
                  </Box>

                  <ProgressContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600 }}>
                        {soldCount} sold
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(soldPercentage)}%
                      </Typography>
                    </Box>
                    <StyledLinearProgress 
                      variant="determinate" 
                      value={soldPercentage} 
                    />
                  </ProgressContainer>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<TrendingUp />}
                    onClick={() => navigate(`/product/${product.id}`)}
                    sx={{
                      mt: 1,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
                      }
                    }}
                  >
                    Grab Deal
                  </Button>
                </CardContent>
              </DealCard>
            </Grid>
          );
        })}
      </Grid>
    </FlashDealsContainer>
  );
};

export default FlashDeals;