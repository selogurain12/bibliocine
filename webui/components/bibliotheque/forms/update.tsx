import { Modal, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
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
  BibliothequeDto,
  UpdateBibliothequeDto,
  updateBibliothequeSchema,
} from "../../../../packages/src/dtos/bibliotheque.dto";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";

type UpdateBibliothequeProps = {
  bibliotheque: BibliothequeDto;
  visible: boolean;
  onClose: () => void;
};

export function UpdateBibliotheque({ bibliotheque, visible, onClose }: UpdateBibliothequeProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    void (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

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
    if (isSubmitting) return;

    setIsSubmitting(true);

    let imageUrl = bibliotheque.imageUrl;

    if (data.imageUrl && data.imageUrl !== bibliotheque.imageUrl) {
      imageUrl = await uploadToCloudinary(data.imageUrl);
    }

    mutate(
      {
        params: { id: bibliotheque.id, userId: user.id },
        body: {
          name: data.name,
          imageUrl,
          books: bibliotheque.books,
        },
      },
      {
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Modifier une bibliothèque</Text>

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
