import { Modal, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { client } from "utils/clients/client";
import { useAuth } from "context/auth-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryClient } from "context/query-client";
import { Text } from "../../ui/text";
import Select from "../../ui/select";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { CreateFilmotheque } from "./create";

type AddInFilmothequeProps = {
  visible: boolean;
  onClose: () => void;
  movieId: string;
};

export function AddInFilmotheque({ visible, onClose, movieId }: AddInFilmothequeProps) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedFilmotheque, setSelectedFilmotheque] = useState<
    { id: string; name: string } | undefined
  >(undefined);

  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
    return null;
  }

  const { mutate } = client.filmotheque.updateFilmotheque.useMutation({
    onSuccess: () => {
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
        className="flex-1 items-center justify-center bg-black/50"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Choisir une filmothèque</Text>

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

          <TouchableOpacity onPress={handleAddFilm} className="mt-4 rounded-md bg-green-600 p-3">
            <Text className="text-center text-white">Ajouter le film</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCreateModalVisible(true);
            }}
            className="mt-4 rounded-md bg-blue-600 p-3">
            <Text className="text-center text-white">Créer une filmothèque</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-4 rounded-md bg-red-500 p-3">
            <Text className="text-center text-white">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CreateFilmotheque
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
        }}
      />
    </Modal>
  );
}
