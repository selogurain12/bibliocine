import "./global.css";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

import { queryClient } from "context/query-client";
import { ToastProvider } from "components/ui/toast";
import { AuthProvider } from "context/auth-context";

import { SignUpForm } from "components/ui/authentification/sign-up-form";
import { SignInForm } from "components/ui/authentification/sign-in-form";

import { BooksInBibliothequeScreen } from "screens/bibliotheque-book-screen";
import { BibliothequesScreen } from "screens/bibliotheques-screen";
import { BookDetailScreen } from "screens/book-detail-screen";
import { BookInProgressScreen } from "screens/book-in-progress";
import { BookScreen } from "screens/book-screen";
import { CollectionsScreen } from "screens/collections-scrren";
import { MoviesInFilmothequeScreen } from "screens/filmotheque-movie-screen";
import { FilmothequesScreen } from "screens/filmotheques-screen";
import { FinishedBookScreen } from "screens/finished-book-screen";
import { FinishedMovieScreen } from "screens/finished-movie-screen";
import { MovieDetailScreen } from "screens/movie-detail-screen";
import { MovieInProgressScreen } from "screens/movie-in-progress";
import { MovieScreen } from "screens/movies-screen";
import { StatistiquesScreen } from "screens/statistiques-screen";

import { client } from "utils/clients/client";

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  MovieDetail: { id: string };
  BookDetail: { id: string };
  Movie: undefined;
  Book: undefined;
  Collection: undefined;
  Filmotheques: undefined;
  MoviesInFilmotheque: { id: string };
  Bibliotheques: undefined;
  BooksInBibliotheque: { id: string };
  MovieInProgress: undefined;
  BookInProgress: undefined;
  FinishedMovie: undefined;
  FinishedBook: undefined;
  Statistiques: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== Notifications.PermissionStatus.GRANTED) return;

  const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } }).eas
    ?.projectId;
  if (!projectId) return;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}

function RootStack() {
  useEffect(() => {
    void registerForPushNotificationsAsync().then((token) => {
      if (token) {
        void client.notification.registerToken.mutate({ body: { token } });
      }
    });
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Movie" component={MovieScreen} />
      <Stack.Screen name="Book" component={BookScreen} />
      <Stack.Screen name="Register" component={SignUpForm} />
      <Stack.Screen name="Login" component={SignInForm} />
      <Stack.Screen name="Statistiques" component={StatistiquesScreen} />
      <Stack.Screen name="Collection" component={CollectionsScreen} />
      <Stack.Screen name="Filmotheques" component={FilmothequesScreen} />
      <Stack.Screen name="Bibliotheques" component={BibliothequesScreen} />
      <Stack.Screen name="MovieInProgress" component={MovieInProgressScreen} />
      <Stack.Screen name="BookInProgress" component={BookInProgressScreen} />
      <Stack.Screen name="FinishedMovie" component={FinishedMovieScreen} />
      <Stack.Screen name="FinishedBook" component={FinishedBookScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="MoviesInFilmotheque" component={MoviesInFilmothequeScreen} />
      <Stack.Screen name="BooksInBibliotheque" component={BooksInBibliothequeScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <PortalHost name="root" />
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
