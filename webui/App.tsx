import './global.css';
import { AppBar } from 'components/AppBar';
import { FootBar } from 'components/FootBar';
import { Movie } from 'components/Movie';
import { queryClient } from 'context/query-client';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from "@tanstack/react-query";

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <AppBar />
      </View>
      <View style={{ flex: 1 }} >
        <Movie />
      </View>
      <View style={{ paddingBottom: insets.bottom }}>
        <FootBar />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
