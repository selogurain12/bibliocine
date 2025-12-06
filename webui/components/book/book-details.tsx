import { View, Image, ActivityIndicator, ScrollView } from "react-native";
import { Text } from "../ui/text";
import { client } from "utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { SpeedDial } from "../ui/speed-dial/speed-dial";
import { CreateBookInProgress } from "../book-in-progress/forms/create";
import { AddInBibliotheque } from "../bibliotheque/forms/add-in-bibliotheque";
import { useAuth } from "context/auth-context";
import { useToast } from "../ui/toast";
import { queryClient } from "context/query-client";
import { useState } from "react";

export function BookDetails({id}: {id: string}) {
    const [isModalBookInProgressVisible, setModalBookInProgressVisible] = useState(false);
    const [isModalListBibliothequeVisible, setModalListBibliothequeVisible] = useState(false);
    const {user} = useAuth();
    const { showToast } = useToast();
    const {data, isLoading} = client.books.getBook.useQuery({
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
                console.error("Error marking book as finished:", error);
            },
        });
    const item = data?.body;
    const imageUri = item?.imageLink
      ? item.imageLink
      : "https://via.placeholder.com/100x150?text=No+Image";

      function markAsFinished() {
        if (user) {
            mutate({
                params: { userId: user.id },
                body: {
                    bookId: String(item?.id) ?? "0",
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
                            className="w-full aspect-[2/3] rounded-md mb-4"
                            resizeMode="cover"
                            />
                        </View>
                        <View className="w-1/2 pl-2">
                            <Text className="text-xl font-bold mb-2">{item?.title}</Text>
                            <Text className="text-md mb-2">Auteur(s): {item?.authors?.join(", ")}</Text>
                        </View>
                    </View>
                    <Text className="mb-2">
                        <Text className="font-bold">Description: </Text>{item?.description}
                    </Text>
                    <Text className="mb-2">
                        <Text className="font-bold">Edition: </Text>{item?.publisher}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Date de publication: </Text>{item?.publisherDate}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Code ISBN: </Text>{item?.industryIdentifieridentyfier} $
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Nombre de pages: </Text>{item?.pageCount}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Catégorie: </Text>{item?.categories?.join(", ")}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Prix: </Text>{item?.retailPriceAmount} {item?.retailPricecurrencyCode}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Lien d&apos;achat: </Text>{item?.retailPricebuyLink}
                    </Text>
                </ScrollView>
                {user &&
                    <SpeedDial
                        actions={[
                            { icon: "bookmark", label: "Ajouter à une bibliothèque", onPress: () => setModalListBibliothequeVisible(true) },
                            { icon: "clock-o", label: "Je suis en train de lire ce livre", onPress: () => setModalBookInProgressVisible(true) },
                            { icon: "check", label: "J'ai terminé ce livre", onPress: () => markAsFinished() },
                        ]} />
                }
                <CreateBookInProgress
                    visible={isModalBookInProgressVisible}
                    onClose={() => setModalBookInProgressVisible(false)}
                    book={item ? { id: String(item.id), title: item.title, imageLink: item.imageLink } : null}
                />
                <AddInBibliotheque
                    visible={isModalListBibliothequeVisible}
                    onClose={() => setModalListBibliothequeVisible(false)}
                    bookId={String(item?.id)}
                />
            </View>
        )}
    </View>
  );
}