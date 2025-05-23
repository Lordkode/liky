import { ScreenWrapper, BackButton, Input, Button } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import { View, Text, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "@/assets/icons";
import { useState } from "react";
import AuthService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

const LoginScreen = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onsubmit = async () => {
    if (!email || !password) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.data.user);
      router.replace("/(main)/home");
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
            Hey,
          </Text>
          <Text className="font-semibold text-text" style={{ fontSize: hp(6) }}>
            Welcome Back
          </Text>
        </View>
        <View className="gap-4">
          <Text style={{ fontSize: hp(2.5) }} className="text-text">
            Please login to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            value={email}
            onChangeText={(value: string) => setEmail(value)}
            placeholder="Enter your email!"
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password!"
            value={password}
            onChangeText={(value: string) => setPassword(value)}
            secureTextEntry
          />
          <Pressable>
            <Text
              style={{ fontSize: hp(2.0) }}
              className="text-right font-medium text-text"
            >
              {" "}
              Forget Password?
            </Text>
          </Pressable>
          <Button title="Login" loading={loading} onPress={onsubmit} />
        </View>
        <View className="flex-row items-center justify-center">
          <Text style={{ fontSize: hp(2.5) }}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text
              style={{ fontSize: hp(2.5) }}
              className="font-medium text-primary"
            >
              {" "}
              Register!
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
