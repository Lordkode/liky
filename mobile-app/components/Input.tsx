import { hp } from "@/helpers/common";
import React from "react";
import { View, TextInput } from "react-native";

interface InputProps {
  icon?: React.ReactNode;
  value?: string;
  placeholder: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  icon,
  value,
  placeholder,
  onChangeText,
  ...props
}) => {
  return (
    <View
      className="flex-row items-center justify-center gap-3 rounded-xl border px-4"
      style={{ height: hp(7.2), borderCurve: "continuous" }}
    >
      {icon && icon}
      <TextInput
        className="flex-1"
        placeholderTextColor="#7C7C7C"
        placeholder={placeholder}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

export default Input;
