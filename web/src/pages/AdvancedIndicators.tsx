import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Layout from '../components/Layout';

const AdvancedIndicators: React.FC = () => {
  const [smaConfig, setSmaConfig] = useState({
    enabled: false,
    period: 20,
    color: '#2196f3',
  });

  const [emaConfig, setEmaConfig] = useState({
    enabled: false,
    period: 12,
    color: '#ff9800',
  });

  const [rsiConfig, setRsiConfig] = useState({
    enabled: false,
    period: 14,
    overbought: 70,
    oversold: 30,
  });

  const [macdConfig, setMacdConfig] = useState({
    enabled: false,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
  });

  const [bollingerConfig, setBollingerConfig] = useState({
    enabled: false,
    period: 20,
    deviation: 2,
  });

  const applyIndicators = () => {
    console.log('Applying indicators:', {
      sma: smaConfig,
      ema: emaConfig,
      rsi: rsiConfig,
      macd: macdConfig,
      bollinger: bollingerConfig,
    });
    // This would integrate with the chart component
  };

  return (
    <Layout title="Advanced Indicators">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* SMA */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Simple Moving Average (SMA)</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={smaConfig.enabled}
                        onChange={(e) =>
                          setSmaConfig({ ...smaConfig, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable"
                  />
                </Box>
                <Typography gutterBottom>Period: {smaConfig.period}</Typography>
                <Slider
                  value={smaConfig.period}
                  onChange={(_, value) =>
                    setSmaConfig({ ...smaConfig, period: value as number })
                  }
                  min={5}
                  max={200}
                  disabled={!smaConfig.enabled}
                />
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  value={smaConfig.color}
                  onChange={(e) => setSmaConfig({ ...smaConfig, color: e.target.value })}
                  disabled={!smaConfig.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* EMA */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Exponential Moving Average (EMA)</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emaConfig.enabled}
                        onChange={(e) =>
                          setEmaConfig({ ...emaConfig, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable"
                  />
                </Box>
                <Typography gutterBottom>Period: {emaConfig.period}</Typography>
                <Slider
                  value={emaConfig.period}
                  onChange={(_, value) =>
                    setEmaConfig({ ...emaConfig, period: value as number })
                  }
                  min={5}
                  max={200}
                  disabled={!emaConfig.enabled}
                />
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  value={emaConfig.color}
                  onChange={(e) => setEmaConfig({ ...emaConfig, color: e.target.value })}
                  disabled={!emaConfig.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* RSI */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Relative Strength Index (RSI)</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rsiConfig.enabled}
                        onChange={(e) =>
                          setRsiConfig({ ...rsiConfig, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable"
                  />
                </Box>
                <Typography gutterBottom>Period: {rsiConfig.period}</Typography>
                <Slider
                  value={rsiConfig.period}
                  onChange={(_, value) =>
                    setRsiConfig({ ...rsiConfig, period: value as number })
                  }
                  min={5}
                  max={50}
                  disabled={!rsiConfig.enabled}
                />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Overbought"
                      type="number"
                      value={rsiConfig.overbought}
                      onChange={(e) =>
                        setRsiConfig({ ...rsiConfig, overbought: parseInt(e.target.value) })
                      }
                      disabled={!rsiConfig.enabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Oversold"
                      type="number"
                      value={rsiConfig.oversold}
                      onChange={(e) =>
                        setRsiConfig({ ...rsiConfig, oversold: parseInt(e.target.value) })
                      }
                      disabled={!rsiConfig.enabled}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* MACD */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">MACD</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={macdConfig.enabled}
                        onChange={(e) =>
                          setMacdConfig({ ...macdConfig, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Fast Period"
                      type="number"
                      value={macdConfig.fastPeriod}
                      onChange={(e) =>
                        setMacdConfig({ ...macdConfig, fastPeriod: parseInt(e.target.value) })
                      }
                      disabled={!macdConfig.enabled}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Slow Period"
                      type="number"
                      value={macdConfig.slowPeriod}
                      onChange={(e) =>
                        setMacdConfig({ ...macdConfig, slowPeriod: parseInt(e.target.value) })
                      }
                      disabled={!macdConfig.enabled}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Signal Period"
                      type="number"
                      value={macdConfig.signalPeriod}
                      onChange={(e) =>
                        setMacdConfig({ ...macdConfig, signalPeriod: parseInt(e.target.value) })
                      }
                      disabled={!macdConfig.enabled}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Bollinger Bands */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Bollinger Bands</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={bollingerConfig.enabled}
                        onChange={(e) =>
                          setBollingerConfig({ ...bollingerConfig, enabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable"
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Period"
                      type="number"
                      value={bollingerConfig.period}
                      onChange={(e) =>
                        setBollingerConfig({
                          ...bollingerConfig,
                          period: parseInt(e.target.value),
                        })
                      }
                      disabled={!bollingerConfig.enabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Deviation"
                      type="number"
                      value={bollingerConfig.deviation}
                      onChange={(e) =>
                        setBollingerConfig({
                          ...bollingerConfig,
                          deviation: parseInt(e.target.value),
                        })
                      }
                      disabled={!bollingerConfig.enabled}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Apply Button */}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" size="large" onClick={applyIndicators}>
              Apply Indicators to Chart
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AdvancedIndicators;
