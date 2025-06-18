import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Select,
  MenuItem,
  Pagination,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
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
  ChevronRight
} from "@mui/icons-material";

// Import banner images
import banner1 from "../assets/banner1.jpeg";
import banner2 from "../assets/banner2.jpeg";
import banner3 from "../assets/banner3.jpeg";

const HeroSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
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
  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
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
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  marginBottom: theme.spacing(3),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.12)',
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
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const BASE_URL = "https://localhost:7040";

  useEffect(() => {
    fetchFlashProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [page, selectedCategory]);

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
      let url = `${BASE_URL}/api/Product/Approved?page=${page}&pageSize=${pageSize}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setAllProducts(data.products || []);
      setTotalProducts(data.total || 0);
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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
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
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, px: { xs: 2, md: 3 } }}>
      {/* Hero Slider */}
      <HeroSection className="animate-fade-in-up">
        <Slider {...sliderSettings}>
          {sliderImages.map((img, index) => (
            <Box key={index}>
              <BannerImage
                src={img}
                alt={`banner-${index}`}
                onError={(e) => {
                  e.target.src = "/assets/default.png";
                }}
              />
            </Box>
          ))}
        </Slider>
      </HeroSection>

      {/* Flash Sale Section */}
      {flashProducts.length > 0 && (
        <FlashSaleContainer className="animate-fade-in-up">
          <SectionHeader>
            <SectionTitle>
              <LocalOffer sx={{ color: '#f59e0b' }} />
              ⚡ Flash Sale
              <Chip 
                label="Limited Time" 
                size="small" 
                sx={{ 
                  bgcolor: '#dc2626', 
                  color: 'white',
                  animation: 'pulse 2s infinite'
                }} 
              />
            </SectionTitle>
            <Button 
              endIcon={<ArrowForward />}
              sx={{ 
                color: '#92400e',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(146, 64, 14, 0.08)' }
              }}
            >
              View All
            </Button>
          </SectionHeader>
          
          <Box sx={{ position: 'relative' }}>
            <Slider {...flashSaleSettings}>
              {flashProducts.map((product) => (
                <Box key={product.id} sx={{ px: 1 }}>
                  <ProductCard product={product} />
                </Box>
              ))}
            </Slider>
          </Box>
        </FlashSaleContainer>
      )}

      {/* Flash Deals Component */}
      <Box className="animate-fade-in-up" sx={{ mb: 4 }}>
        <FlashDeals />
      </Box>

      {/* All Products Section */}
      <Box className="animate-fade-in-up">
        <SectionHeader>
          <SectionTitle>
            <Star sx={{ color: '#f59e0b' }} />
            All Products
          </SectionTitle>
        </SectionHeader>

        {/* Category Filter */}
        <CategoryFilter>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 'fit-content' }}>
              Filter by Category:
            </Typography>
            <StyledSelect
              value={selectedCategory}
              onChange={handleCategoryChange}
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
              {totalProducts} products found
            </Typography>
          </Box>
        </CategoryFilter>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {allProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalProducts > pageSize && (
          <Box sx={{ 
            mt: 6, 
            display: "flex", 
            justifyContent: "center",
            '& .MuiPagination-root': {
              '& .MuiPaginationItem-root': {
                borderRadius: '12px',
                fontWeight: 500,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
                  color: 'white',
                }
              }
            }
          }}>
            <Pagination
              count={Math.ceil(totalProducts / pageSize)}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;