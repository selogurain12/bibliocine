import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "context/auth-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { queryClient } from "context/query-client";
import { FontAwesome } from "@expo/vector-icons";
import { isFetchError } from "@ts-rest/react-query/v5";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { useToast } from "../ui/toast";
import { BookDto } from "../../../packages/src/dtos/book.dto";

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
  const { mutate: deleteBook } = client.bibliotheque.deleteBookFromBibliotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.bibliotheque.getBibliotheque({
          pathParams: { id, userId: user?.id ?? "" },
        }),
      });
      showToast("Livre supprimé de votre bibliothèque", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur: ${error.message}`, 2000, "error");
      }
    },
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
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          showToast(`Erreur lors du chargement des livres: ${error}`, 2000, "error");
        } finally {
          setLoadingBooks(false);
        }
      }
    };

    void fetchBooks();
  }, [data, showToast]);

  if (!user) {
    showToast("Vous devez être connecté", 2000, "error");
    return null;
  }

  if (isLoading || loadingBooks) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  function handleDelete(itemId: string) {
    if (!user) {
      showToast("Vous devez être connecté", 2000, "error");
      return;
    }
    deleteBook({ params: { id, userId: user.id, bookId: itemId } });
  }

  const renderBook = ({ item }: { item: BookDto }) => (
    <View className="m-2 flex-1 rounded-lg border border-gray-200 bg-white p-2 shadow">
      <TouchableOpacity
        className="items-center"
        onPress={() => {
          navigation.navigate("BookDetail", { id: item.id });
        }}>
        <Image
          source={{ uri: item.imageLink }}
          style={{ width: 100, height: 150, borderRadius: 8 }}
        />
        <Text className="mt-2 text-center" numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View className="mt-2 flex-row justify-center">
        <TouchableOpacity
          onPress={() => {
            handleDelete(item.id);
          }}
          className="roundedpx-3 mt-2 py-1">
          <FontAwesome name="trash" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
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
