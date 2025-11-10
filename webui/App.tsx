import './global.css';
import { AppBar } from 'components/AppBar';
import { View } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <AppBar />
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
