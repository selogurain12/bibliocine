/* eslint-disable complexity */
import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "context/auth-context";
import { client } from "utils/clients/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { queryKeys } from "../../packages/src/query-client";
import { Text } from "./ui/text";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Statistiques">;

export function Statistiques() {
  const { user, clearAuth } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();

  const { data: stats } = client.stats.allStats.useQuery({
    queryKey: queryKeys.stats.allStats({
      pathParams: { userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "" } },
  });

  const handleLogout = async () => {
    await clearAuth();

    navigation.navigate("Movie");
  };

  return (
    <ScrollView
      className="flex-1 bg-white p-6"
      contentContainerStyle={{
        paddingBottom: Math.max(insets.bottom),
      }}>
      <Text className="mb-6 text-2xl font-bold">Statistiques</Text>

      <StatCard title="Temps total vu" value={`${stats?.body.timeSeen ?? 0} min`} />
      <StatCard title="Pages lues" value={`${stats?.body.pagesRead ?? 0} pages`} />
      <StatCard title="Filmothèques" value={stats?.body.filmotheque ?? 0} />
      <StatCard title="Bibliothèques" value={stats?.body.bibliotheque ?? 0} />
      <StatCard title="Films terminés" value={stats?.body.finishedMovies ?? 0} />
      <StatCard title="Livres terminés" value={stats?.body.finishedBooks ?? 0} />
      <StatCard title="Films en cours" value={stats?.body.moviesInProgress ?? 0} />
      <StatCard title="Livres en cours" value={stats?.body.booksInProgress ?? 0} />

      <TouchableOpacity onPress={() => void handleLogout()} className="rounded-lg bg-red-500 p-4">
        <Text className="text-center font-semibold text-white">Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <View className="mb-4 rounded-lg bg-gray-100 p-4">
      <Text className="text-lg font-semibold">{title}</Text>
      <Text className="mt-1 text-xl font-bold">{value}</Text>
    </View>
  );
}
