import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  SafeAreaView,
} from "react-native";
import translation from "../assets/translations/translate";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { wp, hp } from "../utils/responsive-helper";

const Loader = (props) => {
  if (props.loading === true) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <Text style={styles.text}>
                {translation.AlertMessage.please_wait}
              </Text>
              <ActivityIndicator animating={true} />
            </View>
          </View>
        </View>
      </>
    );
  } else return null;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#7F000000",
    // opacity: 0.7,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
    // backgroundColor: "red",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: hp(100),
    width: wp(100),
    borderRadius: hp(10),
    display: "flex",
    alignItems: "center",
    // justifyContent: 'space-evenly',
  },
  text: {
    fontSize: hp(12),
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    marginBottom: hp(20),
    marginTop: hp(15),
  },
});

export default Loader;
