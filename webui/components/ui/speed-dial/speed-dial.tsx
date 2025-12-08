import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SpeedDialAction } from "./speed-dial-action";

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>["name"];

type Action = {
  icon: FontAwesomeIconName;
  label: string;
  onPress: () => void;
};

type SpeedDialProps = {
  actions: Action[];
};

export function SpeedDial({ actions }: SpeedDialProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="absolute inset-0">
      {open && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setOpen(false);
          }}
          className="absolute inset-0 bg-black/30"
        />
      )}

      <View className="absolute bottom-6 right-6 items-end">
        {open &&
          actions.map((action, index) => (
            <SpeedDialAction
              key={index}
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
            />
          ))}

        <TouchableOpacity
          onPress={() => {
            setOpen(!open);
          }}
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-600">
          <FontAwesome name={open ? "close" : "plus"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
