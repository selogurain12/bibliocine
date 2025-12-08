import { Modal, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { useAuth } from "context/auth-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "utils/upload-image";
import { useToast } from "../../ui/toast";
import { queryKeys } from "../../../../packages/src/query-client";
import {
  CreateFilmothequeDto,
  createFilmothequeSchema,
} from "../../../../packages/src/dtos/filmotheque.dto";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";

type CreateFilmothequeProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateFilmotheque({ visible, onClose }: CreateFilmothequeProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<CreateFilmothequeDto>({
    resolver: zodResolver(createFilmothequeSchema),
    defaultValues: {
      name: "",
      imageUrl: null,
    },
  });

  const image = form.watch("imageUrl");

  useEffect(() => {
    void (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  if (!user) {
    showToast("Vous devez être connecté pour ajouter une filmothèque", 2000, "error");
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
      form.setValue("imageUrl", result.assets[0].base64 ?? null);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      form.setValue("imageUrl", result.assets[0].base64 ?? null);
    }
  };

  const { mutate } = client.filmotheque.createFilmotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.filmotheque.getAllFilmotheques({
          pathParams: { userId: user.id },
        }),
      });

      form.reset();
      showToast("La filmothèque a bien été créée !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la création : ${error.message}`, 4000, "error");
      }
    },
  });

  async function handleSubmit(data: CreateFilmothequeDto) {
    if (!user) return;

    let imageUrl: string | null = null;

    if (data.imageUrl) {
      imageUrl = await uploadToCloudinary(data.imageUrl);
    }

    mutate({
      params: { userId: user.id },
      body: {
        name: data.name,
        movies: [],
        imageUrl: imageUrl,
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Nouvelle filmothèque</Text>

          {image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              className="mb-4 h-32 w-32 self-center rounded-lg"
            />
          )}

          <TouchableOpacity
            onPress={() => void pickImage()}
            className="mb-2 rounded-md bg-purple-600 p-3">
            <Text className="text-center text-white">Choisir une image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => void takePhoto()}
            className="mb-4 rounded-md bg-green-600 p-3">
            <Text className="text-center text-white">Prendre une photo</Text>
          </TouchableOpacity>

          <View className="mb-4 gap-1.5">
            <Label htmlFor="name">Nom de la filmothèque</Label>
            <Controller
              control={form.control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  id="name"
                  placeholder="Ex: Mes films préférés"
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
            <TouchableOpacity onPress={onClose} className="mr-2 flex-1 rounded-md bg-gray-400 p-3">
              <Text className="text-center text-white">Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void form.handleSubmit(handleSubmit)()}
              className="ml-2 flex-1 rounded-md bg-blue-600 p-3">
              <Text className="text-center text-white">Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
