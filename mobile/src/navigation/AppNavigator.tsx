import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginDashboardScreen from '../screens/LoginDashboardScreen';
import TradingControlScreen from '../screens/TradingControlScreen';
import ChartIndicatorsScreen from '../screens/ChartIndicatorsScreen';
import AdvancedIndicatorsScreen from '../screens/AdvancedIndicatorsScreen';
import LogsHistoryScreen from '../screens/LogsHistoryScreen';

export type RootStackParamList = {
  LoginDashboard: undefined;
  TradingControl: undefined;
  ChartIndicators: undefined;
  AdvancedIndicators: undefined;
  LogsHistory: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginDashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976d2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="LoginDashboard"
          component={LoginDashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="TradingControl"
          component={TradingControlScreen}
          options={{ title: 'Trading' }}
        />
        <Stack.Screen
          name="ChartIndicators"
          component={ChartIndicatorsScreen}
          options={{ title: 'Charts' }}
        />
        <Stack.Screen
          name="AdvancedIndicators"
          component={AdvancedIndicatorsScreen}
          options={{ title: 'Indicators' }}
        />
        <Stack.Screen
          name="LogsHistory"
          component={LogsHistoryScreen}
          options={{ title: 'Logs & History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
