import { View, Image, ActivityIndicator, ScrollView } from "react-native";
import { client } from "utils/clients/client";
import { useAuth } from "context/auth-context";
import { queryClient } from "context/query-client";
import { useState } from "react";
import { isFetchError } from "@ts-rest/react-query/v5";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { SpeedDial } from "../ui/speed-dial/speed-dial";
import { CreateBookInProgress } from "../book-in-progress/forms/create";
import { AddInBibliotheque } from "../bibliotheque/forms/add-in-bibliotheque";
import { useToast } from "../ui/toast";

// eslint-disable-next-line complexity
export function BookDetails({ id }: { id: string }) {
  const [isModalBookInProgressVisible, setModalBookInProgressVisible] = useState(false);
  const [isModalListBibliothequeVisible, setModalListBibliothequeVisible] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { data, isLoading } = client.books.getBook.useQuery({
    queryKey: queryKeys.books.getBook({
      pathParams: { id },
    }),
    queryData: {
      params: { id },
    },
  });
  const { mutate } = client.finishedBook.createFinishedBook.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.finishedBook.createFinishedBook(),
      });
      showToast("Livre est marqué comme terminé !", 2000, "success");
    },
    onError: (error) => {
      showToast(
        `Erreur lors du marquage du livre comme terminé : ${error.body.message}`,
        4000,
        "error"
      );
    },
  });
  const item = data?.body;
  const { data: stats } = client.stats.simpleStats.useQuery({
    queryKey: queryKeys.stats.simpleStats({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
  });

  const statsId = stats?.body.id ?? "";

  const { mutate: updateStats } = client.stats.updateStats.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.stats.updateStats(),
      });
      showToast("Les stats ont bien été mise à jour !", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification des stats : ${error.message}`, 4000, "error");
      }
    },
  });
  const imageUri = item?.imageLink ?? "https://via.placeholder.com/100x150?text=No+Image";

  function markAsFinished() {
    if (user) {
      updateStats({
        params: { userId: user.id, id: statsId },
        body: {
          pagesRead: item?.pageCount,
        },
      });
      mutate({
        params: { userId: user.id },
        body: {
          bookId: String(item?.id),
        },
      });
    } else {
      console.error("User not authenticated");
    }
  }
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View className="h-full w-full p-4">
          <ScrollView>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 pr-2">
                <Image
                  source={{ uri: imageUri }}
                  className="mb-4 aspect-[2/3] w-full rounded-md"
                  resizeMode="cover"
                />
              </View>
              <View className="w-1/2 pl-2">
                <Text className="mb-2 text-xl font-bold">{item?.title}</Text>
                <Text className="text-md mb-2">Auteur(s): {item?.authors.join(", ")}</Text>
              </View>
            </View>
            <Text className="mb-2">
              <Text className="font-bold">Description: </Text>
              {item?.description}
            </Text>
            <Text className="mb-2">
              <Text className="font-bold">Edition: </Text>
              {item?.publisher}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Date de publication: </Text>
              {item?.publisherDate}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Code ISBN: </Text>
              {item?.industryIdentifieridentyfier} $
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Nombre de pages: </Text>
              {item?.pageCount}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Catégorie: </Text>
              {item?.categories.join(", ")}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Prix: </Text>
              {item?.retailPriceAmount} {item?.retailPricecurrencyCode}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Lien d&apos;achat: </Text>
              {item?.retailPricebuyLink}
            </Text>
          </ScrollView>
          <SpeedDial
            actions={[
              {
                icon: "bookmark",
                label: "Ajouter à une bibliothèque",
                onPress: () => {
                  setModalListBibliothequeVisible(true);
                },
              },
              {
                icon: "clock-o",
                label: "Je suis en train de lire ce livre",
                onPress: () => {
                  setModalBookInProgressVisible(true);
                },
              },
              {
                icon: "check",
                label: "J'ai terminé ce livre",
                onPress: () => {
                  markAsFinished();
                },
              },
            ]}
          />
          <CreateBookInProgress
            visible={isModalBookInProgressVisible}
            onClose={() => {
              setModalBookInProgressVisible(false);
            }}
            book={item ?? null}
          />
          <AddInBibliotheque
            visible={isModalListBibliothequeVisible}
            onClose={() => {
              setModalListBibliothequeVisible(false);
            }}
            bookId={String(item?.id)}
          />
        </View>
      )}
    </View>
  );
}
