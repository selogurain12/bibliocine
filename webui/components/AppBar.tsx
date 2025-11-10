import { View } from "react-native";
import { Text } from "./ui/text";
import { BookOpen, CircleUserRound, Film } from "lucide-react-native";

export function AppBar() {
    return (
        <View className="h-12 bg-amber-100 px-4 flex-row items-center gap-2">
            <View className="flex-row justify-start gap-2 w-1/3">
                <Film />
                <BookOpen  />
            </View>
            <View className="flex-row justify-center gap-2 w-1/3">
                <Text className="text-black text-lg font-bold">Bibliociné</Text>
            </View>
            <View className="flex-row justify-end right-3 w-1/3">
                <CircleUserRound /> 
            </View>
        </View>
    )
}