import './global.css';
import { AppBar } from 'components/AppBar';
import { FootBar } from 'components/FootBar';
import { View } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <AppBar />
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: insets.bottom }}>
        <FootBar />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
