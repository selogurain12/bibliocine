import { Modal, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "context/auth-context";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  CreateBookInProgressDto,
  createBookInProgressSchema,
} from "../../../../packages/src/dtos/bookInProgress.dto";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { BookDto } from "../../../../packages/src/dtos/book.dto";

type CreateBookInProgressProps = {
  visible: boolean;
  onClose: () => void;
  book: BookDto | null;
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

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

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

  const { data: stats } = client.stats.simpleStats.useQuery({
    queryKey: queryKeys.stats.simpleStats({
      pathParams: { userId: user.id },
    }),
    queryData: { params: { userId: user.id } },
  });

  const statsId = stats?.body.id ?? "";

  const { mutate: updateStats } = client.stats.updateStats.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.stats.updateStats(),
      });
      form.reset();
      showToast("Les stats ont bien été mise à jour !", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification des stats : ${error.message}`, 4000, "error");
      }
    },
  });

  const { mutate: finishedBook } = client.finishedBook.createFinishedBook.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.booksInProgress.getAllBooksInProgress(),
      });
      showToast("Livre est marqué comme terminé !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      console.error("Error marking book as finished:", error);
    },
  });

  const imageUri = book?.imageLink ?? "https://via.placeholder.com/100x150?text=No+Image";

  function onSubmit(data: CreateBookInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
      return;
    }
    if (book !== null) {
      if (book.pageCount <= 0) {
        showToast("Le nombre de pages lues doit être supérieur à zéro.", 2000, "error");
        return;
      }
      if (data.currentPage > book.pageCount) {
        showToast(
          "Le nombre de pages lues ne peut pas dépasser le nombre total de pages du livre.",
          2000,
          "error"
        );
        return;
      }
      if (data.currentPage === book.pageCount) {
        finishedBook({
          params: { userId: user.id },
          body: {
            bookId: data.bookId,
          },
        });
      } else {
        mutate(
          {
            params: { userId: user.id },
            body: {
              bookId: book.id,
              currentPage: data.currentPage,
            },
          },
          {
            onSuccess: () => {
              updateStats({
                params: { userId: user.id, id: statsId },
                body: {
                  pagesRead: data.currentPage,
                },
              });
            },
          }
        );
      }
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-3/4 rounded-lg bg-white p-6">
          <Text className="mb-4 text-lg font-bold">Livre en cours</Text>

          {book && (
            <View className="mb-4 items-center">
              <Image
                source={{ uri: imageUri }}
                className="mb-2 h-48 w-32 rounded-md"
                resizeMode="cover"
              />
              <Text className="text-md font-semibold">{book.title}</Text>
            </View>
          )}

          <View className="mb-4 gap-1.5">
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
                  onChangeText={(text) => {
                    onChange(Number(text));
                  }}
                  returnKeyType="done"
                />
              )}
            />
            {form.formState.errors.currentPage && (
              <Text className="text-red-500">{form.formState.errors.currentPage.message}</Text>
            )}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="mr-2 flex-1 rounded-md bg-gray-400 p-3">
              <Text className="text-center text-white">Fermer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void form.handleSubmit(onSubmit)()}
              className="ml-2 flex-1 rounded-md bg-blue-600 p-3">
              <Text className="text-center text-white">Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
