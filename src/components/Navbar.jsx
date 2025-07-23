import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Container
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  AccountCircle,
  Search,
  Store,
  Dashboard,
  AdminPanelSettings,
  DarkMode,
  LightMode,
  Home as HomeIcon,
  LocalOffer,
  ShoppingBag
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ProductSearchContext } from "../context/ProductSearchContext";
import Fuse from "fuse.js";
import axios from "axios";
import { toast } from "react-toastify";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
  color: '#1f2937',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: '16px',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  "&:hover": {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  "&:focus-within": {
    backgroundColor: 'white',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  marginLeft: 0,
  width: "100%",
  maxWidth: "500px",
  transition: 'all 0.2s ease',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  padding: '12px 16px',
  width: "100%",
  fontSize: '14px',
  color: '#374151',
  fontWeight: 500,
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    }
  }
}));

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const LogoText = styled(Typography)({
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
  fontSize: '24px',
  letterSpacing: '-0.025em',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px',
  transition: 'all 0.2s ease',
  color: '#374151',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    color: '#3b82f6',
    transform: 'translateY(-2px)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 20px',
  transition: 'all 0.2s ease',
  color: '#374151',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    color: '#3b82f6',
    transform: 'translateY(-2px)',
  }
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: '8px',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  maxHeight: 300,
  overflowY: "auto",
  background: 'white',
  backdropFilter: 'blur(20px)',
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px',
  transition: 'all 0.2s ease',
  color: '#374151',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    color: '#3b82f6',
    transform: 'rotate(180deg)',
  }
}));

const LoginButton = styled(Button)({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  color: 'white',
  fontSize: '14px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }
});
const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const handleBecomeSeller = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://localhost:7040/api/User/BecomeSeller", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("You are now a seller!");
      handleMenuClose();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to become a seller.");
    }
  };

  const isCustomer = user?.role === "Customer";
  const isSeller = user?.role === "Seller";
  const isAdmin = user?.role === "Admin";

  const { allProducts } = React.useContext(ProductSearchContext);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);

  const fuse = new Fuse(allProducts, {
    keys: ["name", "title", "category", "description"],
    threshold: 0.4,
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const matched = fuse.search(value).map((res) => res.item);
      setResults(matched.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setResults([]);
  };

  const getRoleChip = () => {
    if (isAdmin) return <Chip label="Admin" size="small" sx={{ ml: 1, bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 600 }} />;
    if (isSeller) return <Chip label="Seller" size="small" sx={{ ml: 1, bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }} />;
    return null;
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: '80px !important',
          px: 0
        }}>
          <LogoSection onClick={() => navigate("/")}>
            <ShoppingBag sx={{ fontSize: '32px', color: '#3b82f6' }} />
            <LogoText variant="h5">MyShop</LogoText>
          </LogoSection>

          <Box sx={{ position: "relative", flex: 1, maxWidth: "500px", mx: 4 }}>
            <SearchWrapper>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                <Search sx={{ color: '#9ca3af', mr: 1.5, fontSize: '20px' }} />
                <SearchInput
                  placeholder="Search for products, brands and more..."
                  value={query}
                  onChange={handleSearchChange}
                />
              </Box>
            </SearchWrapper>
            {results.length > 0 && (
              <SearchResults elevation={0}>
                <List dense sx={{ py: 1 }}>
                  {results.map((product) => (
                    <ListItem
                      button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      sx={{ 
                        py: 2, 
                        px: 3,
                        borderRadius: '12px',
                        mx: 1,
                        mb: 0.5,
                        '&:hover': { 
                          backgroundColor: 'rgba(59, 130, 246, 0.04)',
                          transform: 'translateX(4px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ListItemText
                        primary={product.name || product.title}
                        secondary={`₹${product.price} • ${product.category}`}
                        primaryTypographyProps={{ 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#374151'
                        }}
                        secondaryTypographyProps={{ 
                          fontSize: '12px', 
                          color: '#9ca3af',
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </SearchResults>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeToggle onClick={toggleDarkMode}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </ThemeToggle>

            <StyledButton 
              onClick={() => navigate("/")} 
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              Home
            </StyledButton>

            {isSeller && (
              <StyledButton
                startIcon={<Store />}
                onClick={() => navigate("/seller/dashboard")}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                Dashboard
              </StyledButton>
            )}

            {isAdmin && (
              <StyledButton
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate("/admin")}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                Admin
              </StyledButton>
            )}

            {user ? (
              <>
                {isCustomer && (
                  <>
                    <StyledIconButton onClick={() => navigate("/wishlist")}>
                      <Badge 
                        badgeContent={0} 
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 600
                          }
                        }}
                      >
                        <Favorite />
                      </Badge>
                    </StyledIconButton>

                    <StyledIconButton onClick={() => navigate("/cart")}>
                      <Badge 
                        badgeContent={0} 
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 600
                          }
                        }}
                      >
                        <ShoppingCart />
                      </Badge>
                    </StyledIconButton>
                  </>
                )}

                <StyledIconButton onClick={handleMenuOpen}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </StyledIconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      mt: 1,
                      minWidth: 240,
                      overflow: 'hidden'
                    }
                  }}
                >
                  <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6', bgcolor: '#f9fafb' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>
                      {user.name}
                      {getRoleChip()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '13px' }}>
                      {user.email}
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate("/home"); handleMenuClose(); }}
                      sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                    >
                      <HomeIcon sx={{ mr: 2, color: '#6b7280' }} />
                      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                        View Website
                      </Typography>
                    </MenuItem>
                  )}

                  {!isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate("/profile"); handleMenuClose(); }}
                      sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                    >
                      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                        Edit Profile
                      </Typography>
                    </MenuItem>
                  )}

                  {isCustomer && (
                    <>
                      <MenuItem 
                        onClick={() => { navigate("/orders"); handleMenuClose(); }}
                        sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                      >
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                          My Orders
                        </Typography>
                      </MenuItem>

                      <MenuItem 
                        onClick={() => { navigate("/coupons"); handleMenuClose(); }}
                        sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                      >
                        <LocalOffer sx={{ mr: 2, color: '#6b7280' }} />
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                          My Coupons
                        </Typography>
                      </MenuItem>

                      <MenuItem 
                        component={Link} 
                        to="/become-seller"
                        sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                      >
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                          Become a Seller
                        </Typography>
                      </MenuItem>

                      <MenuItem 
                        onClick={() => { navigate("/wishlist"); handleMenuClose(); }}
                        sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: '#f3f4f6' } }}
                      >
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                          Wishlist
                        </Typography>
                      </MenuItem>
                    </>
                  )}

                  <MenuItem 
                    onClick={handleLogout} 
                    sx={{ 
                      py: 1.5, 
                      px: 3, 
                      color: '#dc2626',
                      borderTop: '1px solid #f3f4f6',
                      '&:hover': { bgcolor: '#fef2f2' }
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <LoginButton onClick={() => navigate("/login")}>
                Sign In
              </LoginButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;