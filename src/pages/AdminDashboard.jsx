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
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      switch (tab) {
        case 0: {
          const res = await axios.get("https://localhost:7040/api/Admin/UnapprovedProducts", config);
          setPendingProducts(res.data);
          break;
        }
        case 1: {
          const res = await axios.get("https://localhost:7040/api/User", config);
          setUsers(res.data);
          break;
        }
        case 2: {
          const res = await axios.get("https://localhost:7040/api/User/Sellers", config);
          setSellers(res.data);
          break;
        }
        case 3: {
          const res = await axios.get("https://localhost:7040/api/Order", config);
          setOrders(res.data);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id) => {
    try {
      await axios.put(`https://localhost:7040/api/Admin/ApproveProduct/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Error approving product", err);
    }
  };

  const rejectProduct = async (id) => {
    try {
      await axios.delete(`https://localhost:7040/api/Admin/RejectProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Error rejecting product", err);
    }
  };

  const renderTable = (data) => (
    <Table>
      <TableHead>
        <TableRow>
          {Object.keys(data[0] || {}).map((key) => (
            <TableCell key={key}>{key}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id || item.userId || item.orderId}>
            {Object.values(item).map((val, idx) => (
              <TableCell key={idx}>{String(val)}</TableCell>
            ))}
            <TableCell>
              <Button size="small" variant="outlined">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Pending Products" />
        <Tab label="Users" />
        <Tab label="Sellers" />
        <Tab label="Orders" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* TAB 0: Pending Product Approvals */}
          {tab === 0 && (
            <Grid container spacing={2}>
              {pendingProducts.length === 0 ? (
                <Typography>No pending products to approve.</Typography>
              ) : (
                pendingProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="150"
                        image={product.imageUrl}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2">{product.category}</Typography>
                        <Typography variant="body2">₹{product.price}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button color="success" onClick={() => approveProduct(product.id)}>
                          Approve
                        </Button>
                        <Button color="error" onClick={() => rejectProduct(product.id)}>
                          Reject
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* TAB 1: Users */}
          {tab === 1 && users.length > 0 ? renderTable(users) : tab === 1 && <Typography>No users found.</Typography>}

          {/* TAB 2: Sellers */}
          {tab === 2 && sellers.length > 0 ? renderTable(sellers) : tab === 2 && <Typography>No sellers found.</Typography>}

          {/* TAB 3: Orders */}
          {tab === 3 && orders.length > 0 ? renderTable(orders) : tab === 3 && <Typography>No orders found.</Typography>}
        </>
      )}
    </Paper>
  );
};

export default AdminDashboard;
