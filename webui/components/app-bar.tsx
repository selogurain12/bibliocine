import { View } from "react-native";
import { Text } from "./ui/text";
import { BookOpen, CircleUserRound, Film } from "lucide-react-native";
import { Button } from "./ui/button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function AppBar() {
    const navigation = useNavigation<NavProp>();
    return (
        <View className="h-16 bg-amber-100 px-4 flex-row items-center gap-2">
            <View className="flex-row justify-start gap-2 w-1/3">
                <Film color="#0088F0" />
                <BookOpen color="#47C047"  />
            </View>
            <View className="flex-row justify-center gap-2 w-1/3">
                <Text className="text-black text-lg font-bold">Bibliociné</Text>
            </View>
            <View className="flex-row justify-end right-3 w-1/3">
                <Button className="flex-col items-center gap-1" variant="ghost" onPress={() => navigation.navigate('Register')}>
                    <CircleUserRound /> 
                </Button>
            </View>
        </View>
    )
}