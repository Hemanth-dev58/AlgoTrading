import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { mt5Service } from '../services/api';

type LoginDashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginDashboard'
>;

type Props = {
  navigation: LoginDashboardScreenNavigationProp;
};

const LoginDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
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
    try {
      await mt5Service.initialize();
      const loginData = formData.login
        ? {
            login: parseInt(formData.login),
            password: formData.password,
            server: formData.server,
          }
        : {};

      await mt5Service.login(loginData.login, loginData.password, loginData.server);

      Alert.alert('Success', 'Connected to MT5');
      setConnected(true);
      await fetchAccountInfo();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to connect to MT5');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await mt5Service.shutdown();
      Alert.alert('Success', 'Disconnected from MT5');
      setConnected(false);
      setAccountInfo(null);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to disconnect');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MT5 Connection</Text>
        {!connected ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Login (optional)"
              value={formData.login}
              onChangeText={(text) => setFormData({ ...formData, login: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Server"
              value={formData.server}
              onChangeText={(text) => setFormData({ ...formData, server: text })}
            />
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Connect to MT5</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.successBox}>
              <Text style={styles.successText}>Connected to MT5</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleDisconnect}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {accountInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Account</Text>
            <Text style={styles.infoValue}>{accountInfo.login}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.infoCard, styles.halfCard]}>
              <Text style={styles.infoLabel}>Balance</Text>
              <Text style={styles.infoValue}>${accountInfo.balance?.toFixed(2)}</Text>
            </View>
            <View style={[styles.infoCard, styles.halfCard]}>
              <Text style={styles.infoLabel}>Equity</Text>
              <Text style={styles.infoValue}>${accountInfo.equity?.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.infoCard, styles.halfCard]}>
              <Text style={styles.infoLabel}>Profit</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: accountInfo.profit >= 0 ? '#4caf50' : '#f44336' },
                ]}
              >
                ${accountInfo.profit?.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.infoCard, styles.halfCard]}>
              <Text style={styles.infoLabel}>Margin Level</Text>
              <Text style={styles.infoValue}>{accountInfo.margin_level?.toFixed(2)}%</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('TradingControl')}
        >
          <Text style={styles.buttonText}>Trading Control</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('ChartIndicators')}
        >
          <Text style={styles.buttonText}>Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('AdvancedIndicators')}
        >
          <Text style={styles.buttonText}>Indicators</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('LogsHistory')}
        >
          <Text style={styles.buttonText}>Logs & History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  secondaryButton: {
    backgroundColor: '#1976d2',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  successText: {
    color: '#4caf50',
    fontSize: 16,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
  },
});

export default LoginDashboardScreen;
