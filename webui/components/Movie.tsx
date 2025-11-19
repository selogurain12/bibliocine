import { useState } from "react";
import { View, ActivityIndicator, FlatList, Image } from "react-native";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { queryKeys } from "../../packages/src/query-client";
import { client } from "../utils/clients/client";
import { MovieDto } from "../../packages/src/dtos/movie.dto";

export function Movie() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = client.movies.getAllMovies.useQuery({
    queryKey: queryKeys.movies.getAllMovies({
      pathParams: { search },
    }),
    queryData: {
      params: { search },
    },
  });

  console.log("Données des films :", data);

  const renderItem = ({ item }: { item: MovieDto }) => {
  const imageUri = item.posterPath ?? "https://via.placeholder.com/100x150?text=No+Image";

  return (
    <View className="w-1/2 p-2">
      <View className="bg-white rounded shadow p-2 items-center">
        <Image
          source={{ uri: imageUri }}
          style={{ width: 100, height: 150, borderRadius: 8 }}
          resizeMode="cover"
        />
        <Text className="mt-2 text-center">{item.title}</Text>
      </View>
    </View>
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
            console.log("Recherche :", search);
          }}
        >
          <Text>Chercher</Text>
        </Button>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data?.body.data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
}
