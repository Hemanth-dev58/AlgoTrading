import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginDashboard from './pages/LoginDashboard';
import TradingControl from './pages/TradingControl';
import ChartIndicators from './pages/ChartIndicators';
import AdvancedIndicators from './pages/AdvancedIndicators';
import LogsHistory from './pages/LogsHistory';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginDashboard />} />
          <Route path="/trading" element={<TradingControl />} />
          <Route path="/charts" element={<ChartIndicators />} />
          <Route path="/indicators" element={<AdvancedIndicators />} />
          <Route path="/logs" element={<LogsHistory />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
