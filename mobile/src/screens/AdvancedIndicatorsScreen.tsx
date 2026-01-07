import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

const AdvancedIndicatorsScreen: React.FC = () => {
  const [smaConfig, setSmaConfig] = useState({
    enabled: false,
    period: '20',
  });

  const [emaConfig, setEmaConfig] = useState({
    enabled: false,
    period: '12',
  });

  const [rsiConfig, setRsiConfig] = useState({
    enabled: false,
    period: '14',
    overbought: '70',
    oversold: '30',
  });

  const [macdConfig, setMacdConfig] = useState({
    enabled: false,
    fastPeriod: '12',
    slowPeriod: '26',
    signalPeriod: '9',
  });

  const [bollingerConfig, setBollingerConfig] = useState({
    enabled: false,
    period: '20',
    deviation: '2',
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
    <ScrollView style={styles.container}>
      {/* SMA */}
      <View style={styles.section}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorTitle}>Simple Moving Average (SMA)</Text>
          <Switch
            value={smaConfig.enabled}
            onValueChange={(value) => setSmaConfig({ ...smaConfig, enabled: value })}
          />
        </View>
        <Text style={styles.label}>Period</Text>
        <TextInput
          style={styles.input}
          value={smaConfig.period}
          onChangeText={(text) => setSmaConfig({ ...smaConfig, period: text })}
          keyboardType="numeric"
          editable={smaConfig.enabled}
        />
      </View>

      {/* EMA */}
      <View style={styles.section}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorTitle}>Exponential Moving Average (EMA)</Text>
          <Switch
            value={emaConfig.enabled}
            onValueChange={(value) => setEmaConfig({ ...emaConfig, enabled: value })}
          />
        </View>
        <Text style={styles.label}>Period</Text>
        <TextInput
          style={styles.input}
          value={emaConfig.period}
          onChangeText={(text) => setEmaConfig({ ...emaConfig, period: text })}
          keyboardType="numeric"
          editable={emaConfig.enabled}
        />
      </View>

      {/* RSI */}
      <View style={styles.section}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorTitle}>Relative Strength Index (RSI)</Text>
          <Switch
            value={rsiConfig.enabled}
            onValueChange={(value) => setRsiConfig({ ...rsiConfig, enabled: value })}
          />
        </View>
        <Text style={styles.label}>Period</Text>
        <TextInput
          style={styles.input}
          value={rsiConfig.period}
          onChangeText={(text) => setRsiConfig({ ...rsiConfig, period: text })}
          keyboardType="numeric"
          editable={rsiConfig.enabled}
        />
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Overbought</Text>
            <TextInput
              style={styles.input}
              value={rsiConfig.overbought}
              onChangeText={(text) => setRsiConfig({ ...rsiConfig, overbought: text })}
              keyboardType="numeric"
              editable={rsiConfig.enabled}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Oversold</Text>
            <TextInput
              style={styles.input}
              value={rsiConfig.oversold}
              onChangeText={(text) => setRsiConfig({ ...rsiConfig, oversold: text })}
              keyboardType="numeric"
              editable={rsiConfig.enabled}
            />
          </View>
        </View>
      </View>

      {/* MACD */}
      <View style={styles.section}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorTitle}>MACD</Text>
          <Switch
            value={macdConfig.enabled}
            onValueChange={(value) => setMacdConfig({ ...macdConfig, enabled: value })}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Fast</Text>
            <TextInput
              style={styles.input}
              value={macdConfig.fastPeriod}
              onChangeText={(text) => setMacdConfig({ ...macdConfig, fastPeriod: text })}
              keyboardType="numeric"
              editable={macdConfig.enabled}
            />
          </View>
          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Slow</Text>
            <TextInput
              style={styles.input}
              value={macdConfig.slowPeriod}
              onChangeText={(text) => setMacdConfig({ ...macdConfig, slowPeriod: text })}
              keyboardType="numeric"
              editable={macdConfig.enabled}
            />
          </View>
          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Signal</Text>
            <TextInput
              style={styles.input}
              value={macdConfig.signalPeriod}
              onChangeText={(text) => setMacdConfig({ ...macdConfig, signalPeriod: text })}
              keyboardType="numeric"
              editable={macdConfig.enabled}
            />
          </View>
        </View>
      </View>

      {/* Bollinger Bands */}
      <View style={styles.section}>
        <View style={styles.indicatorHeader}>
          <Text style={styles.indicatorTitle}>Bollinger Bands</Text>
          <Switch
            value={bollingerConfig.enabled}
            onValueChange={(value) => setBollingerConfig({ ...bollingerConfig, enabled: value })}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Period</Text>
            <TextInput
              style={styles.input}
              value={bollingerConfig.period}
              onChangeText={(text) => setBollingerConfig({ ...bollingerConfig, period: text })}
              keyboardType="numeric"
              editable={bollingerConfig.enabled}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Deviation</Text>
            <TextInput
              style={styles.input}
              value={bollingerConfig.deviation}
              onChangeText={(text) => setBollingerConfig({ ...bollingerConfig, deviation: text })}
              keyboardType="numeric"
              editable={bollingerConfig.enabled}
            />
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={applyIndicators}
        >
          <Text style={styles.buttonText}>Apply Indicators to Chart</Text>
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
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  indicatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '31%',
  },
  button: {
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedIndicatorsScreen;
