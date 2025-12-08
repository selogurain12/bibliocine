import { View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

export function Stars({ rating }: { rating: number }) {
  const stars = [];
  const maxStars = 5;
  const normalized = Math.round(rating / 2);

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= normalized ? "star" : "star-o"}
        size={20}
        color="#FFD700"
        className="mr-1"
      />
    );
  }

  return <View className="flex-row">{stars}</View>;
}
