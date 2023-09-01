import React, { useEffect, useState } from "react";
import RadioButtonRN from "radio-buttons-react-native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { Buttons } from "../../components/Buttons";
import {
  StackActions,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import { GoogleSignin, statusCodes } from "react-native-google-signin";
import AzureAuth from "react-native-azure-auth";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import {
  profileRetrieveData,
  loginRetrieveData,
} from "../../store/User/UserDetails";
import { hp, wp } from "../../utils/responsive-helper";
import { Config } from "./../../utils/Config";
import { useDispatch } from "react-redux";
import { setAppLanguage } from "../../store/Profile/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Config from 'react-native-config';
const Google_Web_CLIENT_ID = Config.Google_Web_CLIENT_ID;
const Google_IOS_CLIENT_ID = Config.Google_IOS_CLIENT_ID;

export default function SelectLanguage() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showscreen, setShowscreen] = useState(false);

  useEffect(() => {
    loginRetrieveData().then((newVal) => {
      if (newVal === undefined) {
        profileRetrieveData().then((tokenval) => {
          if (tokenval === undefined) {
            setShowscreen(true);
          } else {
            navigation.dispatch(StackActions.replace("MyDrawer"));
          }
        });
      } else if (newVal.IsregistrationCompleted === false) {
        navigation.navigate("Registration", {
          scanType: "facility",
          scancompete: true,
          stepIndicatorval: 2,
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Registration",
                params: {
                  scanType: "facility",
                  scancompete: false,
                  stepIndicatorval: 1,
                },
              },
            ],
          })
        );
      } else {
        profileRetrieveData().then((tokenval) => {
          if (tokenval === undefined) {
            setShowscreen(true);
          } else {
            navigation.dispatch(StackActions.replace("MyDrawer"));
          }
        });
      }
    });
  }, []);

  const Languages = [
    {
      label: translation.English.English,
    },
    {
      label: translation.Chines.Chines,
    },
    {
      label: translation.Bahasa.Bahasa,
    },
  ];

  const onselect = async (e: any) => {
    if (e.label === Languages[1].label) {
      AsyncStorage.setItem("applanguage", "ch");
      translation.setLanguage("ch");
    } else if (e.label === Languages[2].label) {
      translation.setLanguage("ma");
      AsyncStorage.setItem("applanguage", "ma");
    } else {
      translation.setLanguage("en");
      AsyncStorage.setItem("applanguage", "en");
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showscreen ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.TextContainer}>
            <Text style={styles.Language}>
              {translation.English.Select_Language}
            </Text>
            {/* <Text style={styles.Language}>
              {translation.Chines.Select_Language}
            </Text>
            <Text style={styles.Language}>
              {translation.Bahasa.Select_Language}
            </Text> */}
          </View>
          {/* RadioButton view */}
          <View style={styles.RadioContainer}>
            <RadioButtonRN
              style={styles.RadioButtons}
              selectedBtn={onselect}
              data={Languages}
              boxActiveBgColor={COLORS.Yellow}
              activeColor={COLORS.Yellow}
              deactiveColor={COLORS.White}
              initial={1}
              circleSize={14}
              boxStyle={styles.radioBox}
              textStyle={styles.RadioText}
              icon={
                <Image
                  source={require("../../assets/icons/CheckedBlack.png")}
                  style={styles.radioIcon}
                />
              }
            />
          </View>

          <View style={styles.buttomContainer}>
            <Buttons
              onPress={() => {
                navigation.navigate("Login");
              }}
              text={translation.English.Continue}
              BTNstyle={{ ...styles.buttonStyle }}
              textStyle={{ ...styles.buttonTxt }}
              ImgStyle={undefined}
              loader={undefined}
            />
          </View>
        </SafeAreaView>
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  TextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(41),
  },

  Language: {
    color: COLORS.DarkGrey,
    fontSize: hp(25),
    fontFamily: FONTS.Urbanist_Bold,
    marginTop: hp(20),
  },

  RadioContainer: {
    borderWidth: wp(3),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(8),
    marginLeft: wp(24),
    marginRight: wp(24),
    marginTop: hp(41),
    padding: 0,
  },

  RadioButtons: {
    alignItems: "center",
    marginBottom: hp(8),
  },

  RadioText: {
    fontSize: hp(25),
    fontFamily: FONTS.Urbanist_Bold,
  },
  radioBox: {
    height: hp(82),
    width: wp(311),
  },
  radioIcon: {
    width: wp(20),
    height: hp(20),
  },
  buttonStyle: {
    marginLeft: wp(24),
    marginRight: wp(24),
    marginBottom: hp(41),
    width: wp(327),
    height: hp(55),
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: COLORS.Blue,
    borderRadius: wp(8),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },

  buttomContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
});
