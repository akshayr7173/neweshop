// src/pages/BecomeSeller.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    shopName: "",
    shopAddress: "",
    gstNumber: "",
    bankAccount: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user data
    axios
      .get(`https://localhost:7040/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        alert("User data not loaded yet.");
        return;
      }

      const updatedUser = {
        ...user,
        role: "Seller",
        shopName: form.shopName,
        shopAddress: form.shopAddress,
        gstNumber: form.gstNumber,
        bankAccount: form.bankAccount,
      };

      await axios.put(`https://localhost:7040/api/User/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("🎉 Congratulations! You are now a seller.");
      navigate("/seller");
    } catch (error) {
      console.error("Failed to become seller", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Become a Seller
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Shop Name"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Shop Address"
              name="shopAddress"
              value={form.shopAddress}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="GST Number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bank Account Number"
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={() => navigate("/profile")}>
            Back to Profile
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Register as Seller
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BecomeSeller;
