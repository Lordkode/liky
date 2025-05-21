import { ScreenWrapper } from "@/components";
import { View, Text, Pressable } from "react-native";
import Icon from "@/assets/icons";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View
          className="mb-2 flex-row items-center justify-between"
          style={{ marginHorizontal: wp(4) }}
        >
          <Text className="font-bold text-text" style={{ fontSize: hp(4.2) }}>
            Liky
          </Text>
          <View className="flex-row gap-4">
            <Pressable onPress={() => router.push("/(main)/notifications")}>
              <Icon name="heart" size={hp(3.2)} />
            </Pressable>
            <Pressable onPress={() => router.push("/(main)/newPost")}>
              <Icon name="plus" size={hp(3.2)} />
            </Pressable>
            <Pressable onPress={() => router.push("/(main)/profile")}>
              <Icon name="user" size={hp(3.2)} />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
