import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const SharedWishlist = () => {
  const { token } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        const res = await api.get(`/Wishlist/Public/${token}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Wishlist not found or invalid link.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedWishlist();
  }, [token]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box maxWidth="600px" mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Shared Wishlist
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ borderRadius: "16px" }}>
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl || "/assets/default.png"}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SharedWishlist;
