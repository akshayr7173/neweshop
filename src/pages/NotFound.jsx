import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" gutterBottom>404 - Page Not Found</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>Go Home</Button>
    </Box>
  );
};

export default NotFound;
