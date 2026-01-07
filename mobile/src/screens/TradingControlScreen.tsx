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
import { Picker } from '@react-native-picker/picker';
import { tradingService } from '../services/api';

const TradingControlScreen: React.FC = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderForm, setOrderForm] = useState({
    symbol: 'EURUSD',
    volume: '0.01',
    orderType: '0',
    price: '',
    sl: '',
    tp: '',
    comment: '',
  });

  useEffect(() => {
    fetchPositions();
  }, []);

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
    try {
      const orderData = {
        action: 1, // TRADE_ACTION_DEAL
        symbol: orderForm.symbol,
        volume: parseFloat(orderForm.volume),
        order_type: parseInt(orderForm.orderType),
        price: orderForm.price ? parseFloat(orderForm.price) : undefined,
        sl: orderForm.sl ? parseFloat(orderForm.sl) : undefined,
        tp: orderForm.tp ? parseFloat(orderForm.tp) : undefined,
        comment: orderForm.comment,
      };

      const response = await tradingService.sendOrder(orderData);
      Alert.alert('Success', `Order sent! Order ID: ${response.data.order}`);
      setTimeout(() => fetchPositions(), 1000);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to send order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Place Order</Text>
        
        <Text style={styles.label}>Symbol</Text>
        <TextInput
          style={styles.input}
          value={orderForm.symbol}
          onChangeText={(text) => setOrderForm({ ...orderForm, symbol: text })}
        />

        <Text style={styles.label}>Volume</Text>
        <TextInput
          style={styles.input}
          value={orderForm.volume}
          onChangeText={(text) => setOrderForm({ ...orderForm, volume: text })}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Order Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={orderForm.orderType}
            onValueChange={(value) => setOrderForm({ ...orderForm, orderType: value })}
          >
            <Picker.Item label="Buy" value="0" />
            <Picker.Item label="Sell" value="1" />
            <Picker.Item label="Buy Limit" value="2" />
            <Picker.Item label="Sell Limit" value="3" />
            <Picker.Item label="Buy Stop" value="4" />
            <Picker.Item label="Sell Stop" value="5" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (optional for market)</Text>
        <TextInput
          style={styles.input}
          value={orderForm.price}
          onChangeText={(text) => setOrderForm({ ...orderForm, price: text })}
          keyboardType="decimal-pad"
          placeholder="Leave empty for market price"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Stop Loss</Text>
            <TextInput
              style={styles.input}
              value={orderForm.sl}
              onChangeText={(text) => setOrderForm({ ...orderForm, sl: text })}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Take Profit</Text>
            <TextInput
              style={styles.input}
              value={orderForm.tp}
              onChangeText={(text) => setOrderForm({ ...orderForm, tp: text })}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.input}
          value={orderForm.comment}
          onChangeText={(text) => setOrderForm({ ...orderForm, comment: text })}
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleSendOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Order</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Open Positions</Text>
          <TouchableOpacity onPress={fetchPositions}>
            <Text style={styles.refreshButton}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {positions.length > 0 ? (
          positions.map((position, index) => (
            <View key={index} style={styles.positionCard}>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Symbol:</Text>
                <Text style={styles.positionValue}>{position.symbol}</Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Type:</Text>
                <Text style={styles.positionValue}>
                  {position.type === 0 ? 'BUY' : 'SELL'}
                </Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Volume:</Text>
                <Text style={styles.positionValue}>{position.volume}</Text>
              </View>
              <View style={styles.positionRow}>
                <Text style={styles.positionLabel}>Profit:</Text>
                <Text
                  style={[
                    styles.positionValue,
                    { color: position.profit >= 0 ? '#4caf50' : '#f44336' },
                  ]}
                >
                  ${position.profit?.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.infoBox}>
            <Text>No open positions</Text>
          </View>
        )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    color: '#1976d2',
    fontSize: 14,
  },
  positionCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  positionLabel: {
    fontSize: 14,
    color: '#666',
  },
  positionValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default TradingControlScreen;
