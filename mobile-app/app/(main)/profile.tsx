import Icon from "@/assets/icons";
import { ScreenWrapper, Header } from "@/components";
import { wp } from "@/helpers/common";
import { useAuth } from "@/hooks/useAuth";
import { UserHeaderProps } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  router,
  handleLogout,
}) => {
  return (
    <View className="flex-1 bg-white" style={{ paddingHorizontal: wp(4) }}>
      <View>
        <Header title="Profile" showBackButton={true} />
        <TouchableOpacity
          onPress={handleLogout}
          className="absolute right-0 rounded-xl bg-[#FEE2E2] p-1"
        >
          <Icon name="logout" color="red" />
        </TouchableOpacity>
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
        onPress: () => {
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
