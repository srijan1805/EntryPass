import React, { useState, useEffect } from "react";
import RadioButtonRN from "radio-buttons-react-native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import StepIndicator from "react-native-step-indicator";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Scansh from "../../assets/images/tick_one.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wp, hp } from "../../utils/responsive-helper";
import {
  profileRetrieveData,
  employeeretrieveData,
  googlesignOut,
  microsoftLogout,
  appleLogout,
  clearingLogoutData,
} from "../../store/User/UserDetails";
import styles from "./styles";

const { width, height } = Dimensions.get("window");

const Registration = (props) => {
  const navigation = useNavigation();
  const scanTypeVal = props.route.params.scanType;
  const completeval = props.route.params.scancompete;
  const [loginType, setloginType] = useState("");
  const [selectedSteps, setselectedSteps] = useState(
    props.route.params.stepIndicatorval
  );
  const [selectedStepsImage, setselectedStepsImage] = useState(undefined);

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: COLORS.Yellow,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: COLORS.Yellow,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: COLORS.Yellow,
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: COLORS.Yellow,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "transparent",
    stepIndicatorLabelFinishedColor: COLORS.White,
    stepIndicatorLabelUnFinishedColor: COLORS.White,
    labelColor: "transparent",
    labelSize: 0,
    currentStepLabelColor: "transparent",
  };

  function renderStepIndicator(params: any) {
    if (params.position === 1 && selectedSteps === 1) {
      return <Scansh width={wp(0)} height={hp(0)} />;
    } else if (params.position === 2 && selectedSteps === 2) {
      return <Scansh width={wp(0)} height={hp(0)} />;
    } else if (
      completeval === false &&
      params.position === 2 &&
      selectedSteps === 1
    ) {
      return <Scansh width={wp(0)} height={hp(0)} />;
    } else {
      return <Scansh width={wp(10)} height={hp(10)} />;
    }
  }

  function onselect(buttonNo) {
    if (buttonNo === "1") {
      // setselectedSteps(0);
    }
    if (completeval == false && scanTypeVal == "facility" && buttonNo == "2") {
      // setselectedSteps();

      navigation.navigate("ScanQRcodesupervisor", { scanType: "facility" });
    }
    if (completeval == true && scanTypeVal == "facility" && buttonNo == "3") {
      // setselectedSteps(2);

      navigation.navigate("ScanQRcodesupervisor", { scanType: "supervisor" });
    }
  }
  useEffect(() => {
    currentPositionVal();
  }, [completeval]);

  function currentPositionVal() {
    if (completeval === false && scanTypeVal === "facility") {
      setselectedSteps(1);
    } else if (completeval === true && scanTypeVal === "facility") {
      setselectedSteps(2);
    } else {
      setselectedSteps(0);
    }
  }
  async function backtohomeScreen() {
    try {
      employeeretrieveData().then(async (Dataemp) => {
        if (Dataemp.registrationType === "Google") {
          googlesignOut();
        } else if (Dataemp.registrationType === "Microsoft") {
          microsoftLogout();
        } else if (Dataemp.registrationType === "Apple") {
          appleLogout();
        }
        await clearingLogoutData();
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Login",
              },
            ],
          })
        );
      });
    } catch (error) {
      console.error("Error clearing app data.", error);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => backtohomeScreen()}>
            <View style={styles.back}>
              <Image
                style={styles.backButton}
                source={require("../../assets/icons/BackArrow.png")}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {translation.Registration.Registration}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={styles.facility}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={3}
              currentPosition={selectedSteps}
              direction="vertical"
              renderStepIndicator={renderStepIndicator}
              //labels={labels}
            />
          </View>

          {/* RadioButton view */}
          <View
            style={{
              flexDirection: "column",
              marginLeft: hp(2),
              //  backgroundColor: COLORS.Red,
            }}
          >
            <View
              style={[
                styles.RadioContainer,
                {
                  backgroundColor: COLORS.White,
                  borderColor:
                    completeval == false && scanTypeVal == "facility"
                      ? COLORS.LightGrey
                      : COLORS.White,
                },
              ]}
            >
              <TouchableOpacity disabled={true} onPress={() => onselect("1")}>
                <View
                  style={styles.selectItem}
                  //onPress={onselect('1')}
                >
                  <Text style={styles.registration}>
                    {translation.Registration.Self_Registration}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.RadioContainer,
                {
                  backgroundColor:
                    completeval == false && scanTypeVal == "facility"
                      ? COLORS.PurpleButton
                      : COLORS.White,
                  borderColor:
                    completeval == false && scanTypeVal == "facility"
                      ? COLORS.LightGrey
                      : COLORS.White,
                },
              ]}
            >
              <TouchableOpacity
                disabled={
                  completeval == false && scanTypeVal == "facility"
                    ? false
                    : true
                }
                onPress={() => onselect("2")}
              >
                <View
                  style={{
                    height: hp(40),
                    borderRadius: wp(8),
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor:
                      completeval == false && scanTypeVal == "facility"
                        ? COLORS.PurpleButton
                        : COLORS.White,
                    borderColor:
                      completeval == false && scanTypeVal == "facility"
                        ? COLORS.LightGrey
                        : COLORS.White,
                  }}
                  //onPress={onselect('1')}
                >
                  <Text
                    style={[
                      styles.registration,
                      {
                        color:
                          completeval == false && scanTypeVal == "facility"
                            ? COLORS.White
                            : COLORS.Black,
                      },
                    ]}
                  >
                    {translation.Registration.Facility_Registration}
                  </Text>
                  <Image
                    style={styles.dropdown}
                    source={require("../../assets/icons/RightArrow.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.RadioContainer,
                {
                  backgroundColor:
                    completeval == true && scanTypeVal == "facility"
                      ? COLORS.PurpleButton
                      : COLORS.GrayLight,
                },
              ]}
            >
              <TouchableOpacity
                disabled={
                  completeval == true && scanTypeVal == "facility"
                    ? false
                    : true
                }
                onPress={() => onselect("3")}
              >
                <View
                  style={{
                    height: hp(40),
                    borderRadius: wp(8),
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor:
                      completeval == true && scanTypeVal == "facility"
                        ? COLORS.PurpleButton
                        : COLORS.GrayLight,
                  }}
                >
                  <Text
                    style={[
                      styles.registration,
                      {
                        color: COLORS.White,
                      },
                    ]}
                  >
                    {translation.Registration.Supervisor_Registration}
                  </Text>
                  <Image
                    style={styles.dropdown}
                    source={require("../../assets/icons/RightArrow.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Registration;
