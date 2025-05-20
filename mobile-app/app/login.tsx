import { ScreenWrapper } from "@/components";
import { Text } from "react-native";
import Home from "@/assets/icons/Home";
const LoginScreen = () => {
  return (
    <>
      <ScreenWrapper>
        <Text>LoginScreen</Text>
        <Home strokeWidth={1} color="#F3F3F3"/>
      </ScreenWrapper>
    </>
  );
};

export default LoginScreen;
