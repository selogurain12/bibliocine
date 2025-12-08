import { View, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "context/auth-context";
import { FontAwesome } from "@expo/vector-icons";
import { queryClient } from "context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { BibliothequeDto } from "../../../packages/src/dtos/bibliotheque.dto";
import { useToast } from "../ui/toast";
import { client } from "../../utils/clients/client";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { UpdateBibliotheque } from "./forms/update";
import { CreateBibliotheque } from "./forms/create";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Bibliotheques">;

export function Bibliotheques() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBibliotheque, setSelectedBibliotheque] = useState<BibliothequeDto | null>(null);

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { data, isLoading } = client.bibliotheque.getAllBibliotheques.useQuery({
    queryKey: queryKeys.bibliotheque.getAllBibliotheques({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
  });

  const { mutate } = client.bibliotheque.deleteBibliotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.bibliotheque.getAllBibliotheques({ pathParams: { userId: user.id } }),
      });
      showToast("La bibliothèque a bien été supprimée", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur: ${error.message}`, 2000, "error");
      }
    },
  });

  function handleDelete(id: string) {
    if (!user) {
      showToast("Vous devez être connecté pour supprimer une filmotheque", 2000, "error");
      return;
    }
    mutate({ params: { id, userId: user.id } });
  }
  const renderItem = ({ item }: { item: BibliothequeDto }) => {
    return (
      <View className="m-2 flex-1 rounded-lg border border-gray-200 bg-white p-2 shadow">
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            navigation.navigate("BooksInBibliotheque", { id: item.id });
          }}>
          <Image
            source={{ uri: item.imageUrl ?? "https://via.placeholder.com/100x150?text=No+Image" }}
            style={{ width: 100, height: 150, borderRadius: 8 }}
          />
          <Text className="mt-2 text-center" numberOfLines={2}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <View className="mt-2 flex-row justify-center">
          <TouchableOpacity
            onPress={() => {
              setSelectedBibliotheque(item);
              setEditModalVisible(true);
            }}
            className="p-2">
            <FontAwesome name="pencil" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleDelete(item.id);
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View className="mb-4 flex-row justify-end gap-2">
            <Button
              variant="outline"
              className="right-1"
              onPress={() => {
                setCreateModalVisible(true);
              }}>
              <Text>Créer une bibliothèque</Text>
            </Button>
          </View>
          <FlatList
            contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
            data={data?.body.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
          <CreateBibliotheque
            visible={createModalVisible}
            onClose={() => {
              setCreateModalVisible(false);
            }}
          />

          {selectedBibliotheque && (
            <UpdateBibliotheque
              bibliotheque={selectedBibliotheque}
              visible={editModalVisible}
              onClose={() => {
                setEditModalVisible(false);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}
