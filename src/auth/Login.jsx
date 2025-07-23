import { useState } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  ShoppingBag 
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import GoogleSignInButton from "../components/GoogleSignInButton";

const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f0f9ff 100%)',
  padding: '2rem',
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: '3rem',
  borderRadius: '32px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  background: 'white',
  width: '100%',
  maxWidth: '480px',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '2.5rem',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
  fontSize: '2.5rem',
  marginBottom: '0.5rem',
  letterSpacing: '-0.025em',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: '#f3f4f6',
      borderColor: '#d1d5db',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 500,
  },
  '& .MuiInputBase-input': {
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: 500,
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 700,
  padding: '16px 32px',
  fontSize: '16px',
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    transform: 'translateY(-1px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
}));

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/Auth/login", form);
      login(res.data, res.data.token); 
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer maxWidth={false}>
      <LoginPaper elevation={0}>
        <LogoSection>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <ShoppingBag sx={{ fontSize: '3rem', color: '#3b82f6', mr: 1.5 }} />
            <LogoText>MyShop</LogoText>
          </Box>
          <Typography variant="h6" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '18px' }}>
            Welcome back! Please sign in to your account
          </Typography>
        </LogoSection>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '16px', fontSize: '14px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#9ca3af', fontSize: '20px' }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#9ca3af', fontSize: '20px' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoginButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </LoginButton>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <GoogleSignInButton variant="signin" />
        </Box>

        <Divider sx={{ my: 4 }}>
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '14px' }}>
            or continue with email
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '15px' }}>
            Don't have an account?{" "}
            <Link 
              onClick={() => navigate("/register")} 
              sx={{ 
                cursor: "pointer",
                color: '#3b82f6',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '15px',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
}