import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BoltIcon from "@mui/icons-material/Bolt";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://localhost:7040/api/Product/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(`https://localhost:7040/api/Cart/Add`, {
        userId,
        productId: product.id,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart error", err);
      alert("Failed to add to cart.");
    }
  };

  const addToWishlist = async () => {
    try {
      await axios.post(
        `https://localhost:7040/api/Wishlist/Add`,
        { userId, productId: product.id },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist error", err);
      alert("Failed to add to wishlist.");
    }
  };

  const handleBuyNow = async () => {
    await addToCart();
    navigate("/cart");
  };

  if (loading) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <img
            src={product.imageUrl || "/assets/default.png"}
            alt={product.title}
            width="100%"
            style={{ borderRadius: 10, objectFit: "contain" }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h4">{product.title}</Typography>
          <Typography variant="h6" color="primary" sx={{ my: 1 }}>
            ₹ {product.price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>

          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<BoltIcon />}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              startIcon={<FavoriteBorderIcon />}
              onClick={addToWishlist}
            >
              Wishlist
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductDetails;
