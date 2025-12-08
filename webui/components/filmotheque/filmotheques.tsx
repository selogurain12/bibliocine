import { View, ActivityIndicator, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "context/auth-context";
import { FontAwesome } from "@expo/vector-icons";
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryClient } from "context/query-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { client } from "../../utils/clients/client";
import { useToast } from "../ui/toast";
import { FilmothequeDto } from "../../../packages/src/dtos/filmotheque.dto";
import { Button } from "../ui/button";
import { CreateFilmotheque } from "./forms/create";
import { UpdateFilmotheque } from "./forms/update";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Filmotheques">;

export function Filmotheques() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFilmotheque, setSelectedFilmotheque] = useState<FilmothequeDto | null>(null);

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
    return null;
  }

  const { data, isLoading } = client.filmotheque.getAllFilmotheques.useQuery({
    queryKey: queryKeys.filmotheque.getAllFilmotheques({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
  });

  const { mutate } = client.filmotheque.deleteFilmotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.filmotheque.getAllFilmotheques({ pathParams: { userId: user.id } }),
      });
      showToast("La filmothèque a bien été supprimée", 2000, "success");
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

  const renderItem = ({ item }: { item: FilmothequeDto }) => (
    <View className="m-2 flex-1 rounded-lg border border-gray-200 bg-white p-2 shadow">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MoviesInFilmotheque", { id: item.id });
        }}
        className="items-center">
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
            setSelectedFilmotheque(item);
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

  return (
    <View className="p-2">
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View className="mb-4 flex-row justify-end gap-2">
            <Button
              variant="outline"
              onPress={() => {
                setCreateModalVisible(true);
              }}>
              <Text>Créer une filmotheque</Text>
            </Button>
          </View>

          <FlatList
            contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
            data={data?.body.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />

          <CreateFilmotheque
            visible={createModalVisible}
            onClose={() => {
              setCreateModalVisible(false);
            }}
          />

          {selectedFilmotheque && (
            <UpdateFilmotheque
              filmotheque={selectedFilmotheque}
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
