import React, { useState } from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text } from "../../ui/text";
import Select from "../../ui/select";
import { client } from "utils/clients/client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useAuth } from "context/auth-context";
import { useToast } from "../../ui/toast";
import { CreateBibliotheque } from "./create";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryClient } from "context/query-client";

type AddInBibliothequeProps = {
  visible: boolean;
  onClose: () => void;
  bookId: string;
};

export function AddInBibliotheque({
  visible,
  onClose,
  bookId,
}: AddInBibliothequeProps) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedBibliotheque, setSelectedBibliotheque] = useState<{ id: string; name: string } | undefined>(undefined);

  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { mutate } = client.bibliotheque.updateBibliotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.bibliotheque.updateBibliotheque(),
      });
      showToast(
        `Le livre a été ajouté à la bibliothèque "${selectedBibliotheque?.name}" !`,
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

  const { data } = client.bibliotheque.getAllBibliotheques.useQuery({
    queryKey: queryKeys.bibliotheque.getAllBibliotheques({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
    enabled: visible,
  });

  const bibliotheques = data ? data.body.data : [];

  function handleAddLivre() {
    if (!selectedBibliotheque) {
      showToast("Veuillez sélectionner une bibliothèque", 2000, "error");
      return;
    }

    if (!user) {
      showToast("Aucun utilisateur connécté", 2000, "error");
      return;
    }

    mutate({
      params: { id: selectedBibliotheque.id, userId: user.id },
      body: { name: selectedBibliotheque.name, books: [bookId] },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        className="flex-1 bg-black/50 justify-center items-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Choisir une bibliothèque</Text>

          <Select
            options={bibliotheques.map((bibliotheque) => ({
              label: bibliotheque.name,
              value: bibliotheque.id,
            }))}
            placeholder="Sélectionnez une bibliothèque"
            value={selectedBibliotheque?.id}
            onValueChange={(value) => {
              const bibliotheque = bibliotheques.find((bibliotheque) => bibliotheque.id === value);
              if (bibliotheque) setSelectedBibliotheque({ id: bibliotheque.id, name: bibliotheque.name });
            }}
          />

          <TouchableOpacity
            onPress={handleAddLivre}
            className="bg-green-600 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Ajouter le livre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            className="bg-blue-600 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Créer une bibliothèque</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-red-500 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CreateBibliotheque
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </Modal>
  );
}
