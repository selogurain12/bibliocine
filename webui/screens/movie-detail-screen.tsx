import { MovieDetails } from "components/movie/movie-details";
import { AppContent } from "./app-content";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "App";

export function MovieDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "MovieDetail">>();
  const { id } = route.params;
  return (
    <AppContent>
      <MovieDetails id={id} />
    </AppContent>
  );
}