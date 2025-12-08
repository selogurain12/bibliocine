import { View, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "context/auth-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import { client } from "../../utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { useToast } from "../ui/toast";
import { MovieDto } from "../../../packages/src/dtos/movie.dto";

type NavProp = NativeStackNavigationProp<RootStackParamList, "MoviesInFilmotheque">;

export function MovieInFilmotheque({ id }: { id: string }) {
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [moviesDetails, setMoviesDetails] = useState<MovieDto[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const { data, isLoading } = client.filmotheque.getFilmotheque.useQuery({
    queryKey: queryKeys.filmotheque.getFilmotheque({
      pathParams: { id, userId: user?.id ?? "" },
    }),
    queryData: { params: { userId: user?.id ?? "", id } },
    enabled: !!user,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      if (data?.body.movies) {
        try {
          const results = await Promise.all(
            data.body.movies.map(async (movieId: string) => {
              const response = await client.movies.getMovie.query({
                params: { movieId },
              });
              return response.body as MovieDto;
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
    showToast("Vous devez être connecté", 2000, "error");
    return null;
  }

  if (isLoading || loadingMovies) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderMovie = ({ item }: { item: MovieDto }) => (
    <TouchableOpacity
      className="m-2 flex-1"
      onPress={() => {
        navigation.navigate("MovieDetail", { id: item.id });
      }}>
      <View className="items-center rounded-lg border border-gray-200 bg-white p-2 shadow">
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.posterPath}` }}
          style={{ width: 100, height: 150, borderRadius: 8 }}
        />
        <Text className="mt-2 text-center" numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
