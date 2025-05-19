import images from "@/constants/images";
import { View, Image, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import { ScreenWrapper, Button } from "@/components";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <>
      <ScreenWrapper bg="white">
        <StatusBar style="dark" />
        <View
          className="align-center flex-1 justify-around bg-white"
          style={{ paddingHorizontal: wp(4) }}
        >
          <Image
            style={{ height: hp(30), width: wp(100), alignSelf: "center" }}
            resizeMode="contain"
            source={images.welcome}
          />
          <View className="gap-6">
            <Text className="text-center text-6xl font-extrabold text-text">
              Liky
            </Text>
            <Text
              className="px-8 text-center text-text"
              style={{ fontSize: hp(2.5) }}
            >
              Where every thought find a home and every image tells a story.
            </Text>
          </View>
          <View className="w-full gap-8">
            <Button
              title="Getting Started"
              onPress={() => router.push("/register")}
            />
            <View className="flex-row items-center justify-center">
              <Text
                className="text-center text-text"
                style={{ fontSize: hp(2.5) }}
              >
                Already have an account !
              </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text
                  className="text-center font-semibold text-primaryDark"
                  style={{ fontSize: hp(2.5) }}
                >
                  {" "}
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default WelcomeScreen;
