import { Modal, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
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
  MovieInProgressDto,
  UpdateMovieInProgressDto,
  updateMovieInProgressSchema,
} from "../../../../packages/src/dtos/movieInProgress.dto";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { MovieDto } from "../../../../packages/src/dtos/movie.dto";

type UpdateMovieInProgressProps = {
  visible: boolean;
  onClose: () => void;
  movie: MovieDto | null;
  movieInProgress: MovieInProgressDto;
};

export function UpdateMovieInProgress({
  visible,
  onClose,
  movie,
  movieInProgress,
}: UpdateMovieInProgressProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<UpdateMovieInProgressDto>({
    resolver: zodResolver(updateMovieInProgressSchema),
    defaultValues: {
      movieId: movieInProgress.movieId,
      viewingTime: movieInProgress.viewingTime,
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        movieId: movieInProgress.movieId,
        viewingTime: movieInProgress.viewingTime,
      });
    }
  }, [visible, movieInProgress, form]);

  if (!user) {
    showToast("Vous devez être connecté pour ajouter un livre", 2000, "error");
    return null;
  }

  const { mutate } = client.moviesInProgress.updateMovieInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress(),
      });
      form.reset();
      showToast("Le temps vu a été modifié !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de l'ajout du film : ${error.message}`, 4000, "error");
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

  const { mutate: finishedMovie } = client.finishedMovie.createFinishedMovie.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress(),
      });
      showToast("Film est marqué comme terminé !", 2000, "success");
      onClose();
    },
    onError: (error) => {
      console.error("Error marking movie as finished:", error);
    },
  });

  const { mutate: deleteMovieInProgress } =
    client.moviesInProgress.deleteMovieInProgress.useMutation({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress(),
        });
        showToast("Film est supprimé de la liste des films en cours !", 2000, "success");
        onClose();
      },
      onError: (error) => {
        console.error("Error marking movie as finished:", error);
      },
    });

  const imageUri = movie?.posterPath
    ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
    : "https://via.placeholder.com/100x150?text=No+Image";

  // eslint-disable-next-line complexity
  function onSubmit(data: UpdateMovieInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour modifier un film", 2000, "error");
      return;
    }

    if (movie !== null) {
      if ((movie.runtime ?? 0) <= 0) {
        showToast("Le temps de visionnage doit être supérieur à zéro.", 2000, "error");
        return;
      }
      if (data.viewingTime !== undefined && data.viewingTime > (movie.runtime ?? 0)) {
        showToast(
          "Le temps de visionnage ne peut pas dépasser la durée totale du film.",
          2000,
          "error"
        );
        return;
      }
      if (data.movieId && data.viewingTime === (movie.runtime ?? 0)) {
        finishedMovie({
          params: { userId: user.id },
          body: {
            movieId: data.movieId,
          },
        });
        deleteMovieInProgress({
          params: { id: movieInProgress.id, userId: user.id },
        });
      } else {
        mutate(
          {
            params: { id: movieInProgress.id, userId: user.id },
            body: {
              movieId: movieInProgress.movieId,
              viewingTime: data.viewingTime,
            },
          },
          {
            onSuccess: () => {
              updateStats({
                params: { userId: user.id, id: statsId },
                body: {
                  timeSeen:
                    (data.viewingTime ?? movieInProgress.viewingTime) - movieInProgress.viewingTime,
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
              <Text className="text-center text-white">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
