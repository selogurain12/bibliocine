import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { client } from "../../utils/clients/client";
import { MovieDto } from "../../../packages/src/dtos/movie.dto";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Movie">;

export function Movies() {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch } = client.movies.getAllMovies.useQuery({
    queryKey: queryKeys.movies.getAllMovies({
      pathParams: { search },
    }),
    queryData: {
      params: { search },
    },
    enabled: false,
  });

  const renderItem = ({ item }: { item: MovieDto }) => {
    const imageUri = item.posterPath
      ? `https://image.tmdb.org/t/p/original/${item.posterPath}`
      : "https://via.placeholder.com/100x150?text=No+Image";

    return (
      <TouchableOpacity
        className="m-2 flex-1"
        onPress={() => {
          navigation.navigate("MovieDetail", { id: item.id });
        }}>
        <View className="flex-1 items-center rounded-lg border border-gray-200 bg-white p-2 shadow">
          <Image
            source={{ uri: imageUri }}
            className="aspect-[2/3] w-full rounded-md"
            resizeMode="cover"
          />
          <Text className="mt-2 text-center" numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="p-2">
      <View className="mb-4 flex-row items-center gap-2">
        <Input
          className="w-4/6"
          placeholder="Titre du film"
          value={search}
          onChangeText={setSearch}
        />
        <Button
          variant="outline"
          className="right-1 w-2/6"
          onPress={() => {
            void refetch();
          }}>
          <Text>Chercher</Text>
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
          data={data?.body.data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
}
