import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "context/auth-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { queryClient } from "context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MovieInProgressDto } from "../../../packages/src/dtos/movieInProgress.dto";
import { MovieDto } from "../../../packages/src/dtos/movie.dto";
import { useToast } from "../ui/toast";
import { queryKeys } from "../../../packages/src/query-client";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { UpdateMovieInProgress } from "./forms/update";

type NavProp = NativeStackNavigationProp<RootStackParamList, "MovieInProgress">;

export function MovieInProgress() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const [moviesDetails, setMoviesDetails] = useState<MovieDto[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const [selectedMovieInProgress, setSelectedMovieInProgress] = useState<MovieInProgressDto | null>(
    null
  );
  const [selectedMovie, setSelectedMovie] = useState<MovieDto | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { data, isLoading } = client.moviesInProgress.getAllMoviesInProgress.useQuery({
    queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress({
      pathParams: { userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "" } },
    enabled: !!user,
  });

  const { mutate: deleteMovie } = client.moviesInProgress.deleteMovieInProgress.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.moviesInProgress.getAllMoviesInProgress({
          pathParams: { userId: user?.id ?? "" },
        }),
      });
      showToast("Film supprimé de vos films en cours", 2000, "success");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur: ${error.message}`, 2000, "error");
      }
    },
  });

  function handleDelete(itemId: string) {
    if (!user) {
      showToast("Vous devez être connecté", 2000, "error");
      return;
    }
    deleteMovie({ params: { id: itemId, userId: user.id } });
  }

  useEffect(() => {
    const fetchMovies = async () => {
      if (data?.body.data) {
        try {
          const results = await Promise.all(
            data.body.data.map(async (progress: MovieInProgressDto) => {
              const res = await client.movies.getMovie.query({
                params: { movieId: progress.movieId },
              });
              return res.body as MovieDto;
            })
          );
          setMoviesDetails(results);
        } catch (err) {
          console.error(err);
          showToast("Erreur lors du chargement des films", 2000, "error");
        } finally {
          setLoadingMovies(false);
        }
      }
    };

    void fetchMovies();
  }, [data, showToast]);

  if (!user) {
    showToast("Vous devez être connecté pour voir vos films en cours", 2000, "error");
    return null;
  }

  if (isLoading || loadingMovies) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderMovie = ({ item }: { item: MovieDto }) => {
    const movieProgress = data?.body.data.find(
      (movieprogress: MovieInProgressDto) => movieprogress.movieId === String(item.id)
    );

    return (
      <View className="m-2 flex-1 rounded-lg border border-gray-200 bg-white p-2 shadow">
        <TouchableOpacity
          className="items-center"
          onPress={() => {
            navigation.navigate("MovieDetail", { id: item.id });
          }}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }}
            style={{ width: 100, height: 150, borderRadius: 8 }}
          />
          <Text className="mt-2 text-center" numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View className="mt-2 flex-row justify-center">
          <TouchableOpacity
            onPress={() => {
              if (movieProgress) {
                setSelectedMovieInProgress(movieProgress);
                setEditModalVisible(true);
                setSelectedMovie(item);
              }
            }}
            className="p-2">
            <FontAwesome name="pencil" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (movieProgress) {
                handleDelete(movieProgress.id);
              }
            }}
            className="p-2">
            <FontAwesome name="trash" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="p-2">
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
        data={moviesDetails}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />

      {selectedMovieInProgress && (
        <UpdateMovieInProgress
          movie={selectedMovie}
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
          }}
          movieInProgress={selectedMovieInProgress}
        />
      )}
    </View>
  );
}
