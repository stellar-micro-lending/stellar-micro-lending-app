import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import KycScreen from '../screens/KycScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoanRequestScreen from '../screens/LoanRequestScreen';
import LoanHistoryScreen from '../screens/LoanHistoryScreen';
import RepayScreen from '../screens/RepayScreen';

export type AuthStackParams = {
  Welcome: undefined;
  Register: undefined;
  Kyc: { userId: string };
};

export type MainTabParams = {
  Dashboard: undefined;
  LoanRequest: undefined;
  LoanHistory: undefined;
  Repay: { loanId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();
const MainTab = createBottomTabNavigator<MainTabParams>();

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#6366f1' }}
    >
      <MainTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: () => <Text>🏠</Text> }}
      />
      <MainTab.Screen
        name="LoanRequest"
        component={LoanRequestScreen}
        options={{ tabBarLabel: 'Borrow', tabBarIcon: () => <Text>💰</Text> }}
      />
      <MainTab.Screen
        name="LoanHistory"
        component={LoanHistoryScreen}
        options={{ tabBarLabel: 'History', tabBarIcon: () => <Text>📋</Text> }}
      />
      <MainTab.Screen
        name="Repay"
        component={RepayScreen}
        options={{ tabBarIcon: () => <Text>↩️</Text> }}
        initialParams={{ loanId: '' }}
      />
    </MainTab.Navigator>
  );
}

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="Kyc" component={KycScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
