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

const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fdf4ff 100%)',
  padding: theme.spacing(2),
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(20px)',
  background: 'rgba(255, 255, 255, 0.95)',
  width: '100%',
  maxWidth: '400px',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      }
    }
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
  background: 'linear-gradient(135deg, #0ea5e9, #d946ef)',
  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0284c7, #c026d3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <ShoppingBag sx={{ fontSize: '2rem', color: '#0ea5e9', mr: 1 }} />
            <LogoText variant="h4">MyShop</LogoText>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Please sign in to your account
          </Typography>
        </LogoSection>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                    <Email sx={{ color: 'text.secondary' }} />
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
                    <Lock sx={{ color: 'text.secondary' }} />
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
              sx={{ mt: 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </LoginButton>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link 
              onClick={() => navigate("/register")} 
              sx={{ 
                cursor: "pointer",
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
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