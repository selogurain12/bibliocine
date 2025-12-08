import { ScrollView, TouchableOpacity, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardPage() {
  const navigation = useNavigation<NavProp>();

  const sections = [
    { name: "🎬 Filmothèques", route: "Filmotheques" },
    { name: "📚 Bibliothèques", route: "Bibliotheques" },
    { name: "🎥 Films en cours", route: "MovieInProgress" },
    { name: "📖 Livres en cours", route: "BookInProgress" },
    { name: "✅ Films terminés", route: "FinishedMovie" },
    { name: "✅ Livres terminés", route: "FinishedBook" },
  ] as const;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-6">
      {sections.map((section, idx) => (
        <TouchableOpacity
          key={idx}
          className="mb-4 rounded-lg border p-4"
          onPress={() => {
            navigation.navigate(section.route);
          }}>
          <Text className="text-center text-lg font-semibold">{section.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
