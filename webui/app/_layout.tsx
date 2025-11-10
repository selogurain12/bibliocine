// app/_layout.tsx
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from 'lib/theme';
import "../global.css";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <PortalHost />
    </ThemeProvider>
  );
}
