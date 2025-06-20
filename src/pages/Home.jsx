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
import FlashDeals from "../pages/FlashDeals";
import {
  TrendingUp,
  LocalOffer,
  Star,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

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
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const BASE_URL = "https://localhost:7040";

  useEffect(() => {
    fetchFlashProducts();
    fetchCategories();
    fetchAllProducts();
    fetchWishlist();
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

      {/* Flash Deals Component */}
      <Box sx={{ mb: 4 }}>
        <FlashDeals />
      </Box>

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
              onChange={(e) => setSelectedCategory(e.target.value)}
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

        <Grid container spacing={3}>
          {allProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
              <ProductCard
                product={product}
                wishlist={wishlist}
                handleToggleWishlist={handleToggleWishlist}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
