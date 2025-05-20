import { hp } from "@/helpers/common";
import React from "react";
import { Text, Pressable } from "react-native";
import Loading from "./Loading";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, loading = false }) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-2xl bg-primaryDark"
      style={{ height: hp(6.6) }}
    >
      {loading ? (
        <Loading size={24} color="#FFFFFF" />
      ) : (
        <Text
          style={{ fontSize: hp(2.5) }}
          className="font-semibold text-white"
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
