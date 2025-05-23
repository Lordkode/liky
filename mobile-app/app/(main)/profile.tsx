import Icon from "@/assets/icons";
import { ScreenWrapper, Header, Avatar } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";
import { UserHeaderProps } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Alert, Pressable, Text } from "react-native";

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  router,
  handleLogout,
}) => {
  return (
    <View className="flex-1 bg-white" style={{ paddingHorizontal: wp(4) }}>
      <View className="mb-4">
        <Header title="Profile" showBackButton={true} />
        <TouchableOpacity
          onPress={handleLogout}
          className="absolute right-0 rounded-xl bg-[#FEE2E2] p-1"
        >
          <Icon name="logout" color="red" />
        </TouchableOpacity>
      </View>

      <View>
        <View className="gap-4">
          <View
            className="self-center"
            style={{ height: hp(12), width: hp(12) }}
          >
            <Avatar
              uri={
                "https://res.cloudinary.com/diddorewx/image/upload/v1747873936/posts/_J2A9697_1_1_cn9qzd.jpg"
              }
              size={hp(12)}
              rounded={hp(12) / 2}
            />{" "}
            <Pressable
              className="elevation-md absolute -right-3 bottom-0 rounded-full bg-white p-2 shadow-textLight"
              style={{
                shadowOpacity: 0.4,
                shadowOffset: { width: 0, height: 4 },
              }}
              onPress={() => Alert.alert("Bientôt disponible")}
            >
              <Icon name="edit" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="mt-4 items-center gap-1">
        <Text style={{ fontSize: hp(4) }} className="font-bold text-textDark">
          {user && user.username}
        </Text>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <Icon name="user" />
          <Text
            className="font-medium text-textLight"
            style={{ fontSize: hp(2.0) }}
          >
            {user && user.email}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const { user, setUser } = useAuth();
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
      {user && (
        <UserHeader user={user} router={router} handleLogout={handleLogout} />
      )}
    </ScreenWrapper>
  );
};

export default ProfileScreen;
