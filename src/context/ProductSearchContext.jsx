import React, { createContext, useEffect, useState } from "react";
import api from "../api/axios"; // ✅ Use centralized axios instance

export const ProductSearchContext = createContext();

export const ProductSearchProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    api.get("/Product/Approved?page=1&pageSize=1000") // ✅ No need to repeat full base URL
      .then(res => {
        setAllProducts(res.data.products || []);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setAllProducts([]); // Optional fallback
      });
  }, []);

  return (
    <ProductSearchContext.Provider value={{ allProducts }}>
      {children}
    </ProductSearchContext.Provider>
  );
};
