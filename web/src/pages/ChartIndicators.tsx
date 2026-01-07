import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { mt5Service } from '../services/api';
import Layout from '../components/Layout';

const ChartIndicators: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const [symbol, setSymbol] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('16385'); // H1
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#1e1e1e' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2e2e2e' },
          horzLines: { color: '#2e2e2e' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Handle resize
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, []);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const response = await mt5Service.getRates(
        symbol,
        parseInt(timeframe),
        0,
        1000
      );
      
      const data = response.data.rates.map((rate: any) => ({
        time: new Date(rate.time).getTime() / 1000,
        open: rate.open,
        high: rate.high,
        low: rate.low,
        close: rate.close,
      }));

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(data);
      }

      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  return (
    <Layout title="Charts & Indicators">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Chart Controls */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      label="Timeframe"
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <MenuItem value="1">M1</MenuItem>
                      <MenuItem value="5">M5</MenuItem>
                      <MenuItem value="15">M15</MenuItem>
                      <MenuItem value="30">M30</MenuItem>
                      <MenuItem value="16385">H1</MenuItem>
                      <MenuItem value="16388">H4</MenuItem>
                      <MenuItem value="16408">D1</MenuItem>
                      <MenuItem value="32769">W1</MenuItem>
                      <MenuItem value="49153">MN1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={loadChartData}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load Chart'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {symbol} - {timeframe}
              </Typography>
              <div ref={chartContainerRef} style={{ position: 'relative' }} />
            </Paper>
          </Grid>

          {/* Indicators Panel */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Indicators
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Available indicators: SMA, EMA, RSI, MACD, Bollinger Bands
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Use the controls above to add indicators to your chart.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ChartIndicators;
