import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { ProductSearchProvider } from "./context/ProductSearchContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Coupons from "./pages/Coupons";
import ProtectedRoute from "./components/ProtectedRoute";
import SellerDashboard from "./pages/SellerDashboard";
import BecomeSeller from "./pages/BecomeSeller";
import ProductPage from "./pages/ProductPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { Box } from "@mui/material";
import SharedWishlist from "./pages/SharedWishlist";

export default function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <ProductSearchProvider>
          <BrowserRouter>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  {/* ✅ Default redirect based on auth status */}
                  <Route path="/" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} />
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                  {/* ✅ Public Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* ✅ Public Product Details */}
                  <Route path="/product/:id" element={<ProductDetails />} />

                  {/* ✅ Customer Routes */}
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
                  <Route path="/wishlist/shared/:token" element={<ProtectedRoute><SharedWishlist /></ProtectedRoute>} />

                  {/* ✅ Allow ALL logged-in users to access Become Seller */}
                  <Route path="/become-seller" element={<ProtectedRoute><BecomeSeller /></ProtectedRoute>} />

                  {/* ✅ Seller Routes */}
                  <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute role="seller"><ProductPage /></ProtectedRoute>} />

                  {/* ✅ Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

                  {/* ✅ 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <FooterWrapper />
            </Box>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </BrowserRouter>
        </ProductSearchProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

// Component to conditionally render Footer only on Home page
function FooterWrapper() {
  const location = window.location;
  const pathname = location.pathname;
  
  // Show Footer only on Home page
  const shouldShowFooter = pathname === '/home' || pathname === '/';
  
  return shouldShowFooter ? <Footer /> : null;
}