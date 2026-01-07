import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { mt5Service } from '../services/api';

const ChartIndicatorsScreen: React.FC = () => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('16385');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const response = await mt5Service.getRates(symbol, parseInt(timeframe), 0, 50);
      
      const prices = response.data.rates.map((rate: any) => rate.close);
      const labels = response.data.rates.map((_: any, index: number) => 
        index % 10 === 0 ? index.toString() : ''
      );

      setChartData({
        labels,
        datasets: [
          {
            data: prices,
            color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });

      Alert.alert('Success', 'Chart data loaded');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chart Controls</Text>

        <Text style={styles.label}>Symbol</Text>
        <TextInput
          style={styles.input}
          value={symbol}
          onChangeText={setSymbol}
        />

        <Text style={styles.label}>Timeframe</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={timeframe}
            onValueChange={(value) => setTimeframe(value)}
          >
            <Picker.Item label="M1" value="1" />
            <Picker.Item label="M5" value="5" />
            <Picker.Item label="M15" value="15" />
            <Picker.Item label="M30" value="30" />
            <Picker.Item label="H1" value="16385" />
            <Picker.Item label="H4" value="16388" />
            <Picker.Item label="D1" value="16408" />
            <Picker.Item label="W1" value="32769" />
            <Picker.Item label="MN1" value="49153" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={loadChartData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Load Chart'}
          </Text>
        </TouchableOpacity>
      </View>

      {chartData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{symbol} Chart</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#1976d2',
              backgroundGradientFrom: '#1976d2',
              backgroundGradientTo: '#1565c0',
              decimalPlaces: 5,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '0',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicators</Text>
        <Text style={styles.infoText}>
          Available indicators: SMA, EMA, RSI, MACD, Bollinger Bands
        </Text>
        <Text style={styles.infoText}>
          Use Advanced Indicators screen to configure and apply.
        </Text>
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
  button: {
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 15,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoText: {
    color: '#666',
    marginBottom: 5,
  },
});

export default ChartIndicatorsScreen;
