import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Input } from '../input';
import { SocialConnections } from './social-connections';
import { Label } from '../label';
import { Button } from '../button';
import { Text } from '../text';
import { Separator } from '../separator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from "react-hook-form";
import { CreateAccountDto, createAccountSchema } from '../../../../packages/src/dtos/user.dto';
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from 'utils/clients/client';
import { queryClient } from 'context/query-client';
import { queryKeys } from '../../../../packages/src/query-client';
import { isFetchError } from '@ts-rest/react-query/v5';
import { useToast } from '../toast';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from 'context/auth-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';

type NavProp = NativeStackNavigationProp<RootStackParamList, "Register">;

export function SignUpForm() {
  const { showToast } = useToast();
  const navigation = useNavigation<NavProp>()
  const insets = useSafeAreaInsets();
  const { setToken, setUser } = useAuth();

  const form = useForm<CreateAccountDto>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      avatarUrl: null,
    }
  });

  const { mutate } = client.auth.register.useMutation({
    onSuccess: ({ body }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.auth.register(),
      });
      form.reset();
      showToast("Compte créé avec succès !", 2000, "success");
      setToken(body.token);
      setUser(body.user);
      navigation.navigate("Movie");
      return;
    },

    onError: (error) => {
      if (isFetchError(error)) {
        showToast(`Erreur lors de la création du compte : ${error.message}`, 4000, "error");
        return;
      }
    },
  });

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit(data: CreateAccountDto) {
    mutate({body: data});
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="gap-6">
        <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">Créer votre compte</CardTitle>
            <CardDescription className="text-center sm:text-left">
              Bienvenu ! Veuillez remplir les informations pour commencer.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">

              <View className="gap-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={onEmailSubmitEditing}
                    />
                  )}
                />
                {form.formState.errors.firstName && <Text className="text-red-500">{form.formState.errors.firstName.message}</Text>}
              </View>

              <View className="gap-1.5">
                <Label htmlFor="lastName">Nom</Label>
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={onEmailSubmitEditing}
                    />
                  )}
                />
                {form.formState.errors.lastName && <Text className="text-red-500">{form.formState.errors.lastName.message}</Text>}
              </View>

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
                {form.formState.errors.email && <Text className="text-red-500">{form.formState.errors.email.message}</Text>}
              </View>

              <View className="gap-1.5">
                <Label htmlFor="username">Pseudo</Label>
                <Controller
                  control={form.control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      id="username"
                      placeholder="JeanDupont"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                      onSubmitEditing={onEmailSubmitEditing}
                    />
                  )}
                />
                {form.formState.errors.username && <Text className="text-red-500">{form.formState.errors.username.message}</Text>}
              </View>

              <View className="gap-1.5">
                <Label htmlFor="password">Mot de passe</Label>
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
                    />
                  )}
                />
                {form.formState.errors.password && <Text className="text-red-500">{form.formState.errors.password.message}</Text>}
              </View>

              <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
                <Text>Continue</Text>
              </Button>
            </View>
            <Text className="text-center text-sm">
              Vous avez déjà un compte?{" "}
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text className="text-sm underline underline-offset-4">Se connecter</Text>
              </Pressable>
            </Text>

            <View className="flex-row items-center">
              <Separator className="flex-1" />
              <Text className="text-muted-foreground px-4 text-sm">or</Text>
              <Separator className="flex-1" />
            </View>

            <SocialConnections />
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
