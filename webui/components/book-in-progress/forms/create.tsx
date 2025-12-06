import React from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { CreateBookInProgressDto, createBookInProgressSchema } from "../../../../packages/src/dtos/bookInProgress.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "context/auth-context";

type CreateBookInProgressProps = {
  visible: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    imageLink: string | null;
  } | null;
};

export function CreateBookInProgress({ visible, onClose, book }: CreateBookInProgressProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<CreateBookInProgressDto>({
    resolver: zodResolver(createBookInProgressSchema),
    defaultValues: {
      bookId: book?.id ?? "",
      currentPage: 0,
    },
  });

  const { mutate } = client.booksInProgress.createBookInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.booksInProgress.getAllBooksInProgress(),
      });
      form.reset();
      showToast("Le livre a été ajouté à la liste des livres en cours !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de l'ajout du livre : ${error.message}`, 4000, "error");
      }
    },
  });

  const imageUri = book?.imageLink
    ? book.imageLink
    : "https://via.placeholder.com/100x150?text=No+Image";

  function onSubmit(data: CreateBookInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
      return;
    }

    mutate({
      params: { userId: user.id },
      body: {
        bookId: String(book?.id ?? "0"),
        currentPage: data.currentPage,
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Livre en cours</Text>

          {book && (
            <View className="items-center mb-4">
              <Image
                source={{ uri: imageUri }}
                className="w-32 h-48 rounded-md mb-2"
                resizeMode="cover"
              />
              <Text className="text-md font-semibold">{book.title}</Text>
            </View>
          )}

          <View className="gap-1.5 mb-4">
            <Label htmlFor="viewingTime">Pages lus</Label>
            <Controller
              control={form.control}
              name="currentPage"
              render={({ field: { onChange, value } }) => (
                <Input
                  id="currentPage"
                  placeholder="Pages lus"
                  keyboardType="numeric"
                  value={value ? String(value) : ""}
                  onChangeText={(text) => onChange(Number(text))}
                  returnKeyType="done"
                />
              )}
            />
            {form.formState.errors.currentPage && (
              <Text className="text-red-500">{form.formState.errors.currentPage.message}</Text>
            )}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="bg-gray-400 p-3 rounded-md flex-1 mr-2">
              <Text className="text-white text-center">Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={form.handleSubmit(onSubmit)}
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
