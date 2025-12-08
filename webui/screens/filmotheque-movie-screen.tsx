import { MovieInFilmotheque } from "components/filmotheque/movie-in-filmotheque";
import { AppContent } from "./app-content";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "App";

export function MoviesInFilmothequeScreen() {
const route = useRoute<RouteProp<RootStackParamList, "MoviesInFilmotheque">>();
  const { id } = route.params;
  return (
    <AppContent>
      <MovieInFilmotheque id={id} />
    </AppContent>
  );
}