import React, { useState, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import {
  useNavigation,
  DrawerActions,
  CommonActions,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Buttons } from "./Buttons";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import translation from "../assets/translations/translate";
import { getEmployeeDetails } from "../utils/HomeAPI";
import { wp, hp } from "../utils/responsive-helper";
import {
  profileRetrieveData,
  addressVerficationFacilityStoreData,
} from "../store/User/UserDetails";
import { postLogoutAPI, profileDeleteAPI } from "../utils/ProfileNetworkAPI";
import { getProfileDetails } from "../store/Profile/Profile";
import { timeZonecheck } from "../store/User/UserDetails";
import { tokenRetrieveData } from "../store/User/UserDetails";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getVersion } from "react-native-device-info";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { appLogout } from "../utils/AppLogout";
import { RootState } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonicIcon from "react-native-vector-icons/Ionicons";
import LanguagePopup from "./LanguagePopup";

const LANGUAGE_DATA = [
  {
    id: 1,
    name: translation.English.English,
    code: "en",
  },
  {
    id: 2,
    name: translation.Chines.Chines,
    code: "ch",
  },
  {
    id: 3,
    name: translation.Bahasa.Bahasa,
    code: "ma",
  },
];

function DrawerComponent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // TODO: Integrate Name, EmployeeId, IsVerifiedBySupervisor and IsAddressVerified after login
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();
  const { profileDetails } = useSelector(
    (state: RootState) => state.profileState
  );

  const disabledUser = useSelector(
    (state: RootState) => state.disabledUserState
  );

  const [isVerifiedBySupervisor, setIsVerifiedBySuper] = useState(false);
  const [isAddressPending, setIsAddressVerified] = useState(false);
  const [isARTTestPending, setARTTestPending] = useState(false);
  const [lang, setLang] = useState<string | null>("en");
  const [getEmployee, setEmployee] = useState({
    name: " ",
    employeeNo: " ",
    facility: " ",
    QrPass: " ",
    notify: "",
    employeeQrcode: "",
    isSupervisor: "",
    facilityLogo: "",
  });
  const [islangVisible, setLangVisible] = useState<boolean>(false);
  const [langData, setLangData] = useState(LANGUAGE_DATA);

  useEffect(() => {
    getAppLang();
    profiledetails();
  }, []);

  const getAppLang = async () => {
    const appLang = await AsyncStorage.getItem("applanguage");
    setLang(appLang);
  };

  const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

  function onselect(e) {
    setLangVisible(false);
    closeDrawer();
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
    // dispatch(setAppLanguage(e));
    AsyncStorage.setItem("applanguage", e);
    translation.setLanguage(e);
    if (e === "ch") {
      translation.setLanguage("ch");
    } else if (e === "ma") {
      translation.setLanguage("ma");
    } else {
      translation.setLanguage("en");
    }
  }

  function profiledetails() {
    profileRetrieveData().then((tokenval) => {
      setIsAddressVerified(tokenval.isAddressPending);
      setIsVerifiedBySuper(tokenval.isSupervisorVerfied);
      setEmployee({
        ...getEmployee,
        name: tokenval.employeeName,
        employeeNo: tokenval.employeeId,
        employeeQrcode: tokenval.empNameId,
        facility: tokenval.facility,
        QrPass: tokenval.qrPassCode,
        notify: tokenval.hasNotification,
        isSupervisor: tokenval.isSpuervisor,
        facilityLogo: tokenval.facilityLogo,
      });
      dispatch(getProfileDetails(tokenval.employeeId))
        .then((data: any) => {
          setARTTestPending(data.payload.isArtTestPending);
        })
        .catch((error) => {
          console.log("Error");
        });
    });
  }

  const getDateTimeDetails = () => {
    let todaydate = new Date();
    todaydate.setDate(todaydate.getDate() - 0);
    let datesend = moments(todaydate).tz(timeZonecheckval).format("YYYY-MM-DD");
    let todaydateend = new Date(datesend);
    let todaydatestart = new Date();

    return {
      employeeID: getEmployee.employeeNo,
      multiStartdate: todaydateend,
      multiEnddate: todaydatestart,
      singleStartdates: todaydatestart,
      singleEnddates: todaydatestart,
      isSupervisor: getEmployee.isSupervisor,
    };
  };

  const onGpsAttendancePress = () => {
    closeDrawer();
    if (props.isDisabledDrawer) {
      navigation.navigate("DefaultPromptScreen");
    } else {
      navigation.navigate("AttendanceHomeScreen", {
        ...getDateTimeDetails(),
        isGpsAttendance: true,
      });
    }
  };

  const onAttendancePress = () => {
    closeDrawer();
    if (props.isDisabledDrawer) {
      navigation.navigate("DefaultPromptScreen");
    } else {
      navigation.navigate("AttendanceHomeScreen", {
        ...getDateTimeDetails(),
        isGpsAttendance: false,
        facilityName: getEmployee.facility,
        facilityLogo: getEmployee.facilityLogo,
      });
    }
  };

  const onLogoutPress = async () => {
    closeDrawer();
    await appLogout(
      getEmployee.employeeNo.toString(),
      navigation,
      props.isDisabledDrawer,
      dispatch
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator={false}
        >
          {/* Drawer Title and Close Button */}
          <View style={styles.drawerHeader}>
            <Buttons
              text={translation.Buttons_lable.close}
              onPress={closeDrawer}
              source={require("../assets/icons/Close.png")}
              ImgStyle={{ ...styles.drawerClose }}
              textStyle={{ ...styles.drawerTitle, ...{ marginLeft: hp(7) } }}
              loader={false}
              BTNstyle={{ color: COLORS.Black, flexDirection: "row" }}
            />
          </View>

          {/* My Profile Card */}

          {props.isDisabledDrawer ? (
            <View
              style={[
                styles.profile,
                {
                  backgroundColor: COLORS.White,
                  paddingBottom: hp(8),
                },
              ]}
            >
              <TouchableOpacity>
                <View style={styles.loggedInView}>
                  <Text style={styles.loggedIn}>
                    {translation.DrawerNavigation.LoggedInAs}
                  </Text>
                </View>
                <View style={styles.profileTitleRow}>
                  <Image
                    style={[styles.profileImage, { tintColor: COLORS.Black }]}
                    source={require("./../assets/icons/Profile.png")}
                  />
                  <View>
                    {disabledUser?.loginDetails?.tokenVal
                      // .toUpperCase()
                      .match("/uems/gi") && (
                      <Text style={styles.profileTitle}>
                        {disabledUser?.loginDetails?.tokenVal.toLowerCase()}
                      </Text>
                    )}
                    <Text style={styles.profileName}>{disabledUser.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.profile,

                {
                  backgroundColor: COLORS.White,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  closeDrawer();
                  setTimeout(() => {
                    navigation.navigate("Profile", {
                      scanType: "supervisor",
                    });
                  }, 250);
                }}
              >
                <View style={styles.loggedInView}>
                  <Text style={styles.loggedIn}>
                    {translation.DrawerNavigation.LoggedInAs}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.White,
                      opacity: 1,
                      height: hp(50),
                      width: hp(50),
                      borderRadius: hp(50) / 2,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                      marginLeft: wp(10),
                    }}
                  >
                    <Image
                      style={
                        profileDetails.imageUrl
                          ? {
                              height: hp(50),
                              width: hp(50),
                              borderRadius: hp(50) / 2,
                              resizeMode: "cover",
                            }
                          : [styles.profileImage, { tintColor: COLORS.Black }]
                      }
                      source={
                        profileDetails.imageUrl
                          ? { uri: profileDetails.imageUrl }
                          : require("./../assets/icons/Profile.png")
                      }
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      marginTop: hp(10),
                      marginLeft: 5,
                    }}
                  >
                    <Text style={styles.profileName} numberOfLines={2}>
                      {getEmployee.name}
                    </Text>
                    <Text style={[styles.profileTitle, { marginTop: hp(5) }]}>
                      {getEmployee.employeeQrcode}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.horizontalLine} />
              <TouchableOpacity
                onPress={() => {
                  closeDrawer();
                  navigation.navigate("ScanQRcodesupervisor", {
                    scanType: "supervisor",
                  });
                }}
              >
                <View style={styles.profileSubTitleRow}>
                  {isVerifiedBySupervisor ? (
                    <IonicIcon
                      name="checkmark-circle"
                      color={COLORS.Green}
                      style={styles.alertIcon}
                      size={hp(22)}
                    />
                  ) : (
                    <FeatherIcon
                      name="alert-circle"
                      color={COLORS.Red}
                      style={styles.alertIcon}
                      size={hp(22)}
                    />
                  )}
                  <Text
                    style={[
                      styles.subTitle,
                      {
                        color: isVerifiedBySupervisor
                          ? COLORS.Green
                          : COLORS.Red,
                      },
                    ]}
                  >
                    {isVerifiedBySupervisor
                      ? translation.DrawerNavigation.VerifiedBySupervisor
                      : translation.DrawerNavigation.SupervisorNotVerified}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {/* Drawer Components */}
          <View style={styles.drawerComponents}>
            <TouchableHighlight
              underlayColor={COLORS.PurpleButton}
              onPress={() => {
                if (props.isDisabledDrawer) {
                  closeDrawer();
                  navigation.navigate("DefaultPromptScreen");
                } else {
                  let emplyeedata = {
                    isFacilityVerfied: true,
                    facilityId: getEmployee.employeeNo,
                  };
                  addressVerficationFacilityStoreData(emplyeedata).then(
                    () => {}
                  );
                  closeDrawer();
                  navigation.navigate("AddressTabs", {
                    screen: "AddressVerificationHomeScreen",
                    title: "Address Verification",
                  });
                }
              }}
            >
              <View style={[styles.drawerComponentsRow]}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Address.png")}
                  />
                </View>
                <View style={styles.rowView}>
                  <View style={{ flex: 0.85, justifyContent: "center" }}>
                    <Text style={styles.componentTitle}>
                      {translation.DrawerNavigation.AddressVerification}
                    </Text>
                  </View>

                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.componentVerification}
                      source={
                        isAddressPending
                          ? require("./../assets/icons/Pending-Red.png")
                          : require("./../assets/icons/Checked-Green.png")
                      }
                    />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={COLORS.PurpleButton}
              onPress={onAttendancePress}
            >
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/timer.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.Home.attendence}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={COLORS.PurpleButton}
              onPress={() => {
                if (props.isDisabledDrawer) {
                  closeDrawer();
                  navigation.navigate("DefaultPromptScreen");
                } else {
                  closeDrawer();
                  navigation.navigate("ArtTestHome");
                }
              }}
            >
              <View style={[styles.drawerComponentsRow]}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/ART-Test.png")}
                  />
                </View>
                <View style={styles.rowView}>
                  <View style={{ flex: 0.85, justifyContent: "center" }}>
                    <Text style={styles.componentTitle}>
                      {translation.DrawerNavigation.ARTTest}
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      style={[styles.componentVerification]}
                      source={
                        isARTTestPending
                          ? require("./../assets/icons/Pending-Red.png")
                          : require("./../assets/icons/Checked-Green.png")
                      }
                    />
                  </View>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={COLORS.PurpleButton}
              onPress={() => {
                if (props.isDisabledDrawer) {
                  closeDrawer();
                  navigation.navigate("DefaultPromptScreen");
                } else {
                  closeDrawer();
                  navigation.navigate("VaccinationHome");
                }
              }}
            >
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Vaccination.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.Vaccination}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor={COLORS.PurpleButton}
              onPress={onGpsAttendancePress}
            >
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={hp(23)}
                    color={"#665DE5"}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.Gps_attendance}
                </Text>
              </View>
            </TouchableHighlight>

            <View>
              <TouchableHighlight
                underlayColor={COLORS.PurpleButton}
                onPress={() => {
                  closeDrawer();
                  setLangVisible(!islangVisible);
                }}
              >
                <View style={[styles.drawerComponentsRow]}>
                  <View style={styles.componentImageBackground}>
                    <Image
                      style={styles.componentImage}
                      source={require("./../assets/icons/Language.png")}
                    />
                  </View>
                  <View style={styles.rowView}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text style={styles.componentTitle}>
                        {translation.DrawerNavigation.ChangeLanguage}
                      </Text>
                    </View>

                    {/* <View style={styles.imageContainer}>
                      <MaterialIcons
                        name={
                          islangVisible
                            ? "keyboard-arrow-down"
                            : "keyboard-arrow-up"
                        }
                        size={hp(28)}
                        color={COLORS.White}
                        style={{ marginTop: 0 }}
                      />
                    </View> */}
                  </View>
                </View>
              </TouchableHighlight>

              {/* {islangVisible && (
                <View>
                  <View style={styles.tabs}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        onselect("en");
                        setLang("en");
                      }}
                    >
                      <View
                        style={[
                          lang == "en"
                            ? styles.tabStyle
                            : {
                                justifyContent: "center",
                                marginVertical: 5,
                                marginHorizontal: 5,
                              },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={styles.checkLanguage}
                            source={
                              lang == "en"
                                ? require("../assets/icons/Checked-Select.png")
                                : require("../assets/icons/Unchecked.png")
                            }
                          />
                          <Text style={styles.Language}>
                            {translation.English.English}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        onselect("ch");
                        setLang("ch");
                      }}
                    >
                      <View
                        style={[
                          lang == "ch"
                            ? styles.tabStyle
                            : {
                                justifyContent: "center",
                                marginVertical: 5,
                                marginHorizontal: 5,
                              },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={[styles.checkLanguage]}
                            source={
                              lang == "ch"
                                ? require("../assets/icons/Checked-Select.png")
                                : require("../assets/icons/Unchecked.png")
                            }
                          />
                          <Text style={[styles.Language]}>
                            {translation.Chines.Chines}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        onselect("ma");
                        setLang("ma");
                      }}
                    >
                      <View
                        style={[
                          lang == "ma"
                            ? styles.tabStyle
                            : {
                                justifyContent: "center",
                                marginVertical: 5,
                                marginHorizontal: 5,
                              },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={[styles.checkLanguage]}
                            source={
                              lang == "ma"
                                ? require("../assets/icons/Checked-Select.png")
                                : require("../assets/icons/Unchecked.png")
                            }
                          />
                          <Text style={[styles.Language]}>
                            {translation.Bahasa.Bahasa}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              )} */}
            </View>

            <TouchableOpacity onPress={onLogoutPress}>
              <View
                style={[
                  styles.drawerComponentsRow,
                  styles.logout,
                  { marginTop: 0 },
                ]}
              >
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Logout.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.Logout}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // marginBottom: 10,
              marginTop: hp(25),
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.Urbanist_Medium,
                fontSize: hp(16),
                color: COLORS.White,
              }}
            >
              {`${translation.DrawerNavigation.version} ${getVersion()}`}
            </Text>
          </View>
        </ScrollView>
        {islangVisible && (
          <LanguagePopup
            isVisible={islangVisible}
            langData={langData}
            onRequestClose={() => setLangVisible(false)}
            onChangePress={(code: string) => {
              onselect(code);
              setLang(code);
            }}
            selectedLang={lang}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PurpleButton,
  },
  containerView: {
    backgroundColor: COLORS.White,
    marginLeft: wp(10),
    marginRight: wp(10),
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: wp(5),
    // marginTop: wp(10),
    marginVertical: hp(15),
  },
  drawerTitle: {
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(18),
    color: COLORS.White,
    // lineHeight: hp(30),
  },
  drawerClose: {
    tintColor: COLORS.White,
    height: hp(20),
    width: wp(20),
    marginLeft: hp(10),
  },

  profile: {
    marginLeft: wp(8),
    marginRight: wp(10),
    borderRadius: wp(10),
  },
  profileTitleRow: {
    flexDirection: "row",
    alignContent: "center",
    marginTop: hp(15),
  },
  profileName: {
    color: COLORS.Black,
    fontSize: hp(16),
    marginLeft: wp(14),
    right: wp(8),
    marginTop: hp(2),
    // width: wp(170),
    fontFamily: FONTS.Urbanist_Semibold,
    flexWrap: "wrap",
  },
  loggedInView: {
    justifyContent: "flex-start",
    marginTop: hp(10),
    // padding: hp(5),
  },
  profileTitle: {
    color: COLORS.Black,
    fontSize: hp(14),
    marginLeft: wp(8),
    fontFamily: FONTS.Urbanist,
  },
  loggedIn: {
    color: COLORS.Black,
    fontSize: hp(14),
    marginLeft: wp(10),
    fontFamily: FONTS.Urbanist,
    opacity: 0.6,
  },
  profileImage: {
    width: wp(41),
    height: wp(41),
    // marginLeft: wp(8),
  },
  horizontalLine: {
    marginTop: hp(13),
    borderBottomColor: COLORS.Black,
    borderBottomWidth: wp(1),
    opacity: 0.1,
  },
  profileSubTitleRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  subTitle: {
    color: COLORS.Black,
    fontSize: hp(15),
    marginLeft: wp(8),
    margin: hp(10),
    fontFamily: FONTS.Urbanist_Semibold,
  },

  drawerComponents: {
    // paddingRight: hp(35),
    // width: wp(312),
    justifyContent: "flex-start",
  },
  drawerComponentsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // width: 'auto',
    padding: hp(10),
    marginTop: hp(5),
  },
  componentImageBackground: {
    // padding: wp(7),
    backgroundColor: COLORS.White,
    borderColor: COLORS.White,
    borderRadius: wp(35),
    // marginTop: hp(15),
    height: wp(35),
    width: wp(35),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  componentImage: {
    width: wp(20),
    height: wp(20),
    alignSelf: "center",
    // paddingRight: wp(10),
  },
  componentTitle: {
    marginLeft: wp(12),
    fontSize: hp(16),
    fontFamily: FONTS.Urbanist_Medium,
    color: COLORS.White,
  },
  imageContainer: {
    width: wp(50),
    height: hp(50),
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  componentVerification: {
    width: wp(28),
    height: wp(28),
  },
  logout: {
    marginTop: hp(20),
  },

  // tabs - change lang
  tabs: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: wp(170),
    marginLeft: wp(60),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    backgroundColor: COLORS.White,
    borderRadius: wp(8),
    padding: wp(5),
    marginRight: 20,
  },
  Language: {
    color: COLORS.DarkGrey,
    fontSize: hp(14),
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: wp(5),
  },
  checkLanguage: {
    width: wp(20),
    height: hp(20),
  },
  tabStyle: {
    backgroundColor: COLORS.Yellow,
    borderRadius: wp(5),
    color: COLORS.Black,
    // padding: wp(5),
    paddingHorizontal: wp(5),
    paddingVertical: wp(5),
    marginVertical: 5,
    // paddingHorizontal: wp(10),
    // marginRight: wp(20),
  },
  alertIcon: {
    // height: hp(20),
    // width: wp(20),
    marginLeft: wp(18),
    marginTop: hp(9),
    alignItems: "center",
    justifyContent: "center",
  },
  rowView: {
    marginRight: hp(10),
    height: hp(50),
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
});
export default DrawerComponent;
