import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
//import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import CusInput from "../../components/CusInput";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../utils/responsive-helper";

const { width, height } = Dimensions.get("window");

const UnsuccesfulScreen = (props) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [userNameTxt, setuUserName] = useState("");
  const [nameAvaliableStatus, setNameAvaliableStatus] = useState(false);
  const scanTypeVal = props.route.params.scanType;
  const message = props.route.params.message;

  return (
    <>
      <View style={styles.viewcontainer}>
        <View
          style={[styles.imagebackgroundStyle, { backgroundColor: COLORS.Red }]}
        >
          <Image
            style={styles.imageStyle}
            source={require("../../assets/icons/Close.png")}
          />
        </View>
        <Text style={styles.textSytle}>
          {translation.Registration.Verification_Failed}
        </Text>

        {scanTypeVal == "facility" ? (
          <Text style={styles.secondtextSytle}>{message}</Text>
        ) : (
          <Text style={styles.secondtextSytle}>{message}</Text>
        )}

        <View style={styles.newcontainer}>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              //backgroundColor: 'red',
            }}
            onPress={() =>
              navigation.navigate("ScanQRcodesupervisor", {
                scanType: scanTypeVal,
              })
            }
          >
            <Text style={styles.text}>
              {translation.Registration.Try_Again}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column",
  },
  imagebackgroundStyle: {
    height: wp(187),
    width: wp(187),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
    borderRadius: wp(100),
  },
  imageStyle: {
    height: wp(100),
    width: wp(100),
    //marginTop: hp(0),
    alignItems: "center",
    justifyContent: "center",
    tintColor: COLORS.White,
  },

  textSytle: {
    marginTop: hp(20),
    fontSize: hp(30),
    textAlign: "center",
    color: COLORS.Black,
    marginLeft: wp(20),
    marginRight: wp(20),
    fontFamily: FONTS.Urbanist_Bold,
  },
  secondtextSytle: {
    marginTop: hp(20),
    // fontWeight: 'normal',
    fontSize: hp(18),
    textAlign: "center",
    color: COLORS.Black,
    width: "70%",
    fontFamily: FONTS.Urbanist,
  },
  viewthirdStyle: {
    marginTop: hp(20),
    paddingLeft: hp(10),
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderRadius: hp(5),
    borderColor: COLORS.LightGrey,
    borderBottomWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: wp(0), height: hp(2) },
    shadowOpacity: 0.9,
    shadowRadius: hp(10),
    height: hp(80),
    width: "90%",
    flexDirection: "row",
  },
  logoimageStyle: {
    height: hp(40),
    width: wp(50),
    marginTop: hp(20),
    marginLeft: hp(10),
    backgroundColor: COLORS.Red,
  },
  failityTextStyle: {
    marginTop: hp(30),
    marginLeft: hp(10),
    width: "60%",
    //fontWeight: 'normal',
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    color: COLORS.Black,
  },

  newcontainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: hp(0),
    width: "90%",
    height: hp(50),
    marginBottom: hp(20),
    borderWidth: wp(1),
    borderRadius: hp(10),
    borderBottomWidth: wp(1),
    shadowColor: "#000000",
    shadowOffset: { width: wp(0), height: hp(1) },
    shadowOpacity: 0.9,
    shadowRadius: hp(5),
    borderColor: COLORS.LightGrey,
    backgroundColor: COLORS.PurpleButton,
  },
  text: {
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
    fontSize: hp(18),
  },
});

export default UnsuccesfulScreen;
