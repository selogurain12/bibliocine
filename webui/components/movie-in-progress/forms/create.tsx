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
  CreateMovieInProgressDto,
  createMovieInProgressSchema,
} from "../../../../packages/src/dtos/movieInProgress.dto";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { MovieDto } from "../../../../packages/src/dtos/movie.dto";

type CreateMovieInProgressProps = {
  visible: boolean;
  onClose: () => void;
  movie: MovieDto | null;
};

export function CreateMovieInProgress({ visible, onClose, movie }: CreateMovieInProgressProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<CreateMovieInProgressDto>({
    resolver: zodResolver(createMovieInProgressSchema),
    defaultValues: {
      movieId: String(movie?.id ?? 0),
      viewingTime: 0,
    },
  });

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { mutate } = client.moviesInProgress.createMovieInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress(),
      });
      form.reset();
      showToast("Le film a été ajouté à la liste des films en cours !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      showToast(`Erreur lors de l'ajout du film : ${error.body.message}`, 4000, "error");
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

  const { mutate: finishedMovie } = client.finishedMovie.createFinishedMovie.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress(),
      });
      showToast("Film est marqué comme terminé !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      showToast(
        `Erreur lors du marquage du film comme terminé : ${error.body.message}`,
        4000,
        "error"
      );
    },
  });

  const imageUri = movie?.posterPath
    ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
    : "https://via.placeholder.com/100x150?text=No+Image";

  function onSubmit(data: CreateMovieInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
      return;
    }

    if (movie !== null) {
      if ((movie.runtime ?? 0) <= 0) {
        showToast("Le temps de visionnage doit être supérieur à zéro.", 2000, "error");
        return;
      }
      if (data.viewingTime > (movie.runtime ?? 0)) {
        showToast(
          "Le temps de visionnage ne peut pas dépasser la durée totale du film.",
          2000,
          "error"
        );
        return;
      }
      if (data.viewingTime === (movie.runtime ?? 0)) {
        finishedMovie({
          params: { userId: user.id },
          body: {
            movieId: data.movieId,
          },
        });
      } else {
        mutate(
          {
            params: { userId: user.id },
            body: {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
              movieId: String(movie.id),
              viewingTime: data.viewingTime,
            },
          },
          {
            onSuccess: () => {
              updateStats({
                params: { userId: user.id, id: statsId },
                body: {
                  timeSeen: data.viewingTime,
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
          <Text className="mb-4 text-lg font-bold">Film en cours</Text>

          {movie && (
            <View className="mb-4 items-center">
              <Image
                source={{ uri: imageUri }}
                className="mb-2 h-48 w-32 rounded-md"
                resizeMode="cover"
              />
              <Text className="text-md font-semibold">{movie.title}</Text>
            </View>
          )}

          <View className="mb-4 gap-1.5">
            <Label htmlFor="viewingTime">Temps vu</Label>
            <Controller
              control={form.control}
              name="viewingTime"
              render={({ field: { onChange, value } }) => (
                <Input
                  id="viewingTime"
                  placeholder="Temps vu en minutes"
                  keyboardType="numeric"
                  value={value ? String(value) : ""}
                  onChangeText={(text) => {
                    onChange(Number(text));
                  }}
                  returnKeyType="done"
                />
              )}
            />
            {form.formState.errors.viewingTime && (
              <Text className="text-red-500">{form.formState.errors.viewingTime.message}</Text>
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
