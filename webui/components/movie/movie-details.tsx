import { View, Image, ActivityIndicator, ScrollView } from "react-native";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { useAuth } from "context/auth-context";
import { useState } from "react";
import { isFetchError } from "@ts-rest/react-query/v5";
import { Text } from "../ui/text";
import { queryKeys } from "../../../packages/src/query-client";
import { Stars } from "../ui/stars";
import { SpeedDial } from "../ui/speed-dial/speed-dial";
import { useToast } from "../ui/toast";
import { CreateMovieInProgress } from "../movie-in-progress/forms/create";
import { AddInFilmotheque } from "../filmotheque/forms/add-in-filmotheque";

// eslint-disable-next-line complexity
export function MovieDetails({ id }: { id: string }) {
  const [isModalMovieInProgressVisible, setModalMovieInProgressVisible] = useState(false);
  const [isModalListFilmothequeVisible, setModalListFilmothequeVisible] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  if (!user) {
    showToast("Vous devez être connecté pour accéder à ce film", 2000, "error");
    return null;
  }
  const { data, isLoading } = client.movies.getMovie.useQuery({
    queryKey: queryKeys.movies.getMovie({
      pathParams: { movieId: id },
    }),
    queryData: {
      params: { movieId: id },
    },
  });
  const { mutate } = client.finishedMovie.createFinishedMovie.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.finishedMovie.getAllFinishedMovies(),
      });
      showToast("Film est marqué comme terminé !", 2000, "success");
    },
    onError: (error) => {
      showToast(
        `Erreur lors du marquage du film comme terminé : ${error.body.message}`,
        4000,
        "error"
      );
    },
  });
  const item = data?.body;
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
      showToast("Les stats ont bien été mise à jour !", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la modification des stats : ${error.message}`, 4000, "error");
      }
    },
  });
  const imageUri = item?.posterPath
    ? `https://image.tmdb.org/t/p/original/${item.posterPath}`
    : "https://via.placeholder.com/100x150?text=No+Image";

  function markAsFinished() {
    if (user) {
      updateStats({
        params: { userId: user.id, id: statsId },
        body: {
          timeSeen: item?.runtime ?? 0,
        },
      });
      mutate({
        params: { userId: user.id },
        body: {
          movieId: String(item?.id ?? 0),
        },
      });
    } else {
      console.error("User not authenticated");
    }
  }
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View className="h-full w-full p-0">
          <ScrollView className="p-4">
            <View className="flex-row flex-wrap">
              <View className="w-1/2 pr-2">
                <Image
                  source={{ uri: imageUri }}
                  className="mb-4 aspect-[2/3] w-full rounded-md"
                  resizeMode="cover"
                />
              </View>
              <View className="w-1/2 pl-2">
                <Text className="mb-2 text-xl font-bold">{item?.title}</Text>
                <Text className="text-md mb-2">Titre originale: {item?.originalTitle}</Text>
                <Text className="text-md mb-2">Langue original: {item?.originalLanguage}</Text>
                <Text className="text-md mb-2">Date de sortie: {item?.releaseDate}</Text>
              </View>
            </View>
            <Text className="mb-2">
              <Text className="font-bold">Genre: </Text>
              {item?.genreIds.join(", ")}
            </Text>
            <Text className="mb-2">
              <Text className="font-bold">Résumé: </Text>
              {item?.overview}
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Budget: </Text>
              {item?.budget} $
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Revenu: </Text>
              {item?.revenue} $
            </Text>
            <Text className="mb-4">
              <Text className="font-bold">Durée: </Text>
              {item?.runtime} minutes
            </Text>
            <View className="mb-4 flex-row items-center">
              <Text className="font-bold">Votes: </Text>
              <Stars rating={item?.voteAverage ?? 0} />
            </View>
          </ScrollView>
          <SpeedDial
            actions={[
              {
                icon: "bookmark",
                label: "Ajouter à une filmotheque",
                onPress: () => {
                  setModalListFilmothequeVisible(true);
                },
              },
              {
                icon: "clock-o",
                label: "Je suis en train de voir ce film",
                onPress: () => {
                  setModalMovieInProgressVisible(true);
                },
              },
              {
                icon: "check",
                label: "J'ai terminé ce film",
                onPress: () => {
                  markAsFinished();
                },
              },
            ]}
          />
          <CreateMovieInProgress
            visible={isModalMovieInProgressVisible}
            onClose={() => {
              setModalMovieInProgressVisible(false);
            }}
            movie={item ?? null}
          />
          <AddInFilmotheque
            visible={isModalListFilmothequeVisible}
            onClose={() => {
              setModalListFilmothequeVisible(false);
            }}
            movieId={String(item?.id)}
          />
        </View>
      )}
    </View>
  );
}
