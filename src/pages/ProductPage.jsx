import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import axios from "axios";
import ProductCard from "./ProductCard";
import Fuse from "fuse.js";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const pageSize = 6;

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = `http://localhost:5000/api/Product/Approved`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      const res = await axios.get(url);
      setProducts(res.data.products);
      setTotalProducts(res.data.total);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/Product/Categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const fuse = new Fuse(products, {
    keys: ["title", "description"],
    threshold: 0.4,
  });

  const filteredProducts = searchText
    ? fuse.search(searchText).map((r) => r.item)
    : products;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={3}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Filter by Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(totalProducts / pageSize)}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      </Box>
    </Box>
  );
};

export default ProductPage;
