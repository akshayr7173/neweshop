import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, 
  CircularProgress, Paper, Chip, IconButton, Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Add, 
  Delete, 
  Edit, 
  Visibility,
  TrendingUp,
  Inventory,
  ShoppingCart
} from "@mui/icons-material";
import api from "../api/axios";

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1400px',
  margin: '0 auto',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  }
}));

const SellerDashboard = () => {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "", 
    description: "", 
    price: "", 
    imageUrl: "",
    category: "", 
    quantity: ""
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Seller/MyProducts", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Order/SellerOrders", { headers });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch seller orders", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProductUpload = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/Seller/UploadProduct", {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 1
      }, { headers });
      
      setOpenUpload(false);
      setFormData({ title: "", description: "", price: "", imageUrl: "", category: "", quantity: "" });
      setSuccess("Product uploaded successfully!");
      fetchMyProducts();
    } catch (err) {
      console.error("Upload failed", err);
      setError("Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/Seller/DeleteProduct/${id}`, { headers });
      setSuccess("Product deleted successfully!");
      fetchMyProducts();
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete product");
    }
  };

  useEffect(() => {
    if (tab === 0) fetchMyProducts();
    if (tab === 1) fetchSellerOrders();
  }, [tab]);

  const stats = [
    { title: "Total Products", value: products.length, icon: <Inventory />, color: "#0ea5e9" },
    { title: "Total Orders", value: orders.length, icon: <ShoppingCart />, color: "#10b981" },
    { title: "Revenue", value: "₹0", icon: <TrendingUp />, color: "#f59e0b" },
  ];

  return (
    <DashboardContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Seller Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your products and track your sales
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <StatsCard>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: '12px', 
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    mr: 2
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </CardContent>
            </StatsCard>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Tabs 
          value={tab} 
          onChange={(e, val) => setTab(val)} 
          sx={{ 
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }
          }}
        >
          <Tab label="My Products" />
          <Tab label="Orders Received" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {tab === 0 && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Product Inventory ({products.length})
                    </Typography>
                    <GradientButton
                      startIcon={<Add />}
                      onClick={() => setOpenUpload(true)}
                    >
                      Add New Product
                    </GradientButton>
                  </Box>

                  {products.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Inventory sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No products yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start by adding your first product to begin selling
                      </Typography>
                      <GradientButton
                        startIcon={<Add />}
                        onClick={() => setOpenUpload(true)}
                      >
                        Add Your First Product
                      </GradientButton>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <ProductCard>
                            <CardMedia
                              component="img"
                              height="200"
                              image={product.imageUrl || "/assets/default.png"}
                              alt={product.title}
                              sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {product.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {product.description?.substring(0, 100)}...
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                  ₹{product.price}
                                </Typography>
                                <Chip 
                                  label={product.category} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Quantity: {product.quantity || 0}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                sx={{ textTransform: 'none' }}
                              >
                                View
                              </Button>
                              <IconButton
                                color="error"
                                onClick={() => deleteProduct(product.id)}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </CardActions>
                          </ProductCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {tab === 1 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Orders ({orders.length})
                  </Typography>
                  
                  {orders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <ShoppingCart sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No orders yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Orders will appear here when customers purchase your products
                      </Typography>
                    </Box>
                  ) : (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.customerName || "N/A"}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>
                              <Chip 
                                label={order.status} 
                                size="small" 
                                color="success"
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Paper>

      {/* Upload Product Dialog */}
      <Dialog 
        open={openUpload} 
        onClose={() => setOpenUpload(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '20px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Add New Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to add a new product to your inventory
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Product Title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Category"
                name="category"
                fullWidth
                required
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Electronics, Clothing"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Price (₹)"
                name="price"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Quantity"
                name="quantity"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="1"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Image URL"
                name="imageUrl"
                fullWidth
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenUpload(false)}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handleProductUpload}
            disabled={loading}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

export default SellerDashboard;