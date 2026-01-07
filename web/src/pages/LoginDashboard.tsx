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
} from '@mui/material';
import { mt5Service } from '../services/api';
import Layout from '../components/Layout';

const LoginDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    server: 'MetaQuotes-Demo',
  });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await mt5Service.getStatus();
      setConnected(response.data.connected);
      if (response.data.connected) {
        fetchAccountInfo();
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

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await mt5Service.initialize();
      const loginData = formData.login 
        ? {
            login: parseInt(formData.login),
            password: formData.password,
            server: formData.server,
          }
        : {};
      
      await mt5Service.login(
        loginData.login,
        loginData.password,
        loginData.server
      );
      
      setSuccess('Successfully connected to MT5');
      setConnected(true);
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
              
              {!connected ? (
                <Box component="form" noValidate sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Login (optional - uses .env if empty)"
                    margin="normal"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Server"
                    margin="normal"
                    value={formData.server}
                    onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Connect to MT5'}
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
    </Layout>
  );
};

export default LoginDashboard;
