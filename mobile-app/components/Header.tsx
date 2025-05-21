import { View, Text } from "react-native";
import React from "react";
import BackButton from "./BackButton";
import { useRouter } from "expo-router";
import { hp } from "@/helpers/common";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}
const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const router = useRouter();
  return (
    <View className="mt-1 flex-row items-center justify-center gap-2 bg-white">
      {showBackButton && (
        <View className="absolute left-0">
          <BackButton size={26} router={router} />
        </View>
      )}
      <Text className="font-semibold" style={{ fontSize: hp(3.2) }}>
        {title || ""}
      </Text>
    </View>
  );
};

export default Header;
