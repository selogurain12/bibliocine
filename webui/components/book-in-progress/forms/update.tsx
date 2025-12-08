import React, { useEffect } from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { BookInProgressDto, UpdateBookInProgressDto, updateBookInProgressSchema } from "../../../../packages/src/dtos/bookInProgress.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "context/auth-context";
import { BookDto } from "../../../../packages/src/dtos/book.dto";

type UpdateBookInProgressProps = {
  visible: boolean;
  onClose: () => void;
  book: BookDto | null;
  bookInProgress: BookInProgressDto;
};

export function UpdateBookInProgress({ visible, onClose, book, bookInProgress }: UpdateBookInProgressProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<UpdateBookInProgressDto>({
    resolver: zodResolver(updateBookInProgressSchema),
    defaultValues: {
      bookId: bookInProgress.bookId,
      currentPage: bookInProgress.currentPage,
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        bookId: bookInProgress.bookId,
        currentPage: bookInProgress.currentPage,
      });
    }
  }, [visible, bookInProgress, form]);

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { mutate } = client.booksInProgress.updateBookInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.booksInProgress.getAllBooksInProgress(),
      });
      form.reset();
      showToast("Le nombre de pages lus a été modifié !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification : ${error.message}`, 4000, "error");
      }
    },
  });

  const { data: stats} = client.stats.simpleStats.useQuery({
      queryKey: queryKeys.stats.simpleStats({
        pathParams: { userId: user.id }
      }),
      queryData: { params: { userId: user.id }},
    })
  
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
    
                  const { mutate: deleteBookInProgress } = client.booksInProgress.deleteBookInProgress.useMutation({
                      onSuccess: () => {
                          void queryClient.invalidateQueries({
                              queryKey: queryKeys.booksInProgress.getAllBooksInProgress(),
                          });
                          showToast("Livre est supprimé de la liste des livres en cours !", 2000, "success");
                          onClose();
                      },
                      onError: (error) => {
                          console.error("Error marking book as finished:", error);
                      },
                  });

  const imageUri = book?.imageLink
    ? book.imageLink
    : "https://via.placeholder.com/100x150?text=No+Image";

  function onSubmit(data: UpdateBookInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour modifier un livre", 2000, "error");
      return;
    }

    if(book !== null && book !== undefined) {
      if(book.pageCount <= 0) {
        showToast("Le nombre de pages lues doit être supérieur à zéro.", 2000, "error");
        return;
      }
      if(data.currentPage !== undefined && data.currentPage > book.pageCount) {
        showToast("Le nombre de pages lues ne peut pas dépasser le nombre total de pages du livre.", 2000, "error");
        return;
      }
      if(data.currentPage === book.pageCount) {
        finishedBook({
          params: { userId: user.id },
          body: {
            bookId: book.id,
          },
        });
        deleteBookInProgress({
          params: { id: bookInProgress.id, userId: user.id },
        });
      }
      else {
        updateStats({
      params: { userId: user.id, id: statsId },
      body: {
        pagesRead: (data.currentPage ?? bookInProgress.currentPage) - bookInProgress.currentPage,
      }
    })

    mutate({
      params: { id: bookInProgress.id, userId: user.id },
      body: {
        bookId: bookInProgress.bookId,
        currentPage: data.currentPage,
      },
    });
      }
    }
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
            <Label htmlFor="currentPage">Pages lus</Label>
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
              <Text className="text-white text-center">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
