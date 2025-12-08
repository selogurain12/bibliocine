import { BookDetails } from "components/book/book-details";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "App";
import { AppContent } from "./app-content";

export function BookDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "BookDetail">>();
  const { id } = route.params;
  return (
    <AppContent>
      <BookDetails id={id} />
    </AppContent>
  );
}
