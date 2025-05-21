import { ScreenWrapper, Header } from "@/components";
import { View, Text } from "react-native";

const NotificaionScreen = () => {
  return (
    <ScreenWrapper>
      <Header title="Notifications" showBackButton={true} />

      {/* <View className="flex-1 items-center justify-center">
        <Text>Notification Screen</Text>
      </View> */}
    </ScreenWrapper>
  );
};

export default NotificaionScreen;
