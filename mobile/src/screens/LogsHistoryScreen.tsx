import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { logsService, tradingService } from '../services/api';

const LogsHistoryScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trades' | 'account' | 'deals' | 'system'>('trades');
  const [tradeLogs, setTradeLogs] = useState<any[]>([]);
  const [accountHistory, setAccountHistory] = useState<any[]>([]);
  const [dealHistory, setDealHistory] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [logLevel, setLogLevel] = useState('');

  useEffect(() => {
    fetchTradeLogs();
    fetchAccountHistory();
    fetchDealHistory();
    fetchSystemLogs();
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

  const fetchDealHistory = async () => {
    try {
      const response = await tradingService.getHistory();
      setDealHistory(response.data.deals || []);
    } catch (err) {
      console.error('Failed to fetch deal history:', err);
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

  const renderTradeLog = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <Text style={styles.logTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Symbol:</Text>
        <Text style={styles.logValue}>{item.symbol}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Type:</Text>
        <Text style={styles.logValue}>{item.order_type}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Volume:</Text>
        <Text style={styles.logValue}>{item.volume}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Price:</Text>
        <Text style={styles.logValue}>{item.price?.toFixed(5)}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Status:</Text>
        <Text style={styles.logValue}>{item.status}</Text>
      </View>
    </View>
  );

  const renderAccountHistory = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <Text style={styles.logTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Balance:</Text>
        <Text style={styles.logValue}>${item.balance?.toFixed(2)}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Equity:</Text>
        <Text style={styles.logValue}>${item.equity?.toFixed(2)}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Profit:</Text>
        <Text
          style={[
            styles.logValue,
            { color: item.profit >= 0 ? '#4caf50' : '#f44336' },
          ]}
        >
          ${item.profit?.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderDeal = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Deal ID:</Text>
        <Text style={styles.logValue}>{item.ticket}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Symbol:</Text>
        <Text style={styles.logValue}>{item.symbol}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Type:</Text>
        <Text style={styles.logValue}>{item.type}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Volume:</Text>
        <Text style={styles.logValue}>{item.volume}</Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Profit:</Text>
        <Text
          style={[
            styles.logValue,
            { color: item.profit >= 0 ? '#4caf50' : '#f44336' },
          ]}
        >
          ${item.profit?.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderSystemLog = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <Text style={styles.logTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Level:</Text>
        <Text
          style={[
            styles.logValue,
            {
              color:
                item.level === 'ERROR'
                  ? '#f44336'
                  : item.level === 'WARNING'
                  ? '#ff9800'
                  : '#2196f3',
            },
          ]}
        >
          {item.level}
        </Text>
      </View>
      <View style={styles.logRow}>
        <Text style={styles.logLabel}>Source:</Text>
        <Text style={styles.logValue}>{item.source}</Text>
      </View>
      <Text style={styles.logMessage}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trades' && styles.activeTab]}
          onPress={() => setActiveTab('trades')}
        >
          <Text style={[styles.tabText, activeTab === 'trades' && styles.activeTabText]}>
            Trades
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'account' && styles.activeTab]}
          onPress={() => setActiveTab('account')}
        >
          <Text style={[styles.tabText, activeTab === 'account' && styles.activeTabText]}>
            Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'deals' && styles.activeTab]}
          onPress={() => setActiveTab('deals')}
        >
          <Text style={[styles.tabText, activeTab === 'deals' && styles.activeTabText]}>
            Deals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'system' && styles.activeTab]}
          onPress={() => setActiveTab('system')}
        >
          <Text style={[styles.tabText, activeTab === 'system' && styles.activeTabText]}>
            System
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'trades' && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trade Logs</Text>
            <TouchableOpacity onPress={fetchTradeLogs}>
              <Text style={styles.refreshButton}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={tradeLogs}
            renderItem={renderTradeLog}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No trade logs</Text>}
          />
        </View>
      )}

      {activeTab === 'account' && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Account History</Text>
            <TouchableOpacity onPress={fetchAccountHistory}>
              <Text style={styles.refreshButton}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={accountHistory}
            renderItem={renderAccountHistory}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No account history</Text>}
          />
        </View>
      )}

      {activeTab === 'deals' && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Deal History</Text>
            <TouchableOpacity onPress={fetchDealHistory}>
              <Text style={styles.refreshButton}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={dealHistory}
            renderItem={renderDeal}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No deal history</Text>}
          />
        </View>
      )}

      {activeTab === 'system' && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>System Logs</Text>
            <View style={styles.headerRight}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={logLevel}
                  onValueChange={(value) => {
                    setLogLevel(value);
                    fetchSystemLogs();
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="All" value="" />
                  <Picker.Item label="INFO" value="INFO" />
                  <Picker.Item label="WARNING" value="WARNING" />
                  <Picker.Item label="ERROR" value="ERROR" />
                </Picker>
              </View>
              <TouchableOpacity onPress={fetchSystemLogs}>
                <Text style={styles.refreshButton}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={systemLogs}
            renderItem={renderSystemLog}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No system logs</Text>}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    color: '#1976d2',
    fontSize: 14,
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: 100,
  },
  picker: {
    height: 30,
  },
  logCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  logTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  logLabel: {
    fontSize: 14,
    color: '#666',
  },
  logValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logMessage: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});

export default LogsHistoryScreen;
