import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Controller, useForm } from "react-hook-form";
import { CreateBibliothequeDto, createBibliothequeSchema } from "../../../../packages/src/dtos/bibliotheque.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { useAuth } from "context/auth-context";
import { isFetchError } from "@ts-rest/react-query/v5";

type CreateBibliothequeProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateBibliotheque({ visible, onClose }: CreateBibliothequeProps) {
  const { showToast } = useToast();
    const { user } = useAuth();
    
  const form = useForm<CreateBibliothequeDto>({
    resolver: zodResolver(createBibliothequeSchema),
    defaultValues: { name: "" },
  });

   if (!user) {
      showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
      return;
    }

   const { mutate } = client.bibliotheque.createBibliotheque.useMutation({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.bibliotheque.getAllBibliotheques({
            pathParams: { userId: user?.id }
          }),
        });
        form.reset();
        showToast("La bibliotheque a bien été crée !", 2000, "success");
        onClose();
      },
      onError: (error) => {
        if (isFetchError(error)) {
          showToast(`Erreur lors de la création : ${error.message}`, 4000, "error");
        }
      },
    });

  function handleSubmit(data: CreateBibliothequeDto) {
    if (!user) {
      showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
      return;
    }
    mutate({
      params: { userId: user.id },
      body: {
        name: data.name,
        books: []
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Nouvelle bibliothèque</Text>

          <View className="gap-1.5 mb-4">
            <Label htmlFor="name">Nom de la bibliothèque</Label>
            <Controller
              control={form.control}
              name="name"
              rules={{ required: "Le nom est obligatoire" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  id="name"
                  placeholder="Ex: Mes livres préférés"
                  value={value}
                  onChangeText={onChange}
                  returnKeyType="done"
                />
              )}
            />
            {form.formState.errors.name && (
              <Text className="text-red-500">{form.formState.errors.name.message}</Text>
            )}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="bg-gray-400 p-3 rounded-md flex-1 mr-2">
              <Text className="text-white text-center">Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={form.handleSubmit(handleSubmit)}
              className="bg-blue-600 p-3 rounded-md flex-1 ml-2"
            >
              <Text className="text-white text-center">Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
