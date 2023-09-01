import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants/color";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import {
  attendanceScanStoreData,
  retriveUserDefaultFacility,
} from "../../store/User/UserDetails";

import LoaderView from "../../components/Loader";
import PhotoImage from "../../assets/images/PhotoImage.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getEmployeeDetails } from "../../store/Employee/Employee";
import { attendance_styles, profilepage_styles } from "../../utils/Styles";
import translation from "../../assets/translations/translate";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";
import { ScrollView } from "react-native-gesture-handler";
import { Buttons } from "../../components/Buttons";
import { getProfileDetails } from "../../store/Profile/Profile";
import { profileRetrieveData } from "../../store/User/UserDetails";
import RNFetchBlob from "rn-fetch-blob";
import {
  ClockIn,
  attendanceAcknowledgeApi,
  ClockOut,
  uploadAttendanceImage,
} from "../../utils/AttendenceQrAPI";
import {
  getattendancesProfileDetails,
  updateAction,
  AttendancesProfileDetails,
} from "../../store/Attendances/Attendances";
import moment from "moment-timezone";
import { timeZonecheck } from "../../store/User/UserDetails";
import {
  attendanceScanRetrieveData,
  profileStoreData,
  currentTimeStoreData,
  currentTimeRetrieveData,
} from "../../store/User/UserDetails";
import { getDistance, getPreciseDistance } from "geolib";
import Geolocation, {
  getCurrentPosition,
  PositionError,
} from "react-native-geolocation-service";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { socialNetworksAPI } from "../../utils";
import { attendanceStaffAPI } from "../../utils/AttendanceNetworkAPI";
import AcknowledgementPopup from "../../components/AcknowledgementPopup";
import SignatureComponent from "../../components/SignatureComponent";
import QrScanner from "../../components/QrScanner";
import crashlytics from "@react-native-firebase/crashlytics";
import NavigationHeader from "../../components/NavigationHeader";
import { GeoLocService } from "../../utils/geo-location";

interface AckPopupProps {
  isAckPopUpVisible: boolean;
  isSignaturePadVisible: boolean;
  isQrScannerVisible: boolean;
}

var allSettled = require("promise.allsettled");

const AttendancePreview = ({ route }) => {
  const navigation = useNavigation();
  const userState = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );

  const profileDetails = useSelector(
    (state: RootState) => state.attendanceprofileState.attendanceDetails
  );
  const [isLoading, setisLoading] = useState(false);
  const [isSupervisor, setSupervisor] = useState(false);
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);
  let timeZonecheckval = timeZonecheck();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isClockIn, setClockIn] = useState("");
  const [isClockOut, setClockOut] = useState("");
  const [totaltime, settotaltime] = useState("");
  const [UploadImageURI, setUploadImageURI] = useState();

  //acknowledgement popup state
  const [ackPopUpState, setAckPopUpState] = useState<AckPopupProps>({
    isAckPopUpVisible: false,
    isSignaturePadVisible: false,
    isQrScannerVisible: false,
  });

  const screenValType = route.params.type;
  const currentemployeeID = route.params.currentemployeeIDs;
  const employeeID = route.params.IDs; //props.route.params.employeeID;
  const gpsAddress = route.params.gpsAddress;
  // const logInType = props.route.params.logInType;
  let facilityConfig = route.params.facilityConfig;
  let latlongValidate = facilityConfig.isValidate;
  let facilityCoordinates = {
    latitude: facilityConfig.latitude,
    longitude: facilityConfig.longitude,
  };

  const [LocStatus, setLocStatus] = useState(false);
  const [clockState, setClockState] = useState(false);
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  let granted;
  let pdis;

  let clockInData = {};
  const isGpsAttendance = route.params.isGpsAttendance;
  const ImageUri = route.params.imgdata.uri;

  const dispatch = useDispatch();
  useEffect(() => {
    allSettled([
      dispatch(AttendancesProfileDetails([employeeID, "Self", ""]))
        .then((data) => {
          setClockIn(data.payload.clockInTime);
          setClockOut(data.payload.clockOutTime);
        })
        .catch((err) => {}),
      settingClockState(),
      requestLocationPermission(),
    ]).then((res) => {});

    const backAction = () => {
      setisLoading(false);
      if (isGpsAttendance) {
        navigation.goBack();
      } else {
        navigation.navigate("AttendanceQRScan", {
          type: screenValType,
          val: "retake",
          emploID: employeeID,
          scanval: false,
        });
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isLoggedIn, isSupervisor]);

  const settingClockState = () => {
    if (screenValType === "clockIn") {
      setClockState(true);
    } else if (screenValType === "clockOut") {
      setClockState(false);
    } else if (
      screenValType === "Other" &&
      (isClockIn === null || (isClockIn !== null && isClockOut !== null))
    ) {
      setClockState(true);
    } else {
      setClockState(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      try {
        granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (granted === RESULTS.GRANTED) {
          setLocStatus(true);
        } else {
          Alert.alert(translation.AddressVerification.enable_loc_permission);
        }
      } catch (err) {
        Alert.alert(translation.AddressVerification.enable_loc_permission);
      }
      getOneTimeLocation();
    } else {
      try {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          setLocStatus(true);

          getOneTimeLocation();
          //subscribeLocationLocation();
        } else {
          //setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getOneTimeLocation = () => {
    // setisLoading(true);
    setLocStatus(true);
    const geoLocationMethod = GeoLocService;
    if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
    geoLocationMethod.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        console.log("I m inside ");
        let initialRegion = {};
        initialRegion.latitude = position.coords.latitude;
        initialRegion.longitude = position.coords.longitude;
        initialRegion.latitudeDelta = 0.0922;
        initialRegion.longitudeDelta = 0.0421;

        setCurrentMarkerCordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setLocStatus(false);
      },
      {
        enableHighAccuracy: true,
        accuracy: { android: "high", ios: "best" },
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  const calculatePreciseDistance = () => {
    if (facilityConfig.latitude !== null && facilityConfig.longitude !== null) {
      console.log(facilityCoordinates, " ", currentMarkerCordinates);
      pdis = getPreciseDistance(facilityCoordinates, currentMarkerCordinates);
      return pdis;
    }
    // alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };

  // const splitedAarry = isGpsAttendance ? ImageUri : ImageUri.split("/");
  const splitedAarry = ImageUri.split("/");
  const FileName = splitedAarry[splitedAarry.length - 1];

  const realPath = isGpsAttendance
    ? ImageUri
    : Platform.OS === "ios"
    ? ImageUri.replace("file://", "")
    : ImageUri;

  let data = [
    {
      name: "file",
      type: Platform.OS === "ios" ? "image/png" : "image/PNG",
      filename: FileName,
      data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
    },
  ];

  console.log("IMAGE UPLOAD DATA", data);

  function callView(typecondition) {
    attendanceStaffAPI
      .postAttendancePushforNotificationAPI(employeeID, "en")
      .then(async (tokenRes: any) => {
        if (tokenRes.status === 200) {
          if (typecondition === "success") {
            navigation.navigate("AttendanceSuccess", {
              item: {
                employeeID: employeeID,
                isGpsAttendance: isGpsAttendance,
              },
            });
            setisLoading(false);
          } else {
            navigation.navigate("AttendanceQRScan", {
              type: screenValType,
              val: "retake",
              emploID: employeeID,
              scanval: false,
            });
            setisLoading(false);
          }
        } else {
          setisLoading(false);
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.Attendance.process_clockin
          );
        }
      })
      .catch((err) => {
        console.log("ERRRRR", err);
        crashlytics().log(`PUSH NOTIFICATION API FAILED,${err}`);
        crashlytics().recordError(err);
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("403")) {
          Alert.alert(err);
        } else if (err.toString().includes("404")) {
          console.log("ERRR", err);
          Alert.alert(err);
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else {
          alert(translation.Attendance.pls_try_again);
        }
      });
  }

  function onBackBtn() {
    let todaydate = new Date();
    todaydate.setDate(todaydate.getDate() - 6);
    let datesend = moment(todaydate.toString() + "Z")
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");
    let todaydateend = new Date(datesend);
    let todaydatestart = new Date();
    if (isGpsAttendance) {
      navigation.goBack();
    } else {
      navigation.navigate("AttendanceHomeScreen", {
        employeeID: employeeID,
        multiStartdate: todaydatestart,
        multiEnddate: todaydateend,
        singleStartdates: todaydatestart,
        singleEnddates: todaydatestart,
        isSupervisor: isSupervisor,
        isGpsAttendance: isGpsAttendance,
      });
    }
  }

  const ClockEmployee = async (
    employeeIDs: any,
    clockInDatas: any,
    ackType?: any
  ) => {
    const profileResp = await profileRetrieveData();
    const defaultfacResp = await retriveUserDefaultFacility();
    const facId =
      profileResp?.facilityId === defaultfacResp?.facilityId
        ? 0
        : profileResp?.facilityId ?? 0;

    if (
      isClockIn === null ||
      (isClockIn !== null && isClockOut !== null) ||
      profileDetails.showclockIn15HoursLapsed === true
    ) {
      return await uploadAttendanceImage(data)
        .then(async (resp) => {
          console.log("UPLOAD IMAGE RES", resp);
          let downloadURI = JSON.parse(resp.data);
          setUploadImageURI(downloadURI.result);
          clockInDatas = { clockInImageUrl: downloadURI.result };

          const clockinMethod = isGpsAttendance
            ? attendanceStaffAPI.gpsAttendancClockineApi(employeeIDs, {
                ClockInImageUrl: downloadURI.result,
                LanguageCode: "EN",
                location: gpsAddress,
                Longitude: `${route?.params?.gpsCoordinates?.latitude}`,
                Latitude: `${route?.params?.gpsCoordinates?.longitude}`,
              })
            : ClockIn(employeeIDs, clockInDatas, facId);

          return clockinMethod
            .then((resp) => {
              if (employeeID === userState.employeeID) {
                let profiledata = {
                  employeeId: employeeIDs,
                  clockInOutFor: "self",
                  clockInCompleted: "Yes",
                  clockOutCompleted: "No",
                };
                return attendanceScanStoreData(profiledata).then((tokenRes) => {
                  if (ackType === "skip") {
                    return callView("success");
                  }
                  return resp;
                });
              } else {
                return callView("unsuccess");
              }
            })
            .catch((err) => {
              crashlytics().log(`CLOCKIN METHOD FAILED,${err}`);
              crashlytics().recordError(err);
              setisLoading(false);
              if (
                err !== "undefined" &&
                err.toString().includes("Network Error")
              ) {
                setisLoading(false);
                alert(translation.AddressVerification.oops_network_err_msg);
              } else if (
                err !== "undefined" &&
                err.toString().includes("500")
              ) {
                alert(translation.Attendance.process_clockout);
              } else {
                alert(err.toString());
              }
            });
        })
        .catch((err) => {
          crashlytics().log(`CLOCKIN ATTENDANCE IMAGE UPLOAD FAILED,${err}`);
          crashlytics().recordError(err);
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            setisLoading(false);
            alert(translation.AddressVerification.oops_network_err_msg);
          } else if (err !== "undefined" && err.toString().includes("404")) {
            Alert.alert(
              translation.Attendance.alert,
              translation.Attendance.process_clockout,
              [{ text: "OK", onPress: () => onBackBtn() }],
              { cancelable: false }
            );
          } else if (err !== "undefined" && err.toString().includes("500")) {
            alert(translation.Attendance.process_clockout);
          } else {
            alert(err.toString());
          }
        });
    } else {
      setisLoading(true);
      return await uploadAttendanceImage(data)
        .then((resp: any) => {
          let downloadURI = JSON.parse(resp.data);
          setUploadImageURI(downloadURI.result);
          clockInData = { clockOutImageUrl: downloadURI.result };

          const clockoutMethod = isGpsAttendance
            ? attendanceStaffAPI.gpsAttendanceClockoutApi(employeeIDs, {
                ClockOutImageUrl: downloadURI.result,
                location: gpsAddress,
                Longitude: `${route?.params?.gpsCoordinates?.latitude}`,
                Latitude: `${route?.params?.gpsCoordinates?.longitude}`,
              })
            : ClockOut(employeeID, clockInData);
          crashlytics().setAttribute(
            "ATTENDANCE CLOCKOUT API DETAILS",
            `${JSON.stringify({
              ClockOutImageUrl: downloadURI.result,
              location: gpsAddress,
              Longitude: `${route?.params?.gpsCoordinates?.latitude}`,
              Latitude: `${route?.params?.gpsCoordinates?.longitude}`,
            })}`
          );

          return clockoutMethod
            .then((resp) => {
              if (employeeID === userState.employeeID) {
                let profiledata = {
                  employeeId: employeeID,
                  clockInOutFor: "self",
                  clockInCompleted: "Yes",
                  clockOutCompleted: "Yes",
                };
                setisLoading(false);
                return attendanceScanStoreData(profiledata).then((tokenRes) => {
                  if (ackType === "skip") {
                    return callView("success");
                  }
                  return resp;
                });
              } else {
                return callView("unsuccess");
              }
            })
            .catch((err) => {
              crashlytics().log(`CLOCK OUT METHOD API FAILED,${err}`);
              crashlytics().recordError(err);
              setisLoading(false);

              if (
                err !== "undefined" &&
                err.toString().includes("Network Error")
              ) {
                alert(translation.AddressVerification.oops_network_err_msg);
              } else if (
                err !== "undefined" &&
                err.toString().includes("404")
              ) {
                Alert.alert(
                  translation.Attendance.alert,
                  translation.Attendance.process_clockin,
                  [{ text: "OK", onPress: () => onBackBtn() }],
                  { cancelable: false }
                );
              } else if (
                err !== "undefined" &&
                err.toString().includes("500")
              ) {
                Alert.alert(
                  translation.Attendance.alert,
                  translation.Attendance.process_clockin,
                  [{ text: "OK", onPress: () => onBackBtn() }],
                  { cancelable: false }
                );
              } else {
                alert(err.toString());
              }
            });
        })
        .catch((err) => {
          crashlytics().log(`CLOCK OUT ATTENDANCE IMAGE UPLOAD FAILED,${err}`);
          crashlytics().recordError(err);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          } else if (err !== "undefined" && err.toString().includes("404")) {
            Alert.alert(
              translation.Attendance.alert,
              translation.Attendance.process_clockin,
              [
                {
                  text: translation.Attendance.ok,
                  onPress: () => onBackBtn(),
                },
              ],
              { cancelable: false }
            );
          } else if (err !== "undefined" && err.toString().includes("500")) {
            alert(translation.Attendance.process_clockout);
          } else {
            alert(err.toString());
          }
        });
    }
  };

  const timerDetail =
    screenValType === "clockOut"
      ? {
          clockInTime: moment(profileDetails.clockInTime)
            .utc()
            .local()
            .format("hh : mm A"),
          clockOutTime: moment(new Date())
            .tz(timeZonecheckval)
            .format("hh : mm A"),
        }
      : {
          clockInTime: moment(new Date())
            .tz(timeZonecheckval)
            .format("hh : mm A"),
          clockOutTime: "",
        };

  const onContinuePress = async (ackType: string = "") => {
    setisLoading(true);
    await getOneTimeLocation();
    if (latlongValidate !== true) {
      return await ClockEmployee(employeeID, clockInData, ackType);
    } else if (LocStatus) {
      getOneTimeLocation();
      // let distance = calculatePreciseDistance();
      let distance = 10;
      if (distance < 100) {
        return await ClockEmployee(employeeID, clockInData, ackType);
      } else {
        setisLoading(false);
        Alert.alert(
          translation.AlertMessage.location_alert_title,
          translation.AlertMessage.loc_alert_mesaage, //TODO add translation
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("AttendanceQRScan", {
                  type: screenValType,
                  val: "retake",
                  emploID: employeeID,
                  scanval: false,
                }),
            },
          ]
        );
      }
    } else {
      setisLoading(false);
      Alert.alert(
        translation.AlertMessage.location_alert_title,
        translation.AlertMessage.on_location, //TODO add translation
        [
          {
            text: translation.Buttons_lable.Ok,
            onPress: () => requestLocationPermission(),
          },
        ]
      );
    }
  };

  const onSubmitAck = async (staffName: string = "", imageUri: any) => {
    try {
      setisLoading(true);
      const splitedAarry = imageUri.split("/");
      const FileName = splitedAarry[splitedAarry.length - 1];

      const realPath =
        Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;

      let ackData = [
        {
          name: "file",
          type: "image/png",
          filename: FileName,
          data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
        },
      ];
      setAckPopUpState((prevState) => ({
        ...prevState,
        isAckPopUpVisible: false,
        isQrScannerVisible: false,
        isSignaturePadVisible: false,
      }));
      const attendanceRes = await onContinuePress();
      if (attendanceRes?.data.result?.empTimeId !== undefined) {
        const uploadImgResp = await uploadAttendanceImage(ackData);
        let downloadURI = JSON.parse(uploadImgResp.data);

        await attendanceAcknowledgeApi(
          employeeID,
          {
            EmpTimeId: attendanceRes?.data.result?.empTimeId,
            AckImageUrl: downloadURI.result,
            StaffName: staffName,
          },
          screenValType
        );
        setisLoading(false);
        return callView("success");
      }
    } catch (error) {
      setisLoading(false);
      throw new Error(` QRSCANNER ACKNOWLEDGEMENT API FAILED,${error}`);
    }
  };

  return (
    <>
      {!ackPopUpState.isQrScannerVisible && (
        <SafeAreaView style={styles.container}>
          <NavigationHeader
            title={translation.Attendance.preview}
            onPressCallBack={() => {
              if (isGpsAttendance) {
                navigation.navigate("GpsAttendance", {
                  type: screenValType,
                  val: "retake",
                  emploID: employeeID,
                  scanval: false,
                });
              } else {
                navigation.navigate("AttendanceQRScan", {
                  type: screenValType,
                  val: "retake",
                  emploID: employeeID,
                  scanval: false,
                });
              }
            }}
          />
          <ScrollView>
            <View style={styles.previewContainer}>
              <View style={styles.NameContainer}>
                <Text style={styles.leftText1}>
                  {translation.Attendance.employee_name}:{" "}
                </Text>
                <Text style={styles.rightText}>
                  {profileDetails.employeeName}
                </Text>
              </View>
              <View style={styles.NumberContainer}>
                <Text style={styles.leftText1}>
                  {translation.Attendance.employee_no}:{" "}
                </Text>
                <Text style={styles.rightText}>
                  {profileDetails.employeeNameId}
                </Text>
              </View>
              <View style={styles.ImageContainer}>
                <Image
                  source={{ uri: route.params.imgdata.uri }}
                  style={styles.Image}
                />
              </View>
            </View>
            <View style={styles.ClockContainer}>
              {clockState ? (
                <Text style={[styles.leftText, { fontSize: hp(18) }]}>
                  {translation.Attendance.clock_in} :{" "}
                </Text>
              ) : (
                <Text style={[styles.leftText, { fontSize: hp(18) }]}>
                  {translation.Attendance.clock_out} :{" "}
                </Text>
              )}
              <Text style={[styles.rightText, { fontSize: hp(18) }]}>
                {moment(new Date()).tz(timeZonecheckval).format("hh : mm A")}
              </Text>
            </View>
            <View
              style={[
                styles.HourContainer,
                { display: clockState ? "none" : "flex" },
              ]}
            >
              <Text style={[styles.leftText, { fontSize: hp(18) }]}>
                {translation.Attendance.total_hrs}
              </Text>
              <Text style={[styles.rightText, { fontSize: hp(18) }]}>
                {totaltime + translation.Attendance.hrs}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttomContainer}>
            {isSupervisor ? (
              <Buttons
                onPress={() => ClockEmployee(employeeID, clockInData)}
                text={translation.Attendance.cont_next}
                BTNstyle={{
                  ...styles.buttonStyle,
                }}
                textStyle={{ ...styles.buttonTxt }}
                ImgStyle={undefined}
                loader={undefined}
              />
            ) : (
              <Buttons
                onPress={() => {
                  if (screenValType === "Other") {
                    onContinuePress("skip");
                  } else {
                    setAckPopUpState((prevState) => ({
                      ...prevState,
                      isAckPopUpVisible: true,
                    }));
                  }
                }}
                text={
                  screenValType === "Other"
                    ? translation.Buttons_lable.cont_next
                    : translation.Buttons_lable.confirm
                }
                BTNstyle={{
                  ...styles.buttonStyle,
                  backgroundColor: COLORS.Blue,
                }}
                textStyle={{ ...styles.buttonTxt }}
                ImgStyle={undefined}
                loader={undefined}
              />
            )}

            <Buttons
              onPress={() => {
                if (isGpsAttendance) {
                  navigation.navigate("GpsAttendance", {
                    type: screenValType,
                    val: "retake",
                    emploID: employeeID,
                    scanval: false,
                  });
                } else {
                  navigation.navigate("AttendanceQRScan", {
                    type: screenValType,
                    val: "retake",
                    emploID: employeeID,
                    scanval: false,
                  });
                }
              }}
              text={
                isGpsAttendance
                  ? translation.Attendance.retry
                  : translation.Attendance.retake
              }
              BTNstyle={{
                ...styles.buttonStyle,
                backgroundColor: COLORS.White,
              }}
              textStyle={{ ...styles.retakebuttonTxt }}
              ImgStyle={undefined}
              loader={undefined}
            />
          </View>
          {ackPopUpState.isAckPopUpVisible && (
            <AcknowledgementPopup
              isVisible={ackPopUpState.isAckPopUpVisible}
              onRequestClose={() => {
                setAckPopUpState((prevState) => ({
                  ...prevState,
                  isAckPopUpVisible: false,
                }));
              }}
              onSignaturePadPress={() => {
                setAckPopUpState((prevState) => ({
                  ...prevState,
                  isAckPopUpVisible: false,
                  isSignaturePadVisible: true,
                }));
              }}
              timerDetail={timerDetail}
              onQrScannerPress={() => {
                setAckPopUpState((prevState) => ({
                  ...prevState,
                  isAckPopUpVisible: false,
                  isQrScannerVisible: true,
                }));
              }}
              onUpdateLaterPress={() => {
                setAckPopUpState((prevState) => ({
                  ...prevState,
                  isAckPopUpVisible: false,
                }));
                onContinuePress("skip");
              }}
            />
          )}
          {ackPopUpState.isSignaturePadVisible && (
            <SignatureComponent
              isVisible={ackPopUpState.isSignaturePadVisible}
              onRequestClose={() =>
                setAckPopUpState((prevState) => ({
                  ...prevState,
                  isSignaturePadVisible: false,
                }))
              }
              empName={profileDetails.employeeName}
              onSignatureSubmitPress={onSubmitAck}
            />
          )}
        </SafeAreaView>
      )}
      {ackPopUpState.isQrScannerVisible && (
        <QrScanner
          isFocused={true}
          onRequestClose={() =>
            setAckPopUpState((prevState) => ({
              ...prevState,
              isQrScannerVisible: false,
            }))
          }
          employeeId={employeeID}
          onSuccessQrScanner={onSubmitAck}
        />
      )}

      <LoaderView loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  previewContainer: {
    marginLeft: wp(24),
    marginRight: wp(24),
    borderRadius: wp(22),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  NameContainer: {
    flexDirection: "row",
    marginTop: hp(20),

    justifyContent: "center",
    alignItems: "center",
    width: wp(305),
    height: hp(23),
    flexWrap: "wrap",
  },
  NumberContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",

    marginTop: hp(15),
    width: wp(305),
    height: hp(23),
  },
  leftText1: {
    fontFamily: FONTS.Urbanist,
    fontSize: hp(16),
    color: COLORS.Black,
  },
  leftText: {
    fontFamily: FONTS.Urbanist,
    fontSize: hp(16),
    color: COLORS.Black,
  },
  rightText: {
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(16),
    color: COLORS.Black,
  },
  ImageContainer: {
    marginTop: hp(12),
    borderRadius: wp(12),
  },
  Image: {
    height: hp(340),
    width: wp(326),
    borderRadius: wp(12),
  },
  ClockContainer: {
    flexDirection: "row",
    marginTop: hp(20),
    marginBottom: hp(12),
    alignSelf: "center",
  },
  HourContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  buttomContainer: {
    backgroundColor: COLORS.White,
    marginBottom: hp(20),
    position: "absolute",
    bottom: 10,
    marginLeft: hp(24),
    marginRight: hp(24),
  },

  buttonStyle: {
    marginTop: hp(10),
    width: wp(326),
    height: hp(55),
    alignSelf: "center",
    borderRadius: wp(8),
    alignContent: "center",
    justifyContent: "center",
    borderColor: COLORS.Blue,
    borderWidth: hp(1),
    backgroundColor: COLORS.Blue,
  },
  buttonTxt: {
    fontSize: hp(16),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },
  retakebuttonTxt: {
    fontSize: hp(16),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },
  viewcontainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column",
  },
  imagebackgroundStyle: {
    height: hp(172),
    width: wp(172),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
  },
  imageStyle: {
    height: hp(50),
    width: wp(45),

    alignItems: "center",
    justifyContent: "center",
  },

  textSytle: {
    marginTop: hp(10),
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: COLORS.Black,
    width: "70%",
  },
  secondtextSytle: {
    marginTop: hp(20),
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "center",
    color: COLORS.Black,
    width: "70%",
  },
  viewthirdStyle: {
    marginTop: hp(20),
    paddingLeft: hp(10),
    backgroundColor: COLORS.White,
    borderWidth: hp(1),
    borderRadius: hp(5),
    borderColor: COLORS.LightGrey,
    borderBottomWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 18,
    textAlign: "center",
    color: COLORS.Black,
  },

  newcontainer: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    width: "90%",
    height: hp(50),
    marginBottom: hp(10),
    borderWidth: wp(1),
    borderRadius: hp(10),
    borderBottomWidth: wp(1),
    borderColor: COLORS.LightGrey,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: hp(5),
    backgroundColor: COLORS.PurpleButton,
    marginTop: hp(30),
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },

  rightFlexStyle: {
    textAlign: "right",
    alignContent: "flex-end",
  },
  leftFlexStyle: {
    textAlign: "left",
    alignContent: "flex-start",
    marginLeft: hp(5),
    fontFamily: FONTS.Urbanist_Semibold,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: hp(24),
    marginTop: hp(26),
    marginBottom: hp(20),
    alignItems: "center",
    height: hp(40),
  },
  back: {
    backgroundColor: COLORS.LightGrey,
    width: wp(44),
    height: wp(44),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: wp(25),
    height: wp(25),
    tintColor: COLORS.DarkGrey,
  },
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
});

export default AttendancePreview;
