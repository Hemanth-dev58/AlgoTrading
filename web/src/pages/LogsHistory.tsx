import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { logsService, tradingService } from '../services/api';
import Layout from '../components/Layout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LogsHistory: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tradeLogs, setTradeLogs] = useState<any[]>([]);
  const [accountHistory, setAccountHistory] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [dealHistory, setDealHistory] = useState<any[]>([]);
  const [logLevel, setLogLevel] = useState('');

  useEffect(() => {
    fetchTradeLogs();
    fetchAccountHistory();
    fetchSystemLogs();
    fetchDealHistory();
  }, []);

  const fetchTradeLogs = async () => {
    try {
      const response = await logsService.getTradeLogs();
      setTradeLogs(response.data.logs || []);
    } catch (err) {
      console.error('Failed to fetch trade logs:', err);
    }
  };

  const fetchAccountHistory = async () => {
    try {
      const response = await logsService.getAccountHistory();
      setAccountHistory(response.data.history || []);
    } catch (err) {
      console.error('Failed to fetch account history:', err);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await logsService.getSystemLogs(100, logLevel || undefined);
      setSystemLogs(response.data.logs || []);
    } catch (err) {
      console.error('Failed to fetch system logs:', err);
    }
  };

  const fetchDealHistory = async () => {
    try {
      const response = await tradingService.getHistory();
      setDealHistory(response.data.deals || []);
    } catch (err) {
      console.error('Failed to fetch deal history:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Layout title="Logs & History">
      <Container maxWidth="xl">
        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Trade Logs" />
            <Tab label="Account History" />
            <Tab label="Deal History" />
            <Tab label="System Logs" />
          </Tabs>

          {/* Trade Logs */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Trade Execution Logs</Typography>
              <Button variant="outlined" onClick={fetchTradeLogs}>
                Refresh
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.symbol}</TableCell>
                      <TableCell>{log.order_type}</TableCell>
                      <TableCell>{log.volume}</TableCell>
                      <TableCell>{log.price?.toFixed(5)}</TableCell>
                      <TableCell>{log.status}</TableCell>
                      <TableCell>{log.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Account History */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Account Balance History</Typography>
              <Button variant="outlined" onClick={fetchAccountHistory}>
                Refresh
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Equity</TableCell>
                    <TableCell>Margin</TableCell>
                    <TableCell>Free Margin</TableCell>
                    <TableCell>Profit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                      <TableCell>${record.balance?.toFixed(2)}</TableCell>
                      <TableCell>${record.equity?.toFixed(2)}</TableCell>
                      <TableCell>${record.margin?.toFixed(2)}</TableCell>
                      <TableCell>${record.free_margin?.toFixed(2)}</TableCell>
                      <TableCell
                        sx={{
                          color: record.profit >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        ${record.profit?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Deal History */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Trading History (MT5 Deals)</Typography>
              <Button variant="outlined" onClick={fetchDealHistory}>
                Refresh
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Deal ID</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Profit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dealHistory.map((deal, index) => (
                    <TableRow key={index}>
                      <TableCell>{deal.ticket}</TableCell>
                      <TableCell>{deal.order}</TableCell>
                      <TableCell>{deal.symbol}</TableCell>
                      <TableCell>{deal.type}</TableCell>
                      <TableCell>{deal.volume}</TableCell>
                      <TableCell>{deal.price?.toFixed(5)}</TableCell>
                      <TableCell
                        sx={{
                          color: deal.profit >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        ${deal.profit?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* System Logs */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">System Event Logs</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={logLevel}
                    label="Level"
                    onChange={(e) => {
                      setLogLevel(e.target.value);
                      fetchSystemLogs();
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="INFO">INFO</MenuItem>
                    <MenuItem value="WARNING">WARNING</MenuItem>
                    <MenuItem value="ERROR">ERROR</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" onClick={fetchSystemLogs}>
                  Refresh
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor:
                              log.level === 'ERROR'
                                ? 'error.main'
                                : log.level === 'WARNING'
                                ? 'warning.main'
                                : 'info.main',
                            color: 'white',
                          }}
                        >
                          {log.level}
                        </Box>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </Layout>
  );
};

export default LogsHistory;
