import React from "react";
import Svg, { Path } from "react-native-svg";

interface SearchProps {
  strokeWidth: number;
  color: string;
  currentColor: string;
}

const Search: React.FC<SearchProps> = ({
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
      d="M17.5 17.5L22 22"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export default Search;
