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
import { CreateBibliotheque } from "./create";

type AddInBibliothequeProps = {
  visible: boolean;
  onClose: () => void;
  bookId: string;
};

export function AddInBibliotheque({ visible, onClose, bookId }: AddInBibliothequeProps) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedBibliotheque, setSelectedBibliotheque] = useState<
    { id: string; name: string } | undefined
  >(undefined);

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
        className="flex-1 items-center justify-center bg-black/50"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Choisir une bibliothèque</Text>

          <Select
            options={bibliotheques.map((bibliotheque) => ({
              label: bibliotheque.name,
              value: bibliotheque.id,
            }))}
            placeholder="Sélectionnez une bibliothèque"
            value={selectedBibliotheque?.id}
            onValueChange={(value) => {
              const bibliotheque = bibliotheques.find((bibliotheque) => bibliotheque.id === value);
              if (bibliotheque)
                setSelectedBibliotheque({ id: bibliotheque.id, name: bibliotheque.name });
            }}
          />

          <TouchableOpacity onPress={handleAddLivre} className="mt-4 rounded-md bg-green-600 p-3">
            <Text className="text-center text-white">Ajouter le livre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCreateModalVisible(true);
            }}
            className="mt-4 rounded-md bg-blue-600 p-3">
            <Text className="text-center text-white">Créer une bibliothèque</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-4 rounded-md bg-red-500 p-3">
            <Text className="text-center text-white">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CreateBibliotheque
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
        }}
      />
    </Modal>
  );
}
