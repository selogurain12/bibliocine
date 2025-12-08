/* eslint-disable max-len */
import { Pressable, TextInput, View } from "react-native";
import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "utils/clients/client";
import { queryClient } from "context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "context/auth-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { LoginDto, loginSchema } from "../../../../packages/src/dtos/user.dto";
import { useToast } from "../toast";
import { queryKeys } from "../../../../packages/src/query-client";
import { Separator } from "../separator";
import { Text } from "../text";
import { Button } from "../button";
import { Label } from "../label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Input } from "../input";
import { SocialConnections } from "./social-connections";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export function SignInForm() {
  const { showToast } = useToast();
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { setToken, setUser } = useAuth();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate } = client.auth.login.useMutation({
    onSuccess: ({ body }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.auth.login(),
      });
      form.reset();
      showToast("Connexion réussie ✅", 2000, "success");
      void setToken(body.token);
      void setUser(body.user);
      navigation.navigate("Movie");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur de connexion : ${error.message}`, 4000, "error");
      }
    },
  });

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit(data: LoginDto) {
    mutate({ body: data });
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="gap-6">
        <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">Connexion</CardTitle>
            <CardDescription className="text-center sm:text-left">
              Bienvenue ! Veuillez entrer vos identifiants pour continuer.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              <View className="gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      id="email"
                      placeholder="email@exemple.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={onEmailSubmitEditing}
                    />
                  )}
                />
                {form.formState.errors.email && (
                  <Text className="text-red-500">{form.formState.errors.email.message}</Text>
                )}
              </View>

              <View className="gap-1.5">
                <View className="flex-row items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </View>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="send"
                      onSubmitEditing={() => void form.handleSubmit(onSubmit)()}
                    />
                  )}
                />
                {form.formState.errors.password && (
                  <Text className="text-red-500">{form.formState.errors.password.message}</Text>
                )}
              </View>

              <Button className="w-full" onPress={() => void form.handleSubmit(onSubmit)()}>
                <Text>Continuer</Text>
              </Button>
            </View>

            <Text className="text-center text-sm">
              Pas encore de compte ?{" "}
              <Pressable
                onPress={() => {
                  navigation.navigate("Register");
                }}>
                <Text className="text-sm underline underline-offset-4">Créer un compte</Text>
              </Pressable>
            </Text>

            <View className="flex-row items-center">
              <Separator className="flex-1" />
              <Text className="px-4 text-sm text-muted-foreground">ou</Text>
              <Separator className="flex-1" />
            </View>

            <SocialConnections />
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
