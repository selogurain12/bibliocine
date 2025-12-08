import { Image, Platform, View } from "react-native";
import { useColorScheme } from "nativewind";
import { cn } from "lib/utils";
import { Button } from "../button";

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: "oauth_apple",
    source: { uri: "https://img.clerk.com/static/apple.png?width=160" },
    useTint: true,
  },
  {
    type: "oauth_google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
  },
];

export function SocialConnections() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            onPress={() => {
              // TODO:Authenticate with social provider and navigate to protected screenifsuccessful
            }}>
            <Image
              className={cn("size-4", strategy.useTint && Platform.select({ web: "dark:invert" }))}
              tintColor={Platform.select({
                // eslint-disable-next-line no-nested-ternary
                native: strategy.useTint ? (colorScheme === "dark" ? "white" : "black") : undefined,
              })}
              source={strategy.source}
            />
          </Button>
        );
      })}
    </View>
  );
}
