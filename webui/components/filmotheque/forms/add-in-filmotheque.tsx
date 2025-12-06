import React, { useState } from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text } from "../../ui/text";
import Select from "../../ui/select";
import { client } from "utils/clients/client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useAuth } from "context/auth-context";
import { useToast } from "../../ui/toast";
import { CreateFilmotheque } from "./create";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryClient } from "context/query-client";

type AddInFilmothequeProps = {
  visible: boolean;
  onClose: () => void;
  movieId: string;
};

export function AddInFilmotheque({
  visible,
  onClose,
  movieId,
}: AddInFilmothequeProps) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedFilmotheque, setSelectedFilmotheque] = useState<{ id: string; name: string } | undefined>(undefined);

  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
    return null;
  }

  const { mutate } = client.filmotheque.updateFilmotheque.useMutation({
    onSuccess: ({ body }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.filmotheque.updateFilmotheque(),
      });
      showToast(
        `Le film a été ajouté à la filmothèque "${selectedFilmotheque?.name}" !`,
        2000,
        "success"
      );
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de l'ajout : ${error.message}`, 4000, "error");
      }
    },
  });

  const { data } = client.filmotheque.getAllFilmotheques.useQuery({
    queryKey: queryKeys.filmotheque.getAllFilmotheques({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
    enabled: visible,
  });

  const filmotheques = data ? data.body.data : [];

  function handleAddFilm() {
    if (!selectedFilmotheque) {
      showToast("Veuillez sélectionner une filmothèque", 2000, "error");
      return;
    }

    if (!user) {
      showToast("Aucun utilisateur connécté", 2000, "error");
      return;
    }

    mutate({
      params: { id: selectedFilmotheque.id, userId: user.id },
      body: { name: selectedFilmotheque.name, movies: [movieId] },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        className="flex-1 bg-black/50 justify-center items-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Choisir une filmothèque</Text>

          <Select
            options={filmotheques.map((filmotheque) => ({
              label: filmotheque.name,
              value: filmotheque.id,
            }))}
            placeholder="Sélectionnez une filmothèque"
            value={selectedFilmotheque?.id}
            onValueChange={(value) => {
              const fimotheque = filmotheques.find((fimotheque) => fimotheque.id === value);
              if (fimotheque) setSelectedFilmotheque({ id: fimotheque.id, name: fimotheque.name });
            }}
          />

          <TouchableOpacity
            onPress={handleAddFilm}
            className="bg-green-600 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Ajouter le film</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            className="bg-blue-600 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Créer une filmothèque</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-red-500 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CreateFilmotheque
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </Modal>
  );
}
