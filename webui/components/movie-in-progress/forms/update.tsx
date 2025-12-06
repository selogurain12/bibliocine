import React from "react";
import { Modal, View, TouchableOpacity, Image } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { MovieInProgressDto, UpdateMovieInProgressDto, updateMovieInProgressSchema } from "../../../../packages/src/dtos/movieInProgress.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { queryKeys } from "../../../../packages/src/query-client";
import { useToast } from "../../ui/toast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "context/auth-context";

type UpdateMovieInProgressProps = {
  visible: boolean;
  onClose: () => void;
  movie: {
    id: string;
    title: string;
    posterPath: string | null;
  } | null;
  movieInProgress: MovieInProgressDto;
};

export function UpdateMovieInProgress({ visible, onClose, movie, movieInProgress }: UpdateMovieInProgressProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const form = useForm<UpdateMovieInProgressDto>({
    resolver: zodResolver(updateMovieInProgressSchema),
    defaultValues: {
      movieId: movieInProgress.movieId,
      viewingTime: movieInProgress.viewingTime,
    },
  });

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

  const imageUri = movie?.posterPath
    ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
    : "https://via.placeholder.com/100x150?text=No+Image";

  function onSubmit(data: UpdateMovieInProgressDto) {
    if (!user) {
      showToast("Vous devez être connecté pour modifier un film", 2000, "error");
      return;
    }

    mutate({
      params: { id: movieInProgress.id, userId: user.id },
      body: {
        movieId: movieInProgress.movieId,
        viewingTime: data.viewingTime,
      },
    });
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
              <Text className="text-white text-center">Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
