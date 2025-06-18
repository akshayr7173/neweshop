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
  Switch,
  FormControlLabel
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
  Home as HomeIcon
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
  background: theme.palette.mode === 'dark' 
    ? 'rgba(26, 26, 26, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.08)',
  color: theme.palette.text.primary,
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: '12px',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha('#2d2d2d', 0.8)
    : alpha('#f8fafc', 0.8),
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha('#3d3d3d', 0.9)
      : alpha('#f1f5f9', 0.9),
    borderColor: theme.palette.divider,
  },
  "&:focus-within": {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  marginLeft: 0,
  width: "100%",
  maxWidth: "500px",
  transition: 'all 0.2s ease',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  width: "100%",
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    }
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  fontSize: '1.5rem',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px',
  transition: 'all 0.2s ease',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-1px)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  transition: 'all 0.2s ease',
  color: theme.palette.text.primary,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: '4px',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 40px rgba(0, 0, 0, 0.5)'
    : '0 10px 40px rgba(0, 0, 0, 0.1)',
  maxHeight: 300,
  overflowY: "auto",
  background: theme.palette.background.paper,
  backdropFilter: 'blur(20px)',
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px',
  transition: 'all 0.2s ease',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'rotate(180deg)',
  }
}));

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
    if (isAdmin) return <Chip label="Admin" size="small" color="error" sx={{ ml: 1 }} />;
    if (isSeller) return <Chip label="Seller" size="small" color="success" sx={{ ml: 1 }} />;
    return null;
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{
        display: "flex",
        justifyContent: "space-between",
        minHeight: '70px !important',
        px: { xs: 2, md: 3 }
      }}>
        <LogoText onClick={() => navigate("/")}>🛒 MyShop</LogoText>

        <Box sx={{ position: "relative", flex: 1, maxWidth: "500px", mx: 3 }}>
          <SearchWrapper>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
              <Search sx={{ color: 'text.secondary', mr: 1 }} />
              <SearchInput
                placeholder="Search for products, brands and more..."
                value={query}
                onChange={handleSearchChange}
              />
            </Box>
          </SearchWrapper>
          {results.length > 0 && (
            <SearchResults elevation={0}>
              <List dense sx={{ py: 0 }}>
                {results.map((product) => (
                  <ListItem
                    button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    sx={{ py: 1.5, '&:hover': { backgroundColor: alpha('#0ea5e9', 0.04) } }}
                  >
                    <ListItemText
                      primary={product.name || product.title}
                      secondary={`₹${product.price} • ${product.category}`}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.8rem', color: 'text.secondary' }}
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

          <StyledButton onClick={() => navigate("/")} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                    <Badge badgeContent={0} color="error">
                      <Favorite />
                    </Badge>
                  </StyledIconButton>

                  <StyledIconButton onClick={() => navigate("/cart")}>
                    <Badge badgeContent={0} color="primary">
                      <ShoppingCart />
                    </Badge>
                  </StyledIconButton>
                </>
              )}

              <StyledIconButton onClick={handleMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </StyledIconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    mt: 1,
                    minWidth: 200,
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                    {getRoleChip()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

                {isAdmin && (
                  <MenuItem onClick={() => { navigate("/home"); handleMenuClose(); }}>
                    <HomeIcon sx={{ mr: 1 }} />
                    Take a Look at Your MyShop Website
                  </MenuItem>
                )}

                <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                  Edit Profile
                </MenuItem>

                {isCustomer && (
                  <>
                    <MenuItem onClick={() => { navigate("/orders"); handleMenuClose(); }}>
                      My Orders
                    </MenuItem>

                    <MenuItem component={Link} to="/become-seller">
                      Become a Seller
                    </MenuItem>

                    <MenuItem onClick={() => { navigate("/wishlist"); handleMenuClose(); }}>
                      Wishlist
                    </MenuItem>
                  </>
                )}

                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <StyledButton
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284c7, #c026d3)',
                }
              }}
            >
              Login
            </StyledButton>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;