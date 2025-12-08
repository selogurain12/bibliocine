import { BookDetails } from "components/book/book-details";
import { AppContent } from "./app-content";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "App";

export function BookDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "BookDetail">>();
  const { id } = route.params;
  return (
    <AppContent>
      <BookDetails id={id} />
    </AppContent>
  );
}