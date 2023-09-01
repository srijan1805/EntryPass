import React from "react";
import { TouchableOpacity, ActivityIndicator, Image, Text } from "react-native";
import { COLORS } from "../constants/color";

const Buttons = ({
  text,
  onPress,
  BTNstyle,
  textStyle,
  ImgStyle,
  source = "",
  loader,
  source1 = "",
  disabled = false,
  ActivityIndicatorColor = COLORS.White,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        ...BTNstyle,
      }}
    >
      {source !== "" && <Image style={{ ...ImgStyle }} source={source} />}
      {loader ? (
        <ActivityIndicator color={ActivityIndicatorColor} />
      ) : (
        <Text style={{ ...textStyle }}>{text}</Text>
      )}
      {source1 !== "" && <Image style={{ ...ImgStyle }} source={source1} />}
    </TouchableOpacity>
  );
};

export { Buttons };
