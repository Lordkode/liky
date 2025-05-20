import { View } from "react-native";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  bg?: string;
}

const ScreenWrapper = ({ children, bg="#FFFFFF" }: PropsWithChildren<ScreenWrapperProps>) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>{children}</View>
  );
};

export default ScreenWrapper;
