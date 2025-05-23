import { hp } from "@/helpers/common";
import React from "react";
import { Image } from "expo-image";

interface AvatarProps {
  uri: string;
  size: number;
  style?: object;
  rounded?: number;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = hp(4.5),
  rounded = 6,
  style,
}) => {
  return (
    <Image
      source={uri}
      transition={100}
      contentFit="cover"
      style={[
        {
          height: size,
          width: size,
          borderColor: "#E1E1E1",
          borderWidth: 1,
          borderCurve: "continuous",
          borderRadius: rounded,
        },
        style,
      ]}
      className="rounded-full"
    />
  );
};

export default Avatar;
