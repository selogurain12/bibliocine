import { View, Image, ActivityIndicator, ScrollView } from "react-native";
import { Text } from "../ui/text";
import { client } from "utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { Stars } from "../ui/stars";
import { SpeedDial } from "../ui/speed-dial/SpeedDial";
import { queryClient } from "context/query-client";
import { useAuth } from "context/auth-context";
import { useToast } from "../ui/toast";
import { useState } from "react";
import { CreateMovieInProgress } from "../movie-in-progress/forms/create";
import { AddInFilmotheque } from "../filmotheque/forms/add-in-filmotheque";

export function MovieDetails({id}: {id: string}) {
    const [isModalMovieInProgressVisible, setModalMovieInProgressVisible] = useState(false);
    const [isModalListFilmothequeVisible, setModalListFilmothequeVisible] = useState(false);
    const {user} = useAuth();
    const { showToast } = useToast();
    const {data, isLoading} = client.movies.getMovie.useQuery({
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
            console.error("Error marking movie as finished:", error);
        },
    });
    const item = data?.body;
    const imageUri = item?.posterPath
      ? `https://image.tmdb.org/t/p/original/${item.posterPath}`
      : "https://via.placeholder.com/100x150?text=No+Image";

    function markAsFinished() {
        if (user) {
            mutate({
                params: { userId: user.id },
                body: {
                    movieId: String(item?.id) ?? "0",
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
                                className="w-full aspect-[2/3] rounded-md mb-4"
                                resizeMode="cover" />
                        </View>
                        <View className="w-1/2 pl-2">
                            <Text className="text-xl font-bold mb-2">{item?.title}</Text>
                            <Text className="text-md mb-2">Titre originale: {item?.originalTitle}</Text>
                            <Text className="text-md mb-2">Langue original: {item?.originalLanguage}</Text>
                            <Text className="text-md mb-2">Date de sortie: {item?.releaseDate}</Text>
                        </View>
                    </View>
                    <Text className="mb-2">
                        <Text className="font-bold">Genre: </Text>{item?.genreIds?.join(", ")}
                    </Text>
                    <Text className="mb-2">
                        <Text className="font-bold">Résumé: </Text>{item?.overview}
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Budget: </Text>{item?.budget} $
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Revenu: </Text>{item?.revenue} $
                    </Text>
                    <Text className="mb-4">
                        <Text className="font-bold">Durée: </Text>{item?.runtime} minutes
                    </Text>
                    <View className="mb-4 flex-row items-center">
                        <Text className="font-bold">Votes: </Text>
                        <Stars rating={item?.voteAverage ?? 0} />
                    </View>
                </ScrollView>
                {user &&
                    <SpeedDial
                        actions={[
                            { icon: "bookmark", label: "Ajouter à une filmotheque", onPress: () => setModalListFilmothequeVisible(true) },
                            { icon: "clock-o", label: "Je suis en train de voir ce film", onPress: () => setModalMovieInProgressVisible(true) },
                            { icon: "check", label: "J'ai terminé ce film", onPress: () => markAsFinished() },
                    ]} />
                }
                <CreateMovieInProgress
                    visible={isModalMovieInProgressVisible}
                    onClose={() => setModalMovieInProgressVisible(false)}
                    movie={item ? { id: String(item.id), title: item.title, posterPath: item.posterPath } : null}
                />
                <AddInFilmotheque
                    visible={isModalListFilmothequeVisible}
                    onClose={() => setModalListFilmothequeVisible(false)}
                    movieId={String(item?.id)}
                />
            </View>
        )}
    </View>
  );
}