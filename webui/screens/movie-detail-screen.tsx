import { MovieDetails } from "components/movie/movie-details";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "App";
import { AppContent } from "./app-content";

export function MovieDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "MovieDetail">>();
  const { id } = route.params;
  return (
    <AppContent>
      <MovieDetails id={id} />
    </AppContent>
  );
}
