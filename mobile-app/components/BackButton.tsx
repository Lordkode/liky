import Icon from "@/assets/icons";
import { Pressable } from "react-native";
import { Router } from "expo-router";
import React from "react";

interface BackButtonProps {
  size: number;
  router: Router;
}

const BackButton: React.FC<BackButtonProps> = ({ size = 26, router }) => {
  return (
    <Pressable
      className="self-start rounded-xl bg-gray p-1"
      onPress={() => router.back()}
    >
      <Icon name="arrowLeft" strokeWidth={2.5} size={size} color="#494949" />
    </Pressable>
  );
};

export default BackButton;
