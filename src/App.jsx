import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductSearchProvider } from "./context/ProductSearchContext";
import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SellerDashboard from "./pages/SellerDashboard";
import BecomeSeller from "./pages/BecomeSeller";
import ProductPage from "./pages/ProductPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <ProductSearchProvider>
        <BrowserRouter>
          <Navbar />
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
        </BrowserRouter>
      </ProductSearchProvider>
    </AuthProvider>
  );
}
