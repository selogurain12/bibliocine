import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { useAuth } from "context/auth-context";
import { useToast } from "../ui/toast";
import { useNavigation } from "@react-navigation/native";
import { BookDto } from "../../../packages/src/dtos/book.dto";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavProp = NativeStackNavigationProp<RootStackParamList, "BooksInBibliotheque">;

export function BookInBibliotheque({ id }: { id: string }) {
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [booksDetails, setBooksDetails] = useState<BookDto[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const { data, isLoading } = client.bibliotheque.getBibliotheque.useQuery({
    queryKey: queryKeys.bibliotheque.getBibliotheque({
      pathParams: { id, userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "", id } },
    enabled: !!user,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      if (data?.body.books) {
        try {
          const results = await Promise.all(
            data.body.books.map(async (bookId: string) => {
              const res = await client.books.getBook.query({
                params: { id: bookId },
              });
              return res.body as BookDto;
            })
          );
          setBooksDetails(results);
        } catch (error) {
          showToast(`Erreur lors du chargement des livres: ${error}`, 2000, "error");
        } finally {
          setLoadingBooks(false);
        }
      }
    };

    fetchBooks();
  }, [data, showToast]);

  if (!user) {
    showToast("Vous devez être connecté", 2000, "error");
    return null;
  }

  if (isLoading || loadingBooks) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderBook = ({ item }: { item: BookDto }) => (
    <TouchableOpacity
        className="flex-1 m-2"
        onPress={() => navigation.navigate("BookDetail", { id: item.id })}
      >
        <View className="flex-1 m-2">
          <View className="flex-1 bg-white rounded-lg shadow items-center p-2 border border-gray-200">
            <Image
              source={{ uri: item.imageLink }}
              className="w-full aspect-[2/3] rounded-md"
              resizeMode="cover"
            />
            <Text className="mt-2 text-center" numberOfLines={2}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  return (
    <View className="p-2">
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
        data={booksDetails}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
}
