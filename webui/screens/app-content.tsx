import { AppBar } from "components/app-bar";
import { FootBar } from "components/foot-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AppContent({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <AppBar />
      </View>
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <View style={{ paddingBottom: insets.bottom }}>
        <FootBar />
      </View>
    </View>
  );
}