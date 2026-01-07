import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { mt5Service } from '../services/api';
import Layout from '../components/Layout';

const DEMO_SERVER = 'MetaQuotes-Demo';
const REAL_SERVER = 'XMGlobal-Real 9';
const LOGIN_INFO_MESSAGE =
  'No separate database is needed for this login popup. Run the FastAPI backend and this web app (mobile app is optional). Credentials are kept in your browser when "Save credentials" is checked.';
// Preserve custom server entries; otherwise use defaults that match the selected account type.
const getServerForType = (server: string, type: 'demo' | 'real') =>
  server && server !== DEMO_SERVER && server !== REAL_SERVER
    ? server
    : type === 'demo'
      ? DEMO_SERVER
      : REAL_SERVER;
const parseLoginId = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const LoginDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo');
  const [showPassword, setShowPassword] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [persistPassword, setPersistPassword] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    server: DEMO_SERVER,
  });

  useEffect(() => {
    const savedCredentials = localStorage.getItem('mt5Credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        const rawLogin = parsed.login;
        const loadedLogin =
          rawLogin === undefined || rawLogin === null ? null : parseLoginId(String(rawLogin));
        const safeLogin = loadedLogin ? String(loadedLogin) : '';
        const safeServer =
          typeof parsed.server === 'string' && parsed.server.trim() ? parsed.server : DEMO_SERVER;
        const safePassword = typeof parsed.password === 'string' ? parsed.password : '';
        setFormData({
          login: safeLogin,
          password: parsed.persistPassword ? safePassword : '',
          server: safeServer,
        });
        setAccountType(parsed.accountType || 'demo');
        setSaveCredentials(true);
        setPersistPassword(Boolean(parsed.persistPassword));
      } catch (err) {
        console.error('Failed to parse saved credentials:', err);
        localStorage.removeItem('mt5Credentials');
      }
    }
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await mt5Service.getStatus();
      setConnected(response.data.connected);
      if (response.data.connected) {
        fetchAccountInfo();
        setLoginDialogOpen(false);
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  };

  const fetchAccountInfo = async () => {
    try {
      const response = await mt5Service.getAccountInfo();
      setAccountInfo(response.data);
    } catch (err) {
      console.error('Failed to fetch account info:', err);
    }
  };

  const handleAccountTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: 'demo' | 'real' | null
  ) => {
    if (!value) return;
    setAccountType(value);
    setFormData((prev) => ({
      ...prev,
      server: getServerForType(prev.server, value),
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const parsedLogin = parseLoginId(formData.login);
    if (formData.login.trim().length > 0 && parsedLogin === null) {
      setError('Login ID must be a positive integer');
      setLoading(false);
      return;
    }
    const serverValue = getServerForType(formData.server, accountType);
    const passwordValue = formData.password.trim();
    const loginValueToStore = parsedLogin;
    
    try {
      await mt5Service.initialize();
      const loginData = {
        login: loginValueToStore ?? undefined,
        password: passwordValue || undefined,
        server: serverValue,
      };
      
      await mt5Service.login(
        loginData.login,
        loginData.password,
        loginData.server
      );
      if (saveCredentials) {
        const payload = {
          login: loginValueToStore,
          password: persistPassword ? passwordValue : undefined,
          server: serverValue,
          accountType,
          persistPassword,
        };
        localStorage.setItem('mt5Credentials', JSON.stringify(payload));
      } else {
        localStorage.removeItem('mt5Credentials');
      }
      
      setSuccess('Successfully connected to MT5');
      setConnected(true);
      setLoginDialogOpen(false);
      await fetchAccountInfo();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to connect to MT5');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await mt5Service.shutdown();
      setSuccess('Disconnected from MT5');
      setConnected(false);
      setAccountInfo(null);
      setLoginDialogOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to disconnect');
    }
  };

  return (
    <Layout title="Login & Dashboard">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Login Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                MetaTrader 5 Connection
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Alert severity="info" sx={{ mb: 2 }}>
                {LOGIN_INFO_MESSAGE}
              </Alert>
              
              {!connected ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Use the popup to choose Demo or Real, paste your server (e.g. MetaQuotes-Demo or XMGlobal-Real 9), and enter your login/password.
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setLoginDialogOpen(true)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Open Login Popup'}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Connected to MT5
                  </Alert>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => setLoginDialogOpen(true)}
                  >
                    Change Account
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Account Info Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Account Information
              </Typography>
              
              {accountInfo ? (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Account
                        </Typography>
                        <Typography variant="h6">
                          {accountInfo.login}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Balance
                        </Typography>
                        <Typography variant="h6">
                          ${accountInfo.balance?.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Equity
                        </Typography>
                        <Typography variant="h6">
                          ${accountInfo.equity?.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Profit
                        </Typography>
                        <Typography 
                          variant="h6"
                          color={accountInfo.profit >= 0 ? 'success.main' : 'error.main'}
                        >
                          ${accountInfo.profit?.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Margin Level
                        </Typography>
                        <Typography variant="h6">
                          {accountInfo.margin_level?.toFixed(2)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Connect to MT5 to view account information
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/trading')}
                  >
                    Trading Control
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/charts')}
                  >
                    Charts
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/indicators')}
                  >
                    Indicators
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/logs')}
                  >
                    Logs & History
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Connect to MetaTrader 5</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Choose Demo or Real, paste your server name (for example "MetaQuotes-Demo" or "XMGlobal-Real 9"), then enter your login ID and password.
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={accountType}
            exclusive
            onChange={handleAccountTypeChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="demo">Demo</ToggleButton>
            <ToggleButton value="real">Real</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            fullWidth
            label="Server"
            placeholder="MetaQuotes-Demo or XMGlobal-Real 9"
            margin="normal"
            value={formData.server}
            onChange={(e) => setFormData({ ...formData, server: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Login ID"
            type="text"
            margin="normal"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            helperText="If left empty, backend .env credentials are used."
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={saveCredentials}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSaveCredentials(checked);
                  if (!checked) {
                    setPersistPassword(false);
                  }
                }}
              />
            }
            label="Save credentials for future logins (stored locally in this browser)"
            sx={{ mt: 1 }}
          />
          {saveCredentials && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={persistPassword}
                  onChange={(e) => setPersistPassword(e.target.checked)}
                />
              }
              label="Also store password on this device (not recommended on shared machines)"
              sx={{ mt: 1, ml: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Connect'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default LoginDashboard;
