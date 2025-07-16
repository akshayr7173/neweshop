import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Select,
  MenuItem,
  Paper,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../pages/ProductCard";
import {
  TrendingUp,
  LocalOffer,
  Star,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
  Timer,
} from "@mui/icons-material";
import SuggestedProducts from "../components/SuggestedProducts";
import api from "../api/axios";

// Banner Images
import banner1 from "../assets/banner1.jpeg";
import banner2 from "../assets/banner2.jpeg";
import banner3 from "../assets/banner3.jpeg";

const HeroSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 40px rgba(0, 0, 0, 0.3)'
    : '0 10px 40px rgba(0, 0, 0, 0.1)',
  '& .slick-dots': {
    bottom: '20px',
    '& li button:before': {
      fontSize: '12px',
      color: 'white',
      opacity: 0.5,
    },
    '& li.slick-active button:before': {
      opacity: 1,
    }
  }
}));

const BannerImage = styled('img')(({ theme }) => ({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  display: 'block',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(0, 1),
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

const FlashSaleContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2d1b0e, #3d2817)'
    : 'linear-gradient(135deg, #fef3c7, #fde68a)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)',
  }
}));

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

const CountdownTimer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
}));

const TimerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  padding: theme.spacing(0.5, 1),
  borderRadius: '8px',
  minWidth: '60px',
  justifyContent: 'center',
}));

const CategoryFilter = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomArrow = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(26, 26, 26, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(26, 26, 26, 1)'
      : 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.1)',
  }
}));

const PrevArrow = ({ onClick }) => (
  <CustomArrow onClick={onClick} sx={{ left: 16 }}>
    <ChevronLeft />
  </CustomArrow>
);

const NextArrow = ({ onClick }) => (
  <CustomArrow onClick={onClick} sx={{ right: 16 }}>
    <ChevronRight />
  </CustomArrow>
);

const Home = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const BASE_URL = "https://localhost:7040";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFlashProducts();
    fetchTrendingProducts();
    fetchCategories();
    fetchAllProducts();
    fetchWishlist();
    
    // Countdown timer - updates every second
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds;

        if (newSeconds > 0) {
          newSeconds--;
        } else if (newMinutes > 0) {
          newMinutes--;
          newSeconds = 59;
        } else if (newHours > 0) {
          newHours--;
          newMinutes = 59;
          newSeconds = 59;
        } else {
          // Reset to 24 hours when timer reaches 0
          newHours = 23;
          newMinutes = 59;
          newSeconds = 59;
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [selectedCategory]);

  const fetchFlashProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Product/FlashSale`);
      const data = await res.json();
      setFlashProducts(data);
    } catch (err) {
      console.error("Error loading flash products", err);
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Product/Trending`);
      const data = await res.json();
      setTrendingProducts(data);
    } catch (err) {
      console.error("Error loading trending products", err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      let url = `${BASE_URL}/api/Product/Approved?page=1&pageSize=1000`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (err) {
      console.error("Error loading all products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Product/Categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Wishlist`, {
        credentials: 'include',
      });
      const data = await res.json();
      setWishlist(data || []);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const isInWishlist = wishlist.includes(productId);
      const method = isInWishlist ? "DELETE" : "POST";
      const url = isInWishlist
        ? `${BASE_URL}/api/Wishlist/Remove/${productId}`
        : `${BASE_URL}/api/Wishlist/Add`;

      const body = isInWishlist ? null : JSON.stringify({ productId });

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
        credentials: "include",
      });

      // Refetch wishlist
      fetchWishlist();
    } catch (error) {
      console.error("Wishlist toggle error", error);
    }
  };

  // Track search activity
  const trackSearch = async (query, category = null) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post('/auth/track-search', {
        searchQuery: query,
        category,
        actionType: 'search'
      }, { headers });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  // Enhanced category change handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      trackSearch(`category:${category}`, category);
    }
  };

  const sliderImages = [banner1, banner2, banner3];

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    fade: true,
  };

  const flashSaleSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      {/* Hero Banner */}
      <HeroSection>
        <Slider {...sliderSettings}>
          {sliderImages.map((img, i) => (
            <Box key={i}>
              <BannerImage src={img} alt={`banner-${i}`} />
            </Box>
          ))}
        </Slider>
      </HeroSection>

      {/* Suggested Products */}
      <SuggestedProducts />

      {/* Flash Sale */}
      {flashProducts.length > 0 && (
        <FlashSaleContainer>
          <SectionHeader>
            <SectionTitle>
              <LocalOffer sx={{ color: "#f59e0b" }} />
              ⚡ Flash Sale
              <Chip label="Limited Time" size="small" sx={{ bgcolor: "#dc2626", color: "white" }} />
            </SectionTitle>
            <Button endIcon={<ArrowForward />} sx={{ color: "#92400e", fontWeight: 600 }}>
              View All
            </Button>
          </SectionHeader>
          <Box>
            <Slider {...flashSaleSettings}>
              {flashProducts.map((product) => (
                <Box key={product.id} sx={{ px: 1 }}>
                  <ProductCard
                    product={product}
                    wishlist={wishlist}
                    handleToggleWishlist={handleToggleWishlist}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </FlashSaleContainer>
      )}

      {/* Flash Deals with Timer */}
      {trendingProducts.length > 0 && (
        <FlashDealsContainer className="animate-fade-in-up">
          <SectionHeader>
            <SectionTitle sx={{ color: '#dc2626' }}>
              🔥 Flash Deals
            </SectionTitle>
            <Button 
              endIcon={<ArrowForward />}
              sx={{ 
                color: '#dc2626',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.08)' }
              }}
            >
              View All Deals
            </Button>
          </SectionHeader>

          <CountdownTimer>
            <Timer sx={{ color: '#dc2626' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626', mr: 1 }}>
              Ends in:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TimerBox>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#dc2626' }}>h</Typography>
              </TimerBox>
              <Typography variant="body2" sx={{ color: '#dc2626', alignSelf: 'center' }}>:</Typography>
              <TimerBox>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#dc2626' }}>m</Typography>
              </TimerBox>
              <Typography variant="body2" sx={{ color: '#dc2626', alignSelf: 'center' }}>:</Typography>
              <TimerBox>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#dc2626' }}>s</Typography>
              </TimerBox>
            </Box>
          </CountdownTimer>

          <Grid container spacing={3}>
            {trendingProducts.slice(0, 8).map((product, index) => {
              // Mock data for demo
              const originalPrice = product.price * 1.4;
              const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    wishlist={wishlist}
                    handleToggleWishlist={handleToggleWishlist}
                    isFlashDeal={true}
                    discountPercent={discountPercent}
                  />
                </Grid>
              );
            })}
          </Grid>
        </FlashDealsContainer>
      )}

      {/* All Products */}
      <Box>
        <SectionHeader>
          <SectionTitle>
            <Star sx={{ color: "#f59e0b" }} />
            All Products
          </SectionTitle>
        </SectionHeader>

        <CategoryFilter>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Filter by Category:
            </Typography>
            <StyledSelect
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              displayEmpty
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat, i) => (
                <MenuItem key={i} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </StyledSelect>
            <Typography variant="caption" color="text.secondary">
              {allProducts.length} products found
            </Typography>
          </Box>
        </CategoryFilter>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={3} sx={{ maxWidth: '1200px' }}>
            {allProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard
                  product={product}
                  wishlist={wishlist}
                  handleToggleWishlist={handleToggleWishlist}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;