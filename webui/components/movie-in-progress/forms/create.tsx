import React from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { CreateMovieInProgressDto, createMovieInProgressSchema } from "../../../../packages/src/dtos/movieInProgress.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "context/auth-context";
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
      movieId: String(movie?.id) ?? "",
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
      if (isFetchError(error)) {
        showToast(`Erreur lors de l'ajout du film : ${error.message}`, 4000, "error");
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

  const imageUri = movie?.posterPath
    ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
    : "https://via.placeholder.com/100x150?text=No+Image";

  console.log(form.formState.errors);

  console.log(form.getValues());

  function onSubmit(data: CreateMovieInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour ajouter un film", 2000, "error");
      return;
    }
    console.log("Movie:", data.movieId, "Viewing Time:", data.viewingTime);

    if(movie !== null && movie !== undefined) {
      if((movie.runtime ?? 0) <= 0) {
        showToast("Le temps de visionnage doit être supérieur à zéro.", 2000, "error");
        return;
      }
      if(data.viewingTime > (movie.runtime ?? 0)) {
        showToast("Le temps de visionnage ne peut pas dépasser la durée totale du film.", 2000, "error");
        return;
      }
      if(data.viewingTime === (movie.runtime ?? 0)) {
        finishedMovie({
          params: { userId: user.id },
          body: {
            movieId: data.movieId,
          },
        });
      } else {
        updateStats({
      params: { userId: user.id, id: statsId },
      body: {
        timeSeen: data.viewingTime,
      }
    })

    mutate({
      params: { userId: user.id },
      body: {
        movieId: String(movie?.id) ?? "0",
        viewingTime: data.viewingTime,
      },
    });
      }
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-3/4">
          <Text className="text-lg font-bold mb-4">Film en cours</Text>

          {movie && (
            <View className="items-center mb-4">
              <Image
                source={{ uri: imageUri }}
                className="w-32 h-48 rounded-md mb-2"
                resizeMode="cover"
              />
              <Text className="text-md font-semibold">{movie.title}</Text>
            </View>
          )}

          <View className="gap-1.5 mb-4">
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
                  onChangeText={(text) => onChange(Number(text))}
                  returnKeyType="done"
                />
              )}
            />
            {form.formState.errors.viewingTime && (
              <Text className="text-red-500">{form.formState.errors.viewingTime.message}</Text>
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
