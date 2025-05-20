import React from "react";
import { View, ActivityIndicator } from "react-native";

interface LoadingProps {
  size: "small" | "large" | number;
  color: string;
}
const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = "#FFFFFF",
}) => {
  return (
    <View className="items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
