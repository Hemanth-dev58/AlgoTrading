import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { tradingService } from '../services/api';
import Layout from '../components/Layout';

const TradingControl: React.FC = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [orderTypes, setOrderTypes] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [orderForm, setOrderForm] = useState({
    symbol: 'EURUSD',
    volume: '0.01',
    orderType: '0',
    action: '1',
    price: '',
    sl: '',
    tp: '',
    comment: '',
  });

  useEffect(() => {
    fetchOrderTypes();
    fetchPositions();
  }, []);

  const fetchOrderTypes = async () => {
    try {
      const response = await tradingService.getOrderTypes();
      setOrderTypes(response.data);
    } catch (err) {
      console.error('Failed to fetch order types:', err);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await tradingService.getPositions();
      setPositions(response.data.positions || []);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const handleSendOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const orderData = {
        action: parseInt(orderForm.action),
        symbol: orderForm.symbol,
        volume: parseFloat(orderForm.volume),
        order_type: parseInt(orderForm.orderType),
        price: orderForm.price ? parseFloat(orderForm.price) : undefined,
        sl: orderForm.sl ? parseFloat(orderForm.sl) : undefined,
        tp: orderForm.tp ? parseFloat(orderForm.tp) : undefined,
        comment: orderForm.comment,
      };
      
      const response = await tradingService.sendOrder(orderData);
      setSuccess(`Order sent successfully! Order ID: ${response.data.order}`);
      
      // Refresh positions
      setTimeout(() => fetchPositions(), 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Trading Control">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Order Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Place Order
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Symbol"
                  margin="normal"
                  value={orderForm.symbol}
                  onChange={(e) => setOrderForm({ ...orderForm, symbol: e.target.value })}
                />
                
                <TextField
                  fullWidth
                  label="Volume"
                  type="number"
                  margin="normal"
                  value={orderForm.volume}
                  onChange={(e) => setOrderForm({ ...orderForm, volume: e.target.value })}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    value={orderForm.orderType}
                    label="Order Type"
                    onChange={(e) => setOrderForm({ ...orderForm, orderType: e.target.value })}
                  >
                    <MenuItem value="0">Buy</MenuItem>
                    <MenuItem value="1">Sell</MenuItem>
                    <MenuItem value="2">Buy Limit</MenuItem>
                    <MenuItem value="3">Sell Limit</MenuItem>
                    <MenuItem value="4">Buy Stop</MenuItem>
                    <MenuItem value="5">Sell Stop</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Price (optional for market orders)"
                  type="number"
                  margin="normal"
                  value={orderForm.price}
                  onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Stop Loss (optional)"
                      type="number"
                      margin="normal"
                      value={orderForm.sl}
                      onChange={(e) => setOrderForm({ ...orderForm, sl: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Take Profit (optional)"
                      type="number"
                      margin="normal"
                      value={orderForm.tp}
                      onChange={(e) => setOrderForm({ ...orderForm, tp: e.target.value })}
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Comment"
                  margin="normal"
                  value={orderForm.comment}
                  onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSendOrder}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Sending...' : 'Send Order'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Open Positions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Open Positions
              </Typography>
              
              <Button
                variant="outlined"
                onClick={fetchPositions}
                sx={{ mb: 2 }}
              >
                Refresh
              </Button>
              
              {positions.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Volume</TableCell>
                        <TableCell>Profit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {positions.map((position, index) => (
                        <TableRow key={index}>
                          <TableCell>{position.symbol}</TableCell>
                          <TableCell>{position.type === 0 ? 'BUY' : 'SELL'}</TableCell>
                          <TableCell>{position.volume}</TableCell>
                          <TableCell
                            sx={{
                              color: position.profit >= 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            ${position.profit?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No open positions</Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default TradingControl;
