import { TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "../text";

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
      className="mb-2 flex-row items-center rounded-full bg-white p-2 shadow">
      <FontAwesome name={icon} size={20} color="#000" />
      <Text className="ml-2">{label}</Text>
    </TouchableOpacity>
  );
}
