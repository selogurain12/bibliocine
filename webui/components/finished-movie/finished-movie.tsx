import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { useAuth } from "context/auth-context";
import { useToast } from "../ui/toast";
import { useNavigation } from "@react-navigation/native";
import { MovieDto } from "../../../packages/src/dtos/movie.dto";
import { FinishedMovieDto } from "../../../packages/src/dtos/finishedMovie.dto";
import { FontAwesome } from "@expo/vector-icons";
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryClient } from "context/query-client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavProp = NativeStackNavigationProp<RootStackParamList, "FinishedMovie">;

export function FinishedMovie() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [moviesDetails, setMoviesDetails] = useState<MovieDto[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const { data, isLoading } = client.finishedMovie.getAllFinishedMovies.useQuery({
    queryKey: queryKeys.finishedMovie.getAllFinishedMovies({
      pathParams: { userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "" } },
    enabled: !!user,
  });

  const { mutate: deleteMovie } = client.finishedMovie.deleteFinishedMovie.useMutation({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.finishedMovie.getAllFinishedMovies({
            pathParams: { userId: user?.id ?? "" },
          }),
        });
        showToast("Film supprimé de vos films terminés", 2000, "success");
      },
      onError: (error) => {
        if (isFetchError(error)) {
          showToast(`Erreur: ${error.message}`, 2000, "error");
        }
      }
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
            data.body.data.map(async (finished: FinishedMovieDto) => {
              const res = await client.movies.getMovie.query({
                params: { movieId: finished.movieId },
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

    fetchMovies();
  }, [data, showToast]);

  if (!user) {
    showToast("Vous devez être connecté pour voir vos films en cours", 2000, "error");
    return null;
  }

  if (isLoading || loadingMovies) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderMovie = ({ item }: { item: MovieDto }) => {
    const finishedMovie = data?.body.data.find(
      (finished: FinishedMovieDto) => finished.movieId === String(item.id)
    );

    return (
      <View className="flex-1 m-2 bg-white rounded-lg shadow p-2 border border-gray-200">
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
        >
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }}
            style={{ width: 100, height: 150, borderRadius: 8 }}
          />
          <Text className="mt-2 text-center" numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-2">
          <TouchableOpacity
            onPress={() => {if(finishedMovie){
              handleDelete(finishedMovie.id )
            }}}
            className="p-2"
          >
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
    </View>
  );
}
