/* eslint-disable max-len */
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
import { BookDto } from "../../../packages/src/dtos/book.dto";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Book">;

export function Books() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch } = client.books.getAllBooks.useQuery({
    queryKey: queryKeys.books.getAllBooks({
      pathParams: { search },
    }),
    queryData: {
      params: { search },
    },
    enabled: false,
  });

  const renderItem = ({ item }: { item: BookDto }) => {
    const imageUri = item.imageLink
      ? item.imageLink
      : "https://via.placeholder.com/100x150?text=No+Image";

    return (
      <TouchableOpacity
        className="m-2 flex-1"
        onPress={() => {
          navigation.navigate("BookDetail", { id: item.id });
        }}>
        <View className="m-2 flex-1">
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="p-2">
      <View className="mb-4 flex-row items-center gap-2">
        <Input
          className="w-4/6"
          placeholder="Titre du livre"
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
