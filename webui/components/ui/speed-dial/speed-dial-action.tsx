import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "../text";
import { FontAwesome } from "@expo/vector-icons";

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>["name"];

type SpeedDialActionProps = {
  icon: FontAwesomeIconName;
  label: string;
  onPress: () => void;
};

export function SpeedDialAction({ icon, label, onPress }: SpeedDialActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white rounded-full shadow p-2 mb-2"
    >
      <FontAwesome name={icon} size={20} color="#000" />
      <Text className="ml-2">{label}</Text>
    </TouchableOpacity>
  );
}
