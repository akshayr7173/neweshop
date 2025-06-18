import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
} from "@mui/material";
import axios from "axios";
import Order from "./Order";

const ORDERS_PER_PAGE = 4;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`https://localhost:7040/api/Order/my`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => setPage(value);

  const paginatedOrders = orders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  if (loading) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedOrders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Order order={order} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={Math.ceil(orders.length / ORDERS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default MyOrders;
