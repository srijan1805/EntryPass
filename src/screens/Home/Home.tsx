import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import moment from "moment";
const { width, height } = Dimensions.get("window");
import { getEmployeeDetails } from "../../utils/HomeAPI";
import { getEmployeeId, setEmployeeId } from "../../store/User/User";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { wp, hp } from "../../utils/responsive-helper";
import {
  profileStoreData,
  retriveUserDefaultFacility,
  timeZonecheck,
} from "../../store/User/UserDetails";
import {
  profileRetrieveData,
  addressVerficationFacilityStoreData,
  addressVerficationFacilityRetrieveData,
} from "../../store/User/UserDetails";
import QRCode from "react-native-qrcode-svg";
import messaging from "@react-native-firebase/messaging";
import { isPendingNotifications } from "../../store/Notifications/Notifications";
import { tokenStoreData } from "../../store/User/UserDetails";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import FacilityChangePopup from "../../components/FacilityChangePopup";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getattendancesProfileDetails } from "../../store/Attendances/Attendances";
import { socialNetworksAPI } from "../../utils";
import LoaderView from "../../components/Loader";
import crashlytics from "@react-native-firebase/crashlytics";
import FlipComponent from "react-native-flip-component";
import EmployeeDetailsScreen from "./EmployeeDetailsScreen";
import { checkUserIsActive } from "../../utils/ProfileNetworkAPI";
import SupervisorVerificationPopup from "../../components/SupervisorVerificationPopup";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationHeader, {
  MainNavigationHeader,
} from "../../components/NavigationHeader";
import {
  getProfileDetails,
  getUserCurrentLocation,
} from "../../store/Profile/Profile";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

var allSettled = require("promise.allsettled");

export interface EmployeeDetails {
  name: string;
  employeeNo: string;
  facility: string;
  QrPass: string;
  notify: string;
  employeeQrcode: string;
  isSupervisor: boolean;
  facilityLogo: string;
}

const Home = (props) => {
  const navigation = useNavigation();
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [isArtTestPending, IsArtTestVerified] = useState(false);
  const [getEmployeeQRcode, setEmployeeQRcode] = useState();
  const [isFacilityPopup, setFacilityPopup] = useState<boolean>(false);
  const [getEmployee, setEmployee] = useState<EmployeeDetails>({
    name: " ",
    employeeNo: " ",
    facility: " ",
    QrPass: " ",
    notify: " ",
    employeeQrcode: "",
    isSupervisor: false,
    facilityLogo: "",
  });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFlipped, setFlipped] = useState<boolean>(false);

  const [isSuperVisorAlert, setSupervisorAlert] = useState<boolean>(false);

  const checkSuperVisiorTimePeriod = async () => {
    const lastUpdateTime = await AsyncStorage.getItem(
      "supervisorLastupdateDate"
    );

    const interestEndDate = moment().format("YYYY, DD, MM , HH , MM, SS");
    const interestStartDate = moment(
      lastUpdateTime,
      "DD-MM-YYYY HH:MM:SS"
    ).format("YYYY, DD, MM , HH , MM, SS");

    const timeDifference = moment(
      interestEndDate,
      "YYYY, DD, MM , HH , MM, SS"
    ).diff(moment(interestStartDate, "YYYY, DD, MM , HH , MM, SS"), "hours");

    if (timeDifference >= 48) {
      setTimeout(() => {
        setSupervisorAlert(true);
      }, 1500);
    } else {
      setSupervisorAlert(false);
    }

    // console.log("L<L<", lastUpdateTime, timeDifference);
  };

  const supervisorUpdateNow = () => {
    setSupervisorAlert(false);
    navigation.navigate("ScanQRcodesupervisor", {
      scanType: "supervisor",
    });
  };

  const remaindMeLater = async () => {
    await AsyncStorage.setItem(
      "supervisorLastupdateDate",
      moment().format("DD-MM-YYYY HH:MM:SS")
    );
    setSupervisorAlert(false);
  };

  useEffect(() => {
    const checkUserCondition = async () => {
      setLoading(true);
      allSettled([
        await checkSuperVisiorTimePeriod(),
        await checkUserIsActive(
          profileDetails.employeeID.toString(),
          navigation
        ),
      ])
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };

    checkUserCondition();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setFlipped(false);
    }
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      resetFacility()
        .then(() => {
          setLoading(false);
          registergetTokenFromFCM();

          PushNotification.configure({
            onNotification: function (notification) {
              console.log("NOTIFICATION:-----", notification);
              if (notification.foreground) {
                navigation.navigate("NotificationsScreen");
              }
              // (required) Called when a remote is received or opened, or local notification is opened
              notification.finish(
                console.log("NOTIFICATION:--123---", notification)
              );
            },
          });
        })
        .catch((err) => {
          setLoading(false);
          throw new Error(`HOME PROFILE DETAILS FAILED, ${err}`);
        });
    });
    setLoading(false);
    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [props, isFocused]);

  messaging().onNotificationOpenedApp((msg) => {
    navigation.navigate("NotificationsScreen");
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        navigation.navigate("NotificationsScreen");
      }
    });

  const resetFac = async () => {
    try {
      console.log("CALEDDD RESET");
      const profileData = await profileRetrieveData();
      const defaultFacRes = await retriveUserDefaultFacility();
      let tempData = profileData;
      tempData.facilityId = defaultFacRes?.facilityId;
      tempData.facility = defaultFacRes?.facilityName;
      await profileStoreData(tempData);
      const tokenval = await profileRetrieveData();
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
      dispatch(isPendingNotifications(tokenval.employeeId));
      IsArtTestVerified(tokenval.isArtTestPending);
      setIsAddressVerified(tokenval.isAddressPending);
      setEmployeeQRcode(tokenval.empNameId);

      console.log("KMMKMKMK", tokenval.isAddressPending);

      crashlytics().setAttributes({
        name: getEmployee.name,
        employeeNo: `${getEmployee.employeeNo}`,
        facility: getEmployee.facility,
        QrPass: getEmployee.QrPass,
        employeeQrcode: getEmployee.employeeQrcode,
        isSupervisor: `${getEmployee.isSupervisor}`,
      });
    } catch (error) {
      throw new Error(`RESET FACC FAILED,${error}`);
    }
  };

  const doNotResetFac = async () => {
    try {
      const tokenval = await profileRetrieveData();
      console.log("CALEEEDDDD", tokenval);
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
      dispatch(isPendingNotifications(tokenval.employeeId));
      IsArtTestVerified(tokenval.isArtTestPending);
      setIsAddressVerified(tokenval.isAddressPending);
      setEmployeeQRcode(tokenval.empNameId);

      crashlytics().setAttributes({
        name: getEmployee.name,
        employeeNo: `${getEmployee.employeeNo}`,
        facility: getEmployee.facility,
        QrPass: getEmployee.QrPass,
        employeeQrcode: getEmployee.employeeQrcode,
        isSupervisor: `${getEmployee.isSupervisor}`,
      });
    } catch (error) {
      throw new Error(`doNotResetFac FAILED, ${error}`);
    }
  };

  const resetFacility = async () => {
    const profileData = await profileRetrieveData();
    setEmployee({
      ...getEmployee,
      name: profileData.employeeName,
      employeeNo: profileData.employeeId,
      employeeQrcode: profileData.empNameId,
      facility: profileData.facility,
      QrPass: profileData.qrPassCode,
      notify: profileData.hasNotification,
      isSupervisor: profileData.isSpuervisor,
      facilityLogo: profileData.facilityLogo,
    });
    const attendanceProfileRes = await dispatch(
      getattendancesProfileDetails([profileData.employeeId, "Self", ""])
    );

    if (
      (attendanceProfileRes?.payload?.lastClockInTime === null &&
        attendanceProfileRes?.payload?.clockOutTime === null) ||
      (attendanceProfileRes?.payload?.clockOutTime !== null &&
        attendanceProfileRes?.payload?.lastClockInTime !== null)
    ) {
      await resetFac();
    } else if (
      attendanceProfileRes?.payload?.lastClockInTime !== null &&
      attendanceProfileRes?.payload?.clockOutTime === null
    ) {
      // const worldClockTime = await socialNetworksAPI.currentTimeApiGet();
      const worldClockTime: any = moment().utc();
      const utcClockIn = moment(attendanceProfileRes?.payload?.lastClockInTime)
        .utc()
        .format("YYYY-MM-DDTHH:mm[Z]");
      let newtime1 = new Date(utcClockIn);
      let test = moment(new Date(worldClockTime)).tz(timeZonecheckval);

      let newSecondVal1 = test.diff(newtime1, "seconds");
      var h1 = Math.floor(newSecondVal1 / 3600);
      var m1 = Math.floor((newSecondVal1 % 3600) / 60);
      var mDisplay1 = m1 > 0 ? m1 : "00";
      var hDisplay1 = h1 > 0 ? h1 : "00";
      if (Number(hDisplay1) >= 16) {
        await resetFac();
      } else {
        await doNotResetFac();
      }
    } else {
      await doNotResetFac();
    }
  };

  // console.log(
  //   "UHUHUHUHU",
  //   moment().utc(),
  //   "2023-04-21T03:50Z",
  //   moment(new Date("2023-04-21T03:50Z")).tz(timeZonecheckval),
  //   moment(new Date(moment().utc())).tz(timeZonecheckval)
  // );

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;
    if (isClicked) {
      navigation.navigate("NotificationsScreen");
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };

  messaging().onMessage(async (remoteMessage) => {
    await dispatch(isPendingNotifications(getEmployee.employeeNo));
  });

  async function registergetTokenFromFCM() {
    try {
      // Ignore all that permission request stuff. You need to do it but it is UNRELATED to tokens.
      // Handle your permissions separately. Ideally with react-native-permissions

      // From the example https://rnfirebase.io/messaging/server-integration#saving-tokens
      const token = await messaging().getToken();

      console.log("we have a token and should do something with it: " + token);
      // Alert.alert(token);
      if (token) {
        let newToken = { newToken: token };
        tokenStoreData(newToken).then((to) => {
          console.log("--tokenRes--newValcurrent", newToken);
        });
        // alert(token);
        // await AsyncStorage.setItem(Constants.FCM_TOKEN, token);
      }

      // Listen to whether the token changes
      let tokenRefreshListenerUnsubscriber = messaging().onTokenRefresh(
        (tokens) => {
          let newToken = { newToken: tokens };
          tokenStoreData(newToken).then((to) => {});
          // alert(token);
        }
      );
    } catch (e) {
      let error = `token registration failed? ${e}`;
      Alert.alert(error);
      console.error("token registration failed?", e);
    }
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

  const onAttendancePress = async () => {
    setFacilityPopup(false);
    navigation.navigate("AttendanceHomeScreen", {
      ...getDateTimeDetails(),
      isGpsAttendance: false,
      facilityName: getEmployee.facility,
      facilityLogo: getEmployee.facilityLogo,
    });
  };

  const onGpsAttendancePress = () => {
    navigation.navigate("AttendanceHomeScreen", {
      ...getDateTimeDetails(),
      isGpsAttendance: true,
    });
  };

  const screenContainerHeight =
    Platform.OS === "android"
      ? {
          height: isFlipped ? SCREEN_HEIGHT / 1.2 : SCREEN_HEIGHT / 1.6,
        }
      : {};

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.mainContainer}>
          <MainNavigationHeader navigation={navigation} isDisabled={false} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
              <View style={styles.CardContainer}>
                {!isFlipped && (
                  <View style={styles.welcomeText}>
                    <Text style={[styles.welcomeTop, { fontSize: wp(22) }]}>
                      {translation.Home.welcome}
                    </Text>
                    <Text style={[styles.signInName, { fontSize: wp(25) }]}>
                      {getEmployee.name}
                    </Text>
                  </View>
                )}
                <FlipComponent
                  isFlipped={isFlipped}
                  rotateDuration={500}
                  frontView={
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setFlipped(true);
                        }}
                        style={styles.RadioContainer}
                        // underlayColor={COLORS.White}
                      >
                        <View>
                          <View style={styles.idcard_bg}>
                            <Image
                              style={styles.profileImage}
                              source={require("../../assets/icons/logo.png")}
                            />
                            <Text style={styles.entry_label}>
                              {translation.Login.EntryPass}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.idText}>
                              {translation.Home.digital_id_card}
                            </Text>
                          </View>
                          <View style={styles.divider} />
                          <View style={styles.qrcode}>
                            <View style={styles.idcard}>
                              <View style={{ flexDirection: "row" }}>
                                <Text style={styles.welcome}>
                                  {translation.Home.emp_no}
                                </Text>
                                <Text style={styles.empData}>
                                  {getEmployee.employeeQrcode}
                                </Text>
                              </View>
                              <View style={{ flexDirection: "row" }}>
                                <Text style={styles.facility}>
                                  {translation.Home.reg_fac}
                                </Text>
                                <Text style={styles.empfacility}>
                                  {getEmployee.facility}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.qrimage}>
                              <QRCode
                                value={getEmployeeQRcode}
                                size={55}
                                logoMargin={4}
                                backgroundColor="white"
                              />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.shortcutLayout}>
                        <View>
                          <Text style={styles.shortcutHeading}>
                            {translation.Home.shortcuts}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                            marginTop: hp(27),
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              // justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{
                                position: "absolute",
                                width: wp(20),
                                height: wp(20),
                                zIndex: wp(1),
                                top: -5,
                                right: wp(20),
                              }}
                              source={
                                isAddressVerified === false
                                  ? require("../../assets/icons/Checked-Green.png")
                                  : require("../../assets/icons/Pending-Red.png")
                              }
                            />
                            <TouchableHighlight
                              style={[
                                styles.drawerComponentsRow,
                                // { marginLeft: wp(43), marginTop: hp(6) },
                              ]}
                              underlayColor={COLORS.LightGrey}
                              onPress={() => {
                                let emplyeedata = {
                                  isFacilityVerfied: true,
                                  facilityId: getEmployee.employeeNo,
                                };

                                addressVerficationFacilityStoreData(
                                  emplyeedata
                                );
                                navigation.navigate("AddressTabs");
                              }}
                            >
                              <View style={styles.componentImageBackground}>
                                <Image
                                  style={styles.componentImage}
                                  source={require("../../assets/icons/Address.png")}
                                />
                              </View>
                            </TouchableHighlight>
                            <Text style={styles.componentTitle}>
                              {translation.Home.address_vertification}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",

                              alignItems: "center",
                              marginHorizontal: wp(15),
                            }}
                          >
                            <TouchableHighlight
                              style={[styles.drawerComponentsRow]}
                              underlayColor={COLORS.LightGrey}
                              onPress={onAttendancePress}
                            >
                              <View style={styles.componentImageBackground}>
                                <Image
                                  style={styles.componentImage}
                                  source={require("../../assets/icons/timer.png")}
                                />
                              </View>
                            </TouchableHighlight>
                            <Text
                              style={[
                                styles.componentTitle,
                                {
                                  textAlign: "center",
                                },
                              ]}
                            >
                              {translation.Home.attendence}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{
                                position: "absolute",
                                width: wp(20),
                                height: wp(20),
                                zIndex: wp(1),
                                top: -5,
                                right: wp(20),
                              }}
                              source={
                                isArtTestPending
                                  ? require("../../assets/icons/Pending-Red.png")
                                  : require("../../assets/icons/Checked-Green.png")
                              }
                            />
                            <TouchableHighlight
                              style={[styles.drawerComponentsRow]}
                              underlayColor={COLORS.LightGrey}
                              onPress={() => {
                                navigation.navigate("ArtTestHome");
                              }}
                            >
                              <View style={styles.componentImageBackground}>
                                <Image
                                  style={styles.componentImage}
                                  source={require("../../assets/icons/ART-Test.png")}
                                />
                              </View>
                            </TouchableHighlight>

                            <Text style={[styles.componentTitle, {}]}>
                              {translation.Home.art_test}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "center",
                              marginVertical: hp(10),
                            }}
                          >
                            <TouchableHighlight
                              style={[styles.drawerComponentsRow]}
                              underlayColor={COLORS.LightGrey}
                              onPress={() => {
                                navigation.navigate("VaccinationHome");
                              }}
                            >
                              <View style={styles.componentImageBackground}>
                                <Image
                                  style={styles.componentImage}
                                  source={require("../../assets/icons/Vaccination.png")}
                                />
                              </View>
                            </TouchableHighlight>

                            <Text style={[styles.componentTitle, {}]}>
                              {translation.Home.Vaccination}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "center",
                              marginVertical: hp(10),
                              marginHorizontal: wp(15),
                            }}
                          >
                            <TouchableHighlight
                              style={[styles.drawerComponentsRow]}
                              underlayColor={COLORS.LightGrey}
                              onPress={onGpsAttendancePress}
                            >
                              <View style={styles.componentImageBackground}>
                                <MaterialCommunityIcons
                                  name="crosshairs-gps"
                                  size={hp(25)}
                                  color={"#665DE5"}
                                />
                              </View>
                            </TouchableHighlight>

                            <Text style={[styles.componentTitle, {}]}>
                              {translation.Home.gps_attendance}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  }
                  backView={
                    <>
                      <EmployeeDetailsScreen
                        resetFlip={() => setFlipped(false)}
                      />
                    </>
                  }
                  containerStyles={{
                    flex: 1,
                    // height: isFlipped ? SCREEN_HEIGHT / 1.2 : SCREEN_HEIGHT / 1.4,
                    ...screenContainerHeight,
                  }}
                />
              </View>
            </View>
          </ScrollView>
          {isSuperVisorAlert ? (
            <SupervisorVerificationPopup
              isVisible={isSuperVisorAlert}
              onRequestClose={remaindMeLater}
              updateNow={supervisorUpdateNow}
            />
          ) : (
            <></>
          )}
          {isLoading && <LoaderView loading={isLoading} />}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Home;
