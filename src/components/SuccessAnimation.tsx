import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";

const SuccessAnimation = () => {
  return (
    <>
      <Lottie
        source={require("../assets/lottie-json/attendance-success.json")}
        autoPlay
        loop={false}
      />
    </>
  );
};

export default SuccessAnimation;

const styles = StyleSheet.create({});
