import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [snack, setSnack] = useState({ open: false, message: "" });
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await axios.get(`https://localhost:7040/api/Cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
      const totalPrice = res.data.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setTotal(totalPrice);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const handleConfirm = async () => {
    if (!address) {
      setSnack({ open: true, message: "Address is required!" });
      return;
    }

    try {
      const orderDetails = {
        address,
        paymentMode,
      };

      await axios.post(
        `https://localhost:7040/api/Cart/Checkout/${userId}`,
        orderDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnack({ open: true, message: "Order placed successfully!" });
      setTimeout(() => {
        navigate("/my-orders");
      }, 1500);
    } catch (error) {
      console.error("Checkout failed", error);
      setSnack({ open: true, message: "Checkout failed!" });
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Delivery Address</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button variant="contained" color="success" onClick={handleConfirm}>
                Confirm Order
              </Button>
              <Button variant="outlined" color="error" onClick={() => navigate("/cart")}>
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <Typography>
                  {item.product.title} x {item.quantity} = ₹{item.product.price * item.quantity}
                </Typography>
              </Box>
            ))}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ₹{total}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.message}
      />
    </Box>
  );
};

export default Checkout;
