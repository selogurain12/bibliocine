import { View } from "react-native";
import { BookOpen, CircleUserRound, Film } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useAuth } from "context/auth-context";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function AppBar() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  return (
    <View className="h-16 flex-row items-center gap-2 bg-amber-100 px-4">
      <View className="w-1/3 flex-row justify-start gap-2">
        <Film color="#0088F0" />
        <BookOpen color="#47C047" />
      </View>
      <View className="w-1/3 flex-row justify-center gap-2">
        <Text className="text-lg font-bold text-black">Bibliociné</Text>
      </View>
      <View className="right-3 w-1/3 flex-row justify-end">
        <Button
          className="flex-col items-center gap-1"
          variant="ghost"
          onPress={() => {
            if (user !== null) {
              navigation.navigate("Statistiques");
            } else {
              navigation.navigate("Register");
            }
          }}>
          <CircleUserRound />
        </Button>
      </View>
    </View>
  );
}
