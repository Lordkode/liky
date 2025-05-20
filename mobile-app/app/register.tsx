import Icon from "@/assets/icons";
import { BackButton, Button, Input, ScreenWrapper } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import AuthService from "@/services/authService";

const RegisterScreen = () => {
  const router = useRouter();

  // References section
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // Functions section
  const onsubmit = async () => {
    if (!email || !password) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.register({
        username,
        email,
        password,
      });
      console.log("User register successfully, user data:", response.data.user);
      setUser(response.data.user);
      router.replace("/home");
    } catch (error: any) {
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View className="flex-1 gap-11" style={{ paddingHorizontal: wp(5) }}>
        <BackButton size={26} router={router} />

        <View>
          <Text className="font-semibold text-text" style={{ fontSize: hp(6) }}>
            Let&apos;s
          </Text>
          <Text className="font-semibold text-text" style={{ fontSize: hp(6) }}>
            Get Started !
          </Text>
        </View>

        <View className="gap-4">
          <Text style={{ fontSize: hp(2.5) }} className="text-text">
            Please login to continue
          </Text>

          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your username !"
            value={username}
            onChangeText={(value: string) => setUsername(value)}
          />

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email !"
            value={email}
            onChangeText={(value: string) => setEmail(value)}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password !"
            value={password}
            onChangeText={(value: string) => setPassword(value)}
            secureTextEntry
          />
          <Button title="Login" loading={loading} onPress={onsubmit} />
        </View>

        <View className="flex-row items-center justify-center">
          <Text style={{ fontSize: hp(2.5) }}>Already have an account ?</Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text
              style={{ fontSize: hp(2.5) }}
              className="font-medium text-primary"
            >
              {" "}
              Register !
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default RegisterScreen;
