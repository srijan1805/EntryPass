import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";

import LoaderView from "../../components/Loader";
import { wp, hp } from "../../utils/responsive-helper";
import translation from "../../assets/translations/translate";
import { useEffect } from "react";
const AttendanceRequestScreen = (props) => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "MyDrawer",
            },
          ],
        })
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  });

  return (
    <>
      <View style={styles.viewcontainer}>
        <View style={styles.imagebackgroundStyle}>
          <Image
            style={styles.imageStyle}
            source={require("../../assets/images/tick.png")}
          />
        </View>
        <Text style={styles.textSytle}>
          {translation.Attendance.req_sub_success}
        </Text>

        <View style={styles.newcontainer}>
          <TouchableOpacity
            style={styles.touchAbilityStyle}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: "MyDrawer",
                      // params: { user: 'jane' },
                    },
                  ],
                })
              )
            }
          >
            <Text style={styles.text}>
              {translation.AddressVerification.back_to_home}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoaderView loading={isLoading} />
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
    height: wp(186),
    width: wp(186),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
    borderRadius: wp(100),
    backgroundColor: COLORS.Yellow,
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
    //fontWeight: 'bold',
    fontSize: hp(30),
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
    color: COLORS.Black,
    width: "70%",
  },
  secondtextSytle: {
    marginTop: hp(20),
    fontWeight: "normal",
    fontSize: hp(18),
    textAlign: "center",
    color: COLORS.Black,
    width: "70%",
  },
  viewthirdStyle: {
    marginTop: hp(20),
    paddingLeft: hp(10),
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderRadius: hp(5),
    borderColor: COLORS.LightGrey,
    borderBottomWidth: wp(1),
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
    fontWeight: "normal",
    fontSize: hp(18),
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
    borderColor: COLORS.LightGrey,
    // shadowColor: '#000000',
    shadowOffset: { width: wp(0), height: hp(1) },
    // shadowOpacity: 0.9,
    shadowRadius: hp(5),
    backgroundColor: COLORS.PurpleButton,
  },
  text: {
    color: COLORS.White,
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
  },
  touchAbilityStyle: {
    //backgroundColor: 'red',
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AttendanceRequestScreen;
