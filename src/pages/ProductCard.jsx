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
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.4)"
        : "0 20px 40px rgba(0, 0, 0, 0.12)",
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
  height: 200,
  objectFit: "cover",
  transition: "transform 0.3s ease",
  cursor: "pointer",
});

const QuickActions = styled(Box)({
  position: "absolute",
  top: 12,
  right: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  opacity: 0,
  transform: "translateY(-10px)",
  transition: "all 0.3s ease",
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  width: 40,
  height: 40,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(26, 26, 26, 1)"
        : "rgba(255, 255, 255, 1)",
    transform: "scale(1.1)",
  },
}));

const PriceBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
});

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  textDecoration: "line-through",
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: "white",
  fontSize: "0.75rem",
  height: 24,
  fontWeight: 600,
}));

const OutOfStockChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: "white",
  fontSize: "0.75rem",
  height: 24,
  fontWeight: 600,
}));

const BuyButton = styled(Button)({
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  padding: "10px 20px",
  background: "linear-gradient(135deg, #0ea5e9, #d946ef)",
  "&:hover": {
    background: "linear-gradient(135deg, #0284c7, #c026d3)",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
  },
  "&:disabled": {
    background: "#e5e7eb",
    color: "#9ca3af",
    transform: "none",
    boxShadow: "none",
  },
});

const AddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 500,
  padding: "10px 20px",
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(14, 165, 233, 0.3)",
  },
  "&:disabled": {
    borderColor: "#e5e7eb",
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

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
            cursor: "pointer",
            color: "text.primary",
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.title || product.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={4.2} precision={0.1} size="small" readOnly />
          <Typography
            variant="caption"
            sx={{ ml: 1, color: "text.secondary" }}
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
              sx={{ fontSize: "0.75rem" }}
            />
          )}
          {product.quantity !== undefined && (
            <Typography variant="caption" color="text.secondary">
              Stock: {product.quantity}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        {isOutOfStock ? (
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            onClick={handleWishlistToggle}
            fullWidth
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 500 }}
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
