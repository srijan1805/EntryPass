import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  BackHandler,
} from "react-native";
//import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
const { width, height } = Dimensions.get("window");
import translation from "../../assets/translations/translate";
import CusInput from "../../components/CusInput";
const BaseURL = Config.BASE_URL;

import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { hp, wp } from "../../utils/responsive-helper";
import { Config } from "../../utils/Config";

const SuccessFacilityScreen = (props) => {
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);
  const scanTypeVal = props.route.params.scanType;
  const BaseURL = Config.BASE_URL;
  const Name = props.route.params.name;
  const logo = props.route.params.logo;
  const facilityId = props.route.params.facilityId;
  const facilityName = props.route.params.facilityName;
  const employeeId = props?.route?.params?.employeeId;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const onPressNav = async () => {
    navigation.navigate("AttendanceQRScan", {
      type: "clockIn",
      val: "retake",
      emploID: employeeId,
      scanval: false,
      isFacilityChange: true,
    });
  };

  const imageErr = () => {
    setImageError(true);
  };

  return (
    <>
      <View style={styles.viewcontainer}>
        <View
          style={[
            styles.imagebackgroundStyle,
            { backgroundColor: COLORS.Yellow },
          ]}
        >
          <Image
            style={styles.imageStyle}
            source={require("../../assets/images/tick.png")}
          />
        </View>
        <Text style={styles.textSytle}>
          {translation.Attendance.fac_success}
        </Text>

        <View style={styles.viewthirdStyle}>
          {(() => {
            if (imageError) {
              return (
                <View style={styles.noLogo}>
                  <Text style={styles.noLogoText}>
                    {translation.Attendance.no_logo}
                  </Text>
                </View>
              );
            } else {
              return (
                <Image
                  style={styles.logoimageStyle}
                  source={{
                    uri: `${logo}`,
                  }}
                  onError={imageErr}
                />
              );
            }
          })()}
          <View style={styles.facilityName}>
            <Text style={styles.failityTextStyle}>{Name}</Text>
          </View>
        </View>

        <View style={styles.newcontainer}>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onPressNav}
          >
            <Text style={styles.text}>
              {translation.Attendance.procced_clockin}
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
    marginTop: hp(93),
    borderRadius: wp(100),
  },
  imageStyle: {
    height: wp(40),
    width: wp(56),
    //marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:COLORS.Red
  },

  textSytle: {
    marginTop: hp(20),
    fontSize: wp(28),
    textAlign: "center",
    color: COLORS.Black,
    marginLeft: wp(20),
    marginRight: wp(20),
    fontFamily: FONTS.Urbanist_Bold,
  },

  viewthirdStyle: {
    marginTop: hp(50),
    paddingLeft: wp(10),
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderRadius: wp(5),
    borderColor: COLORS.LightGrey,
    borderBottomWidth: wp(1),
    height: hp(94),
    width: wp(327),
    flexDirection: "row",
  },
  logoimageStyle: {
    height: wp(60),
    width: wp(60),
    marginLeft: wp(10),
    backgroundColor: COLORS.White,
    alignSelf: "center",
    resizeMode: "contain",
  },

  facilityName: {
    justifyContent: "center",
    flexWrap: "wrap",
    marginRight: wp(10),
    width: wp(260),
  },

  failityTextStyle: {
    marginLeft: wp(22),
    flexWrap: "wrap",
    // width: '60%',
    //fontWeight: 'normal',
    fontSize: hp(18),
    textAlignVertical: "center",
    alignSelf: "center",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
  },

  newcontainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: hp(0),
    width: "90%",
    height: hp(54),
    marginBottom: hp(20),
    borderWidth: wp(1),
    borderRadius: wp(10),
    borderBottomWidth: wp(1),
    borderColor: COLORS.LightGrey,
    // shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.9,
    shadowRadius: 5,
    backgroundColor: COLORS.PurpleButton,
  },
  text: {
    color: COLORS.White,
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
  },
  noLogo: {
    width: wp(60),
    height: hp(60),
    marginTop: hp(17),
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
  },
  noLogoText: {
    color: COLORS.BlackDark,

    fontSize: hp(14),
    flexWrap: "wrap",
    fontFamily: FONTS.Urbanist,
  },
});

export default SuccessFacilityScreen;
