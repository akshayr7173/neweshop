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
  Alert,
  Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Email, 
  Lock, 
  Person,
  LocationOn,
  Visibility, 
  VisibilityOff,
  ShoppingBag 
} from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const RegisterContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fdf4ff 100%)',
  padding: theme.spacing(2),
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(20px)',
  background: 'rgba(255, 255, 255, 0.95)',
  width: '100%',
  maxWidth: '500px',
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

const RegisterButton = styled(Button)(({ theme }) => ({
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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/Auth/register", form);
      setSuccess("Registration successful! Please login to continue.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer maxWidth={false}>
      <RegisterPaper elevation={0}>
        <LogoSection>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <ShoppingBag sx={{ fontSize: '2rem', color: '#0ea5e9', mr: 1 }} />
            <LogoText variant="h4">MyShop</LogoText>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Create your account to start shopping
          </Typography>
        </LogoSection>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <StyledTextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <LocationOn sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <RegisterButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </RegisterButton>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link 
              onClick={() => navigate("/login")} 
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
              Sign In
            </Link>
          </Typography>
        </Box>
      </RegisterPaper>
    </RegisterContainer>
  );
}