import { useState } from "react";
import { View, ActivityIndicator, FlatList, Image } from "react-native";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { queryKeys } from "../../packages/src/query-client";
import { client } from "../utils/clients/client";
import { BookDto } from "../../packages/src/dtos/book.dto";

export function Book() {
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = client.books.getAllBooks.useQuery({
    queryKey: queryKeys.books.getAllBooks({
      pathParams: { search },
    }),
    queryData: {
      params: { search },
    },
    enabled: false,
  });
  console.log(data);

  const renderItem = ({ item }: { item: BookDto }) => {
    const imageUri = item.imageLink
      ? item.imageLink
      : "https://via.placeholder.com/100x150?text=No+Image";

    return (
      <View className="flex-1 m-2">
        <View className="flex-1 bg-white rounded-lg shadow items-center p-2 border border-gray-200">
          <Image
            source={{ uri: imageUri }}
            className="w-full aspect-[2/3] rounded-md"
            resizeMode="cover"
          />
          <Text className="mt-2 text-center" numberOfLines={2}>{item.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="p-2">
      <View className="flex-row items-center gap-2 mb-4">
        <Input
          className="w-4/6"
          placeholder="Titre du livre"
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
          data={data?.body.data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
}
