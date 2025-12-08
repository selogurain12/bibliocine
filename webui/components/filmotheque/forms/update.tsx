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
  FilmothequeDto,
  UpdateFilmothequeDto,
  updateFilmothequeSchema,
} from "../../../../packages/src/dtos/filmotheque.dto";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";

type UpdateFilmothequeProps = {
  filmotheque: FilmothequeDto;
  visible: boolean;
  onClose: () => void;
};

export function UpdateFilmotheque({ filmotheque, visible, onClose }: UpdateFilmothequeProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<UpdateFilmothequeDto>({
    resolver: zodResolver(updateFilmothequeSchema),
    defaultValues: {
      name: filmotheque.name,
      imageUrl: filmotheque.imageUrl,
    },
  });

  const image = form.watch("imageUrl");

  useEffect(() => {
    void (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    if (visible) {
      form.reset({
        name: filmotheque.name,
        imageUrl: filmotheque.imageUrl,
      });
    }
  }, [visible, filmotheque, form]);

  if (!user) {
    showToast("Vous devez être connecté pour modifier une filmothèque", 2000, "error");
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
      form.setValue("imageUrl", result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      form.setValue("imageUrl", result.assets[0].base64);
    }
  };

  const { mutate } = client.filmotheque.updateFilmotheque.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.filmotheque.getAllFilmotheques({
          pathParams: { userId: user.id },
        }),
      });

      form.reset();
      showToast("La filmothèque a bien été modifiée !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification : ${error.message}`, 4000, "error");
      }
    },
  });

  async function handleSubmit(data: UpdateFilmothequeDto) {
    if (!user) {
      showToast("Vous devez être connecté pour modifier une filmothèque", 2000, "error");
      return;
    }

    let imageUrl = filmotheque.imageUrl;

    if (data.imageUrl && data.imageUrl !== filmotheque.imageUrl) {
      imageUrl = await uploadToCloudinary(data.imageUrl);
    }

    mutate({
      params: { id: filmotheque.id, userId: user.id },
      body: {
        name: data.name,
        imageUrl,
        movies: filmotheque.movies,
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Modifier une filmothèque</Text>

          {image && (
            <Image
              source={{
                uri:
                  image.startsWith("http") || image.startsWith("https")
                    ? image
                    : `data:image/jpeg;base64,${image}`,
              }}
              className="mb-4 h-32 w-32 self-center rounded-lg"
            />
          )}

          <TouchableOpacity
            onPress={() => void pickImage()}
            className="mb-2 rounded-md bg-purple-600 p-3">
            <Text className="text-center text-white">Changer l’image</Text>
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
              rules={{ required: "Le nom est obligatoire" }}
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
              <Text className="text-center text-white">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
