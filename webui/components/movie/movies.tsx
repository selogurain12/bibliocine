import { useState } from "react";
import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { client } from "../../utils/clients/client";
import { MovieDto } from "../../../packages/src/dtos/movie.dto";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      className="flex-1 m-2"
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    >
      <View className="flex-1 bg-white rounded-lg shadow items-center p-2 border border-gray-200">
        <Image
          source={{ uri: imageUri }}
          className="w-full aspect-[2/3] rounded-md"
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
      <View className="flex-row items-center gap-2 mb-4">
        <Input
          className="w-4/6"
          placeholder="Titre du film"
          value={search}
          onChangeText={setSearch}
        />
        <Button
          variant="outline"
          className="w-2/6 right-1"
          onPress={() => {
            refetch();
          }}
        >
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
