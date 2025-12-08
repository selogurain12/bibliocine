import React from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  CreateFilmothequeDto,
  createFilmothequeSchema,
} from "../../../../packages/src/dtos/filmotheque.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { useAuth } from "context/auth-context";
import { isFetchError } from "@ts-rest/react-query/v5";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "utils/upload-image";

type CreateFilmothequeProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateFilmotheque({
  visible,
  onClose,
}: CreateFilmothequeProps) {
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
      form.setValue("imageUrl", result.assets[0].base64!);
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
        showToast(
          `Erreur lors de la création : ${error.message}`,
          4000,
          "error"
        );
      }
    },
  });

  async function handleSubmit(data: CreateFilmothequeDto) {
    if (!user) return;

    let imageUrl: string | null = null;

    if (data.imageUrl) {
      imageUrl = await uploadToCloudinary(data.imageUrl);
    }
    console.log("Submitting data:", imageUrl);
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Nouvelle filmothèque</Text>

          {image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              className="w-32 h-32 rounded-lg self-center mb-4"
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            className="bg-purple-600 p-3 rounded-md mb-4"
          >
            <Text className="text-white text-center">Choisir une image</Text>
          </TouchableOpacity>

          <View className="gap-1.5 mb-4">
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
              <Text className="text-red-500">
                {form.formState.errors.name.message}
              </Text>
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
              onPress={() => form.handleSubmit(handleSubmit, (errors) => {
                console.log("Form errors:", errors);
              })()}
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
