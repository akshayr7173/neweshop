import React, { useContext, useState } from "react";
import { TextField, Paper, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProductSearchContext } from "../contexts/ProductSearchContext";
import Fuse from "fuse.js";

const SearchBar = () => {
  const { allProducts } = useContext(ProductSearchContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const fuse = new Fuse(allProducts, {
    keys: ["name", "category", "description"],
    threshold: 0.4
  });

  const handleChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (text.length > 1) {
      const matches = fuse.search(text).map(result => result.item);
      setResults(matches.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <TextField
        value={query}
        onChange={handleChange}
        label="Search Products"
        fullWidth
        size="small"
      />
      {results.length > 0 && (
        <Paper style={{ position: "absolute", top: 40, zIndex: 10, width: "100%" }}>
          <List>
            {results.map(product => (
              <ListItem button key={product.id} onClick={() => handleSelect(product.id)}>
                <ListItemText primary={product.name} secondary={`₹${product.price}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;
