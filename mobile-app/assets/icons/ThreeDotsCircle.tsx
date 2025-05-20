import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ThreeDotsCircleProps {
  strokeWidth: number;
  color: string;
  currentColor: string;
}

const ThreeDotsCircle: React.FC<ThreeDotsCircleProps> = ({
  strokeWidth,
  color = "#000000",
  currentColor,
  ...props
}) => (
  <Svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={color}
    fill="none"
    {...props}
  >
    <Path
      d="M11.9959 12H12.0049"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.9998 12H16.0088"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99981 12H8.00879"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
      stroke={currentColor}
      strokeWidth={strokeWidth - 0.5}
    />
  </Svg>
);

export default ThreeDotsCircle;
