import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "context/auth-context";
import { useNavigation } from "@react-navigation/native";
import { queryClient } from "context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Progress } from "components/ui/progress";
import { BookInProgressDto } from "../../../packages/src/dtos/bookInProgress.dto";
import { BookDto } from "../../../packages/src/dtos/book.dto";
import { useToast } from "../ui/toast";
import { queryKeys } from "../../../packages/src/query-client";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { UpdateBookInProgress } from "./forms/update";

type NavProp = NativeStackNavigationProp<RootStackParamList, "BookInProgress">;

export function BookInProgress() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [booksDetails, setBooksDetails] = useState<BookDto[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [selectedBookInProgress, setSelectedBookInProgress] = useState<BookInProgressDto | null>(
    null
  );
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { data, isLoading } = client.booksInProgress.getAllBooksInProgress.useQuery({
    queryKey: queryKeys.booksInProgress.getAllBooksInProgress({
      pathParams: { userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "" } },
    enabled: !!user,
  });

  const { mutate: deleteBook } = client.booksInProgress.deleteBookInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.booksInProgress.getAllBooksInProgress({
          pathParams: { userId: user?.id ?? "" },
        }),
      });
      showToast("Livre supprimé de vos livres en cours", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur: ${error.message}`, 2000, "error");
      }
    },
  });

  function handleDelete(itemId: string) {
    if (!user) {
      showToast("Vous devez être connecté", 2000, "error");
      return;
    }
    deleteBook({ params: { id: itemId, userId: user.id } });
  }

  useEffect(() => {
    const fetchBooks = async () => {
      if (data?.body.data) {
        try {
          const results = await Promise.all(
            data.body.data.map(async (progress: BookInProgressDto) => {
              const res = await client.books.getBook.query({
                params: { id: progress.bookId },
              });
              return res.body as BookDto;
            })
          );
          setBooksDetails(results);
        } catch (err) {
          console.error(err);
          showToast("Erreur lors du chargement des livres", 2000, "error");
        } finally {
          setLoadingBooks(false);
        }
      }
    };

    void fetchBooks();
  }, [data, showToast]);

  if (!user) {
    showToast("Vous devez être connecté pour voir vos livres en cours", 2000, "error");
    return null;
  }

  if (isLoading || loadingBooks) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderBook = ({ item }: { item: BookDto }) => {
    const bookProgress = data?.body.data.find(
      (bookprogress: BookInProgressDto) => bookprogress.bookId === item.id
    );
    let progress = 0;
    if (bookProgress) {
      progress = (100 * bookProgress.currentPage) / item.pageCount;
    }
    return (
      <View className="m-2 flex-1 rounded-lg border border-gray-200 bg-white p-2 shadow">
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            navigation.navigate("BookDetail", { id: item.id });
          }}>
          <Image
            source={{ uri: item.imageLink }}
            style={{ width: 100, height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Text className="mt-2 text-center" numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View className="mt-2 flex-row justify-center">
          <TouchableOpacity
            onPress={() => {
              if (bookProgress) {
                setSelectedBookInProgress(bookProgress);
                setEditModalVisible(true);
                setSelectedBook(item);
              }
            }}
            className="p-2">
            <FontAwesome name="pencil" size={18} color="black" />
          </TouchableOpacity>

          {bookProgress && (
            <View className="mt-2">
              <Progress value={progress} />
              <Text className="mt-1 text-center text-sm">{Math.round(progress)}% lu</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              if (bookProgress) {
                handleDelete(bookProgress.id);
              }
            }}
            className="p-2">
            <FontAwesome name="trash" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="p-2">
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
        data={booksDetails}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />

      {selectedBookInProgress && (
        <UpdateBookInProgress
          book={selectedBook}
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
          }}
          bookInProgress={selectedBookInProgress}
        />
      )}
    </View>
  );
}
