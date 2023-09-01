import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { profilepage_styles } from "../utils/Styles";
import CheckedCross from "../assets/images/CheckedCross.svg";
import { wp, hp } from "../utils/responsive-helper";
import { FONTS } from "../constants/font";
import { COLORS } from "../constants/color";
import translation from "../assets/translations/translate";

const PopUpAlert = (props) => {
  const { loading, tooglemodel } = props;

  return (
    <Modal transparent={true} animationType={"fade"} visible={loading}>
      <View style={styles.container}>
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={() => tooglemodel()}>
            <View style={styles.imagebackgroundStyle}>
              <CheckedCross width={40} height={40} />
            </View>
          </TouchableOpacity>
          <Text style={styles.welcomeStyle}>{translation.Login.welcome}</Text>
          <Text style={styles.textStyle}>{translation.Login.no_user_desc}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBackground: {
    // flex: 1,
    bottom: hp(-10),
    position: "absolute",
    height: hp(216),
    width: wp(375),
    borderRadius: hp(20),
    backgroundColor: "white",
    alignItems: "center",
  },
  imagebackgroundStyle: {
    marginTop: hp(-25),
    height: wp(55),
    width: wp(55),
    borderRadius: hp(33),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.Red,
    resizeMode: "contain",
  },
  imageStyle: {
    height: hp(20),
    width: wp(20),
    alignItems: "center",
    resizeMode: "center",
  },
  textStyle: {
    marginTop: hp(10),
    height: hp(80),
    marginLeft: hp(23),
    marginRight: hp(23),
    width: wp(319),
    fontWeight: "600",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    //  backgroundColor: COLORS.Blue,
    fontSize: hp(20),
  },
  welcomeStyle: {
    marginTop: hp(10),
    height: hp(30),
    marginLeft: hp(23),
    marginRight: hp(23),
    width: wp(219),
    fontWeight: "bold",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    fontSize: hp(24),
    flexWrap: "wrap",
  },
});

export default PopUpAlert;
