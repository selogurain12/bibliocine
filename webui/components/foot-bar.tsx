/* eslint-disable max-len */
import { View } from "react-native";
import { BookOpen, Film, Library } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { Text } from "./ui/text";
import { Button } from "./ui/button";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function FootBar() {
  const navigation = useNavigation<NavProp>();
  return (
    <View className="h-16 flex-row items-center justify-center border-t border-gray-200 bg-amber-100">
      <View className="w-1/3 flex-row justify-center">
        <Button
          className="flex-col items-center gap-1"
          variant="ghost"
          onPress={() => {
            navigation.navigate("Movie");
          }}>
          <Film size={20} />
          <Text className="text-xs">Films</Text>
        </Button>
      </View>
      <View className="w-1/3 flex-row justify-center">
        <Button
          className="flex-col items-center gap-1"
          variant="ghost"
          onPress={() => {
            navigation.navigate("Book");
          }}>
          <BookOpen size={20} />
          <Text className="text-xs">Livres</Text>
        </Button>
      </View>
      <View className="w-1/3 flex-row justify-center">
        <Button
          className="flex-col items-center gap-1"
          variant="ghost"
          onPress={() => {
            navigation.navigate("Collection");
          }}>
          <Library size={20} />
          <Text className="text-xs">Collections</Text>
        </Button>
      </View>
    </View>
  );
}
