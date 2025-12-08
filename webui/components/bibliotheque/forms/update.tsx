import React, { useEffect } from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  BibliothequeDto,
  UpdateBibliothequeDto,
  updateBibliothequeSchema,
} from "../../../../packages/src/dtos/bibliotheque.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { useAuth } from "context/auth-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "utils/upload-image";

type UpdateBibliothequeProps = {
  bibliotheque: BibliothequeDto;
  visible: boolean;
  onClose: () => void;
};

export function UpdateBibliotheque({
  bibliotheque,
  visible,
  onClose,
}: UpdateBibliothequeProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<UpdateBibliothequeDto>({
    resolver: zodResolver(updateBibliothequeSchema),
    defaultValues: {
      name: bibliotheque.name,
      imageUrl: bibliotheque.imageUrl,
    },
  });

  const image = form.watch("imageUrl");
  
  useEffect(() => {
    if (visible) {
      form.reset({
        name: bibliotheque.name,
        imageUrl: bibliotheque.imageUrl,
      });
    }
  }, [visible, bibliotheque, form]);

  if (!user) {
    showToast("Vous devez être connecté pour modifier une bibliothèque", 2000, "error");
    return null;
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      form.setValue("imageUrl", result.assets[0].base64!);
    }
  };

  const { mutate } = client.bibliotheque.updateBibliotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.bibliotheque.getAllBibliotheques({
          pathParams: { userId: user.id },
        }),
      });

      showToast("La bibliothèque a bien été modifiée !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification : ${error.message}`, 4000, "error");
      }
    },
  });

  async function handleSubmit(data: UpdateBibliothequeDto) {
    if (!user) {
      showToast("Vous devez être connecté pour modifier une bibliothèque", 2000, "error");
      return;
    }
    let imageUrl = bibliotheque.imageUrl;

    if (data.imageUrl && data.imageUrl !== bibliotheque.imageUrl) {
      imageUrl = await uploadToCloudinary(data.imageUrl);
    }

    mutate({
      params: { id: bibliotheque.id, userId: user.id },
      body: {
        name: data.name,
        imageUrl,
        books: bibliotheque.books,
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Modifier une bibliothèque</Text>

          {image && (
            <Image
              source={{
                uri:
                  image.startsWith("http") || image.startsWith("https")
                    ? image
                    : `data:image/jpeg;base64,${image}`
              }}
              className="w-32 h-32 rounded-lg self-center mb-4"
            />
          )}

          <TouchableOpacity
            onPress={pickImage}
            className="bg-purple-600 p-3 rounded-md mb-4"
          >
            <Text className="text-white text-center">Changer l’image</Text>
          </TouchableOpacity>

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
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-400 p-3 rounded-md flex-1 mr-2"
            >
              <Text className="text-white text-center">Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={form.handleSubmit(handleSubmit)}
              className="bg-blue-600 p-3 rounded-md flex-1 ml-2"
            >
              <Text className="text-white text-center">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
