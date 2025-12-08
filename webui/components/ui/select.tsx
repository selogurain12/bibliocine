/* eslint-disable max-len */
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, forwardRef } from "react";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (value: string) => void;
  value?: string;
};

const Select = forwardRef<View, SelectProps>(
  ({ options, placeholder = "Sélectionner...", onValueChange, value }, ref) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;

    const handleSelect = (val: string) => {
      onValueChange?.(val);
      setOpen(false);
    };

    return (
      <View ref={ref}>
        <TouchableOpacity
          className="h-10 w-full flex-row items-center justify-between rounded-md border border-gray-300 bg-white px-3"
          onPress={() => {
            setOpen(true);
          }}
          activeOpacity={0.7}>
          <Text className="text-sm text-gray-700">{selectedLabel}</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>

        <Modal visible={open} transparent animationType="fade">
          <View className="flex-1 items-center justify-center bg-black/30">
            <View className="max-h-[60%] w-4/5 rounded-lg bg-white shadow-md">
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row justify-between px-4 py-3"
                    onPress={() => {
                      handleSelect(item.value);
                    }}>
                    <Text className="text-sm text-gray-800">{item.label}</Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={18} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                className="items-center border-t border-gray-200 py-3"
                onPress={() => {
                  setOpen(false);
                }}>
                <Text className="font-semibold text-blue-600">Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

export default Select;
