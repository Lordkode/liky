import { Avatar, ScreenWrapper } from "@/components";
import { View, Text, Pressable, Alert } from "react-native";
import Icon from "@/assets/icons";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";

const HomeScreen = () => {
  const { user, setUser } = useAuth();
  console.log("user", user);
  const router = useRouter();

  const handleLogout = () => {
    // show a confirmation modal
    Alert.alert("Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await authService.logout();
          setUser(null);
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };
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
              <Avatar
                uri={
                  "https://res.cloudinary.com/diddorewx/image/upload/v1747873936/posts/_J2A9697_1_1_cn9qzd.jpg"
                }
                size={hp(3.2)}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <Pressable onPress={handleLogout} className="flex-1 items-center">
        <Text className="text-center text-xl font-bold text-primary">
          Logout
        </Text>
      </Pressable>
    </ScreenWrapper>
  );
};

export default HomeScreen;
