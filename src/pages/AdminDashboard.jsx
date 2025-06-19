import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Dashboard,
  Inventory,
  People,
  Store,
  ShoppingCart,
  CheckCircle,
  Cancel,
  Pending,
  Home as HomeIcon
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1400px',
  margin: '0 auto',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(0, 0, 0, 0.4)'
      : '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const HomeButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  color: 'white',
  padding: '12px 24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
  }
}));

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchAllData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      // Fetch all data for stats
      const [pendingRes, approvedRes, usersRes, ordersRes] = await Promise.all([
        axios.get("https://localhost:7040/api/Product/pending", config),
        axios.get("https://localhost:7040/api/Product/Approved?page=1&pageSize=1000", config),
        axios.get("https://localhost:7040/api/Admin/AllUsers", config),
        axios.get("https://localhost:7040/api/Order", config)
      ]);

      setPendingProducts(pendingRes.data);
      setApprovedProducts(approvedRes.data.products || approvedRes.data);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      switch (tab) {
        case 0: {
          const res = await axios.get("https://localhost:7040/api/Product/pending", config);
          setPendingProducts(res.data);
          break;
        }
        case 1: {
          const res = await axios.get("https://localhost:7040/api/Product/Approved?page=1&pageSize=1000", config);
          setApprovedProducts(res.data.products || res.data);
          break;
        }
        case 2: {
          const res = await axios.get("https://localhost:7040/api/Admin/RejectedProducts", config);
          setRejectedProducts(res.data);
          break;
        }
        case 3: {
          const res = await axios.get("https://localhost:7040/api/Admin/AllUsers", config);
          setUsers(res.data);
          break;
        }
        case 4: {
          const res = await axios.get("https://localhost:7040/api/Admin/AllSellers", config);
          setSellers(res.data);
          break;
        }
        case 5: {
          const res = await axios.get("https://localhost:7040/api/Order", config);
          setOrders(res.data);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(`https://localhost:7040/api/Admin/ApproveProduct/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Product approved successfully!");
      fetchData();
      fetchAllData(); // Refresh stats
    } catch (err) {
      console.error("Error approving product", err);
      setError("Failed to approve product");
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7040/api/Admin/RejectProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Product rejected successfully!");
      fetchData();
      fetchAllData(); // Refresh stats
    } catch (err) {
      console.error("Error rejecting product", err);
      setError("Failed to reject product");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/src/assets/default.png";
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `https://localhost:7040${imageUrl}`;
    }
    
    return `https://localhost:7040/${imageUrl}`;
  };

  const renderTable = (data, title) => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title} ({data.length})
      </Typography>
      {data.length === 0 ? (
        <Typography color="text.secondary">No {title.toLowerCase()} found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(data[0] || {}).map((key) => (
                <TableCell key={key} sx={{ fontWeight: 600 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id || item.userId || item.orderId || index}>
                {Object.values(item).map((val, idx) => (
                  <TableCell key={idx}>{String(val)}</TableCell>
                ))}
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
    </Box>
  );

  const stats = [
    { title: "Pending Products", value: pendingProducts.length, icon: <Pending />, color: "#f59e0b" },
    { title: "Approved Products", value: approvedProducts.length, icon: <CheckCircle />, color: "#10b981" },
    { title: "Total Users", value: users.length, icon: <People />, color: "#0ea5e9" },
    { title: "Total Orders", value: orders.length, icon: <ShoppingCart />, color: "#d946ef" },
  ];

  return (
    <DashboardContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage products, users, and monitor platform activity
          </Typography>
        </Box>
        <HomeButton
          startIcon={<HomeIcon />}
          onClick={() => navigate("/home")}
        >
          Take a Look at Your MyShop Website
        </HomeButton>
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
          <Grid item xs={12} sm={6} md={3} key={index}>
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
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: `1px solid ${(theme) => theme.palette.divider}`,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }
          }}
        >
          <Tab label="Pending Products" />
          <Tab label="Approved Products" />
          <Tab label="Rejected Products" />
          <Tab label="Users" />
          <Tab label="Sellers" />
          <Tab label="Orders" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* TAB 0: Pending Product Approvals */}
              {tab === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Pending Product Approvals ({pendingProducts.length})
                  </Typography>
                  {pendingProducts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Pending sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No pending products
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All products have been reviewed
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {pendingProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <ProductCard>
                            <CardMedia
                              component="img"
                              height="200"
                              image={getImageUrl(product.imageUrl)}
                              alt={product.title || product.name}
                              sx={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = "/src/assets/default.png";
                              }}
                            />
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {product.title || product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Category: {product.category}
                              </Typography>
                              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                ₹{product.price}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {product.description?.substring(0, 100)}...
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                              <Button 
                                color="success" 
                                variant="contained"
                                onClick={() => approveProduct(product.id)}
                                sx={{ borderRadius: '8px' }}
                              >
                                Approve
                              </Button>
                              <Button 
                                color="error" 
                                variant="outlined"
                                onClick={() => rejectProduct(product.id)}
                                sx={{ borderRadius: '8px' }}
                              >
                                Reject
                              </Button>
                            </CardActions>
                          </ProductCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* TAB 1: Approved Products */}
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Approved Products ({approvedProducts.length})
                  </Typography>
                  {approvedProducts.length === 0 ? (
                    <Typography color="text.secondary">No approved products found.</Typography>
                  ) : (
                    <Grid container spacing={3}>
                      {approvedProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <ProductCard>
                            <CardMedia
                              component="img"
                              height="200"
                              image={getImageUrl(product.imageUrl)}
                              alt={product.title || product.name}
                              sx={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = "/src/assets/default.png";
                              }}
                            />
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {product.title || product.name}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                  ₹{product.price}
                                </Typography>
                                <Chip label="Approved" color="success" size="small" />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Category: {product.category}
                              </Typography>
                              {product.quantity !== undefined && (
                                <Typography variant="body2" color="text.secondary">
                                  Stock: {product.quantity}
                                </Typography>
                              )}
                            </CardContent>
                          </ProductCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* TAB 2: Rejected Products */}
              {tab === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Rejected Products ({rejectedProducts.length})
                  </Typography>
                  {rejectedProducts.length === 0 ? (
                    <Typography color="text.secondary">No rejected products found.</Typography>
                  ) : (
                    <Grid container spacing={3}>
                      {rejectedProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <ProductCard>
                            <CardMedia
                              component="img"
                              height="200"
                              image={getImageUrl(product.imageUrl)}
                              alt={product.title || product.name}
                              sx={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = "/src/assets/default.png";
                              }}
                            />
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {product.title || product.name}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                  ₹{product.price}
                                </Typography>
                                <Chip label="Rejected" color="error" size="small" />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Category: {product.category}
                              </Typography>
                            </CardContent>
                          </ProductCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* TAB 3: Users */}
              {tab === 3 && renderTable(users, "Users")}

              {/* TAB 4: Sellers */}
              {tab === 4 && renderTable(sellers, "Sellers")}

              {/* TAB 5: Orders */}
              {tab === 5 && renderTable(orders, "Orders")}
            </>
          )}
        </Box>
      </Paper>
    </DashboardContainer>
  );
};

export default AdminDashboard;