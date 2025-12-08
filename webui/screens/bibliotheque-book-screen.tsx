import { BookInBibliotheque } from "components/bibliotheque/book-in-bibliotheque";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "App";
import { AppContent } from "./app-content";

export function BooksInBibliothequeScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "BooksInBibliotheque">>();
  const { id } = route.params;
  return (
    <AppContent>
      <BookInBibliotheque id={id} />
    </AppContent>
  );
}
