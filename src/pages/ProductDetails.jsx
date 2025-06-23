// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Rating,
  Divider,
  Card,
  Alert,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Bolt,
  LocalShipping,
  Security,
  Verified,
} from "@mui/icons-material";

// --- Styles ---
const ProductContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: theme.spacing(3),
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "500px",
  objectFit: "cover",
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CurrentPrice = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.secondary,
  textDecoration: "line-through",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  fontSize: "1rem",
}));

const BuyNowButton = styled(ActionButton)({
  background: "linear-gradient(135deg, #0ea5e9, #d946ef)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(135deg, #0284c7, #c026d3)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(14, 165, 233, 0.4)",
  },
});

const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  padding: theme.spacing(2),
  textAlign: "center",
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  backgroundColor: "#fafafa",
}));

// --- Component ---
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://localhost:7040/api/Product/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7040/api/Product/${id}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(res.data || []);

      const userId = JSON.parse(atob(token.split(".")[1])).UserId;
      setUserHasReviewed(res.data?.some((r) => r.userId === userId));
    } catch (err) {
      console.error("Error fetching reviews", err);
      setReviews([]);
    }
  };

  const submitReview = async () => {
    if (!newRating || !newComment.trim()) {
      toast.error("Please provide rating and comment");
      return;
    }

    try {
      await axios.post(
        `https://localhost:7040/api/Product/${id}/reviews`,
        {
          rating: newRating,
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review submitted!");
      setNewRating(0);
      setNewComment("");
      fetchReviews();
      setUserHasReviewed(true);
    } catch (err) {
      console.error("Review submit error", err);
      toast.error("Failed to submit review");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/assets/default.png";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    return `https://localhost:7040/${imageUrl.replace(/^\/+/, "")}`;
  };

  const addToCart = async () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (isInCart) {
      toast.info("Product already in cart");
      return;
    }

    try {
      await axios.post(
        `https://localhost:7040/api/Cart/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsInCart(true);
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error", err);
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        await axios.delete(
          `https://localhost:7040/api/Wishlist/Remove/${product.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `https://localhost:7040/api/Wishlist/Add`,
          { productId: product.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist error", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `https://localhost:7040/api/Cart/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now error", err);
      toast.error("Failed to process order");
    }
  };

  if (loading) {
    return (
      <ProductContainer>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </ProductContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductContainer>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error || "Product not found"}
        </Alert>
      </ProductContainer>
    );
  }

  const isOutOfStock = product.quantity === 0;
  const originalPrice = product.price * 1.2;
  const discountPercent = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <ProductContainer>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImage
            src={getImageUrl(product.imageUrl)}
            alt={product.title || product.name}
            onError={(e) => {
              e.target.src = "/assets/default.png";
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={700}>
            {product.title || product.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Rating value={Number(avgRating)} precision={0.1} readOnly />
            <Typography variant="body2">({avgRating}) • {reviews.length} reviews</Typography>
          </Box>

          {product.category && (
            <Chip label={product.category} variant="outlined" sx={{ mt: 2 }} />
          )}

          <PriceBox>
            <CurrentPrice>₹{product.price}</CurrentPrice>
            {discountPercent > 0 && (
              <>
                <OriginalPrice>₹{Math.round(originalPrice)}</OriginalPrice>
                <Chip label={`${discountPercent}% OFF`} color="success" />
              </>
            )}
          </PriceBox>

          {isOutOfStock && (
            <Alert severity="warning">Out of Stock</Alert>
          )}

          <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <BuyNowButton
              startIcon={<Bolt />}
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </BuyNowButton>

            <ActionButton
              variant="outlined"
              startIcon={<ShoppingCart />}
              onClick={addToCart}
              disabled={isOutOfStock || isInCart}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </ActionButton>

            <ActionButton
              variant="outlined"
              startIcon={isWishlisted ? <Favorite /> : <FavoriteBorder />}
              onClick={toggleWishlist}
              color={isWishlisted ? "error" : "primary"}
            >
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </ActionButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FeatureCard>
                <LocalShipping />
                <Typography variant="caption">Free Delivery</Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={4}>
              <FeatureCard>
                <Security />
                <Typography variant="caption">Secure Payment</Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={4}>
              <FeatureCard>
                <Verified />
                <Typography variant="caption">Authentic Product</Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No reviews yet.
        </Typography>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" fontWeight="bold">
                {review.userName || "User"}
              </Typography>
            </Box>
            <Typography variant="body2" mt={1}>
              {review.comment}
            </Typography>
          </ReviewCard>
        ))
      )}

      {/* Add Review */}
      {!userHasReviewed && token && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          <Rating
            value={newRating}
            onChange={(e, newVal) => setNewRating(newVal)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button
            variant="contained"
            onClick={submitReview}
            disabled={!newRating || !newComment.trim()}
          >
            Submit Review
          </Button>
        </Box>
      )}
    </ProductContainer>
  );
};

export default ProductDetails;
