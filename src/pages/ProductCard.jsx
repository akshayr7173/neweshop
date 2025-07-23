import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BoltIcon from "@mui/icons-material/Bolt";
import api from "../api/axios";
import { toast } from "react-toastify";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "white",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderColor: "#d1d5db",
    "& .product-image": {
      transform: "scale(1.05)",
    },
    "& .quick-actions": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const ProductImage = styled(CardMedia)({
  height: 220,
  objectFit: "cover",
  transition: "transform 0.3s ease",
  cursor: "pointer",
});

const QuickActions = styled(Box)({
  position: "absolute",
  top: 16,
  right: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  opacity: 0,
  transform: "translateY(-10px)",
  transition: "all 0.3s ease",
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  width: 44,
  height: 44,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  color: "#374151",
  "&:hover": {
    backgroundColor: "white",
    transform: "scale(1.1)",
    color: "#3b82f6",
  },
}));

const PriceBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
});

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1.375rem",
  fontWeight: 700,
  color: "#3b82f6",
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: "#9ca3af",
  textDecoration: "line-through",
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#10b981",
  color: "white",
  fontSize: "0.8125rem",
  height: 24,
  fontWeight: 600,
}));

const OutOfStockChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#ef4444",
  color: "white",
  fontSize: "0.8125rem",
  height: 24,
  fontWeight: 600,
}));

const BuyButton = styled(Button)({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  fontSize: "14px",
  "&:hover": {
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    transform: "translateY(-1px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  "&:disabled": {
    background: "#f3f4f6",
    color: "#9ca3af",
    transform: "none",
    boxShadow: "none",
  },
});

const AddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  borderColor: "#3b82f6",
  color: "#3b82f6",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#3b82f6",
    color: "white",
    transform: "translateY(-1px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  "&:disabled": {
    borderColor: "#f3f4f6",
    color: "#9ca3af",
    transform: "none",
    boxShadow: "none",
  },
}));

// Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const token = localStorage.getItem("token");

  const isOutOfStock = product.quantity === 0;
  const originalPrice = product.price * 1.2;
  const discountPercent = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/src/assets/default.png";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    if (imageUrl.startsWith("/")) return `https://localhost:7040${imageUrl}`;
    return `https://localhost:7040/${imageUrl}`;
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const response = await api.get("/Cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const exists = response.data.some(
          (item) => item.productId === product.id
        );
        setIsInCart(exists);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, [product.id, token]);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/Wishlist/Remove/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await api.post(
          "/Wishlist/Add",
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
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error("Please login to add to cart");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (isInCart) {
      toast.info("Product already in cart");
      return;
    }

    try {
      await api.post(
        "/Cart/add",
        { productId: product.id, quantity: 1 },
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
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      await api.post(
        "/Cart/add",
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now error:", err);
      toast.error("Failed to process order");
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <StyledCard className="animate-fade-in-up">
      <Box sx={{ position: "relative" }}>
        <ProductImage
          className="product-image"
          component="img"
          image={getImageUrl(product.imageUrl)}
          alt={product.title || product.name}
          onClick={() => navigate(`/product/${product.id}`)}
          onError={(e) => {
            e.target.src = "/src/assets/default.png";
          }}
        />

        <QuickActions className="quick-actions">
          <ActionButton onClick={handleWishlistToggle}>
            {isWishlisted ? (
              <FavoriteIcon sx={{ color: "error.main" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </ActionButton>
          {!isOutOfStock && (
            <ActionButton onClick={handleAddToCart}>
              <ShoppingCartIcon />
            </ActionButton>
          )}
        </QuickActions>

        {isOutOfStock ? (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <OutOfStockChip label="Out of Stock" size="small" />
          </Box>
        ) : discountPercent > 0 ? (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <DiscountChip label={`${discountPercent}% OFF`} size="small" />
          </Box>
        ) : null}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.125rem",
            fontWeight: 600,
            mb: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            cursor: "pointer",
            color: "#1f2937",
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title || product.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating value={4.2} precision={0.1} size="small" readOnly />
          <Typography
            variant="body2"
            sx={{ ml: 1, color: "#6b7280", fontSize: "0.8125rem", fontWeight: 500 }}
          >
            (4.2)
          </Typography>
        </Box>

        <PriceBox>
          <CurrentPrice>₹{product.price}</CurrentPrice>
          {!isOutOfStock && discountPercent > 0 && (
            <OriginalPrice>₹{Math.round(originalPrice)}</OriginalPrice>
          )}
        </PriceBox>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem", fontWeight: 500, borderColor: "#d1d5db", color: "#6b7280" }}
            />
          )}
          {product.quantity !== undefined && (
            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 500 }}>
              Stock: {product.quantity}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
        {isOutOfStock ? (
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            onClick={handleWishlistToggle}
            fullWidth
            sx={{ 
              borderRadius: "12px", 
              textTransform: "none", 
              fontWeight: 600,
              padding: "12px 24px",
              fontSize: "14px",
              borderColor: "#d1d5db",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb"
              }
            }}
          >
            Add to Wishlist
          </Button>
        ) : (
          <>
            <BuyButton
              variant="contained"
              startIcon={<BoltIcon />}
              onClick={handleBuyNow}
              fullWidth
            >
              Buy Now
            </BuyButton>
            <AddToCartButton
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              fullWidth
              disabled={isInCart}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </AddToCartButton>
          </>
        )}
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;
