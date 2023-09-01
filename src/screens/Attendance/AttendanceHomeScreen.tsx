import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  AppState,
} from "react-native";
import {
  StackActions,
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
// import moment from 'moment';
import {
  appHeaderStyles,
  attendance_styles,
  profilepage_styles,
} from "./../../utils/Styles";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import * as Progress from "react-native-progress";
import { COLORS } from "../../constants/color";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AttendanceList from "../Attendances/AttendanceList";
import { socialNetworksAPI } from "../../utils";
import { FONTS } from "../../constants/font";
import Message from "../../assets/images/Message.svg";
import CalendarImage from "../../assets/images/Calendar.svg";
import CalendarView from "../../components/CalendarView";
import LoaderView from "../../components/Loader";
import {
  attendanceScanRetrieveData,
  profileStoreData,
  profileRetrieveData,
  currentTimeStoreData,
  currentTimeRetrieveData,
} from "../../store/User/UserDetails";
import Required from "../../assets/images/Required.svg";
import { timeZonecheck } from "../../store/User/UserDetails";
import { attendanceStaffAPI } from "../../utils/AttendanceNetworkAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getattendancesProfileDetails,
  updateAction,
} from "../../store/Attendances/Attendances";
import { Config } from "./../../utils/Config";
import moment from "moment-timezone";
import FacilityChangePopup from "../../components/FacilityChangePopup";
import { ImageViewerProps } from "../../utils/interface-helpers/common-interface";
import ImageZoomViewerPopup from "../../components/ImageZoomViewerPopup";
import Ionicons from "react-native-vector-icons/Ionicons";
import Tooltip from "rn-tooltip";
import NavigationHeader from "../../components/NavigationHeader";
import styles from "./styles";
import { checkUserPerimeter } from "./AttendanceUtilsFunction";
import { getPreciseDistance } from "geolib";
import OutOfRangePopup from "../../components/OutOfRangePopup";
import {
  getProfileDetails,
  getUserCurrentLocation,
} from "../../store/Profile/Profile";
import { GeoLocService } from "../../utils/geo-location";

const BaseURL = Config.BASE_URL;

const AttendanceHomeScreen = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const profileDetails = useSelector(
    (state: RootState) => state.attendanceprofileState.attendanceProfileDetails
  );

  const { profileDetails: userDetails, userLocation } = useSelector(
    (state: RootState) => state.profileState
  );

  const refresh = useSelector(
    (state: RootState) => state.attendanceprofileState.refresh
  );

  const [isSupervisor, setIsSupervisor] = useState(
    props.route.params.isSupervisor
  );
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  const [isAllowFacilityChange, setAllowFacilityChange] = useState(false);

  const [isClockedIn, setClockedIn] = useState(false);
  const [isReClockedIn, setReClockedIn] = useState(false);
  const [isShowDetails, setShowDetails] = useState(false);

  const [isShown, setisShown] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [employeeIdval, setemployeeIdval] = useState(
    props.route.params.employeeID
  );
  const [attendanceList, setAttendanceList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const [calendarTypeval, setcalendarTypeval] = useState("Multiple");

  const [selfButSel, setselfButSel] = useState(true);
  const [allStaffButSel, setallStaffButSel] = useState(false);
  const [differnceTime, setdiffernceTime] = useState("");

  const [clockedInval, setclockedInval] = useState("");
  const [lastClockIn, setLastClockIn] = useState("");
  const [clockedOutval, setclockedOutval] = useState("");
  const [currentTime, setcurrentTime] = useState(0.0);
  const [screenreloaded, setscreenreloaded] = useState(false);
  const [isFacilityPopup, setFacilityPopup] = useState<boolean>(false);
  const [isOutofRangePopup, setOutofRangePopup] = useState<boolean>(false);

  //Multiple------
  const [startmultidate, setstartmultiDate] = useState<Date | undefined>(
    props.route.params.multiStartdate
  );
  const [endmultidate, setendMultiDate] = useState<Date | undefined>(
    props.route.params.multiEnddate
  );

  //Single------
  const [singlestartdate, setsinglestartdate] = useState<Date | undefined>(
    props.route.params.singleStartdates
  );
  const [singleenddate, setsingleenddate] = useState<Date | undefined>(
    props.route.params.singleEnddates
  );

  //image zoom viewer
  const [imageViewerState, setImageViewerState] = useState<ImageViewerProps>({
    isImageViewer: false,
    imageUrl: "",
  });

  //app state
  // const [appState, setAppState] = useState(AppState.currentState);

  let timeZonecheckval = timeZonecheck();

  // const isScreenFocus = useRef(true);

  useEffect(() => {
    disableAllLoader();
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        reloaddata();
      }
    };

    const appStateSubscribe = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    setcalendarTypeval("Multiple");
    onSelfToggleChange();

    return () => {
      appStateSubscribe.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloaddata();
    }, [screenreloaded, profileDetails.needtoreload])
  );

  /**
   * Disable all loader
   */
  const disableAllLoader = () => {
    setisLoading(false);
    setRefreshing(false);
  };

  /**
   * Reload the User Attendance Profile details
   * Attenadnce list based on the selected date in the calendar
   */
  const reloaddata = async () => {
    setRefreshing(false);
    setisLoading(true);

    try {
      dispatch(getattendancesProfileDetails([employeeIdval, "Self", ""])).then(
        async (data: any) => {
          console.log("ATTENDANCE PROFILE DATA", data);
          disableAllLoader();
          setisLoading(true);
          const utcClockIn = moment(data?.payload?.clockInTime)
            .utc()
            .format("YYYY-MM-DDTHH:mm[Z]");

          const utcClockOut = moment(data?.payload?.clockOutTime)
            .utc()
            .format("YYYY-MM-DDTHH:mm[Z]");
          const utcLastClockIn = moment(data?.payload?.lastClockInTime)
            .utc()
            .format("YYYY-MM-DDTHH:mm[Z]");

          if (
            data.payload.clockInTime === null &&
            data.payload.clockOutTime === null
          ) {
            setdiffernceTime("00 : 00");
            setclockedInval("00 : 00");
            setLastClockIn("00 : 00");
            setClockedIn(false);
            disableAllLoader();
            // setbuttonClockIn(false);
          } else if (
            data.payload.clockInTime !== null &&
            data.payload.clockOutTime === null
          ) {
            let valclockIn = moment(utcClockIn).local().format("hh : mm A");

            setReClockedIn(false);
            setClockedIn(true);
            setclockedInval(valclockIn);
            setLastClockIn(moment(utcLastClockIn).local().format("hh : mm A"));
            calculteFortenmin(utcLastClockIn);
          } else if (
            data.payload.clockInTime !== null &&
            data.payload.clockOutTime !== null
          ) {
            await reclockinScreen();
            let valclockIn = moment(utcClockIn).local().format("hh : mm A");
            let valclockOut = moment(utcClockOut).local().format("hh : mm A");
            setclockedInval(valclockIn);
            setclockedOutval(valclockOut);
            setLastClockIn(moment(utcLastClockIn).local().format("hh : mm A"));
            calculteFortenmin(utcClockOut);
          }

          if (calendarTypeval === "Multiple") {
            async function listdata() {
              let s1 = moment(startmultidate)
                .tz(timeZonecheckval)
                .format("YYYY-MM-DD");
              let s2 = moment(endmultidate)
                .tz(timeZonecheckval)
                .format("YYYY-MM-DD");
              await getAttendanceList(s1, s2);
            }
            listdata();
          }
        }
      );
    } catch (error) {
      if (error !== "undefined" && error.toString().includes("Network Error")) {
        alert(translation.AddressVerification.oops_network_err_msg);
      } else {
        Alert.alert(error.toString());
      }
    }
  };

  /**
   * Enable the reclock in
   */
  async function reclockinScreen() {
    setReClockedIn(true);
    setClockedIn(false);
  }

  function calculteFortenmin(clockIndateTime) {
    const utcTime: any = moment().utc();

    let newtime1 = new Date(clockIndateTime);
    let test = moment(new Date(utcTime)).tz(timeZonecheckval);

    let newSecondVal1 = test.diff(newtime1, "seconds");

    var h1 = Math.floor(newSecondVal1 / 3600);
    var m1 = Math.floor((newSecondVal1 % 3600) / 60);

    var mDisplay1 = m1 > 0 ? m1 : "00";
    var hDisplay1 = h1 > 0 ? h1 : "00";

    if (Number(hDisplay1) >= 16) {
      if (isClockedIn) setClockedIn(false);
    } else if (Number(mDisplay1) < 10 && Number(hDisplay1) == 0) {
    } else if (Number(mDisplay1) > 10) {
      // clearInterval(interval1);
    }
    disableAllLoader();
  }

  /**
   * Get Attendance List API CALL
   */
  async function getAttendanceList(startmulDate: String, endmulDate: String) {
    try {
      console.log("CALESSSSSS");
      setisLoading(true);
      setAttendanceList([]);
      const tokenval = await profileRetrieveData();
      setemployeeIdval(tokenval.employeeId);
      setIsSupervisor(tokenval.isSpuervisor);
      setAllowFacilityChange(tokenval.isAlowToWorkForOtherFailities);
      setisAllowedEmployeeMobileForOthers(
        tokenval.isAllowedEmployeeMobileForOthers
      );
      const dateData = {
        startDate: startmulDate,
        endDate: endmulDate,
      };
      const attendanceStaffApiRes =
        await attendanceStaffAPI.attendanceFilterListApiPost(
          tokenval.employeeId,
          dateData
        );
      const historyData = attendanceStaffApiRes?.data?.result;
      setAttendanceList(historyData);
      disableAllLoader();
    } catch (error) {
      disableAllLoader();
      throw new Error(`GET ATTENDANCE LIST METHOD FAILED, ${error}`);
    }
  }

  function tConvert(time) {
    // Check correct time format and split into components
    if (time !== null) {
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join(""); // return adjusted time or original string
    }
  }

  function setStatesForSelfAttendance() {
    setselfButSel(true);
    setallStaffButSel(false);
    setcalendarTypeval("Multiple");
  }

  /**
   * Calendar on Toggle date selection
   */
  const tooglemodel = (
    calendartype: any,
    startsingleDateVal: Date,
    endsingleDateVal: Date,
    startmultiDateVal: Date,
    endmultiDateVal: Date
  ) => {
    let multistartdateform = moment(startmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");

    let multienddateform = moment(endmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");
    setstartmultiDate(startmultiDateVal);
    setendMultiDate(endmultiDateVal);
    setsingleenddate(endsingleDateVal);
    setsinglestartdate(startsingleDateVal);
    setcalendarTypeval(calendartype);
    setisShown(false);

    if (calendarTypeval === "Multiple") {
      async function listdata() {
        await getAttendanceList(
          moment(startsingleDateVal).tz(timeZonecheckval).format("YYYY-MM-DD"),
          moment(endsingleDateVal).tz(timeZonecheckval).format("YYYY-MM-DD")
        );
      }
      listdata();
    }
  };

  /**
   * Pull On Refresh
   */

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (screenreloaded == false) {
      setscreenreloaded(true);
    }
    await reloaddata();
    setstartmultiDate(props.route.params.multiStartdate);
    setendMultiDate(props.route.params.multiEnddate);
    setsinglestartdate(props.route.params.singleStartdates);
    setsingleenddate(props.route.params.singleEnddates);

    if (calendarTypeval === "Multiple") {
      async function listdata() {
        await getAttendanceList(
          moment(singlestartdate).tz(timeZonecheckval).format("YYYY-MM-DD"),
          moment(singleenddate).tz(timeZonecheckval).format("YYYY-MM-DD")
        );
      }
      listdata();
    }
    disableAllLoader();
  }, []);

  /**
   * On Toggele change for All staff and self tabs
   */

  const onCalendayTypeHandler = useCallback(async () => {
    setsinglestartdate(props.route.params.singleStartdates);
    setsingleenddate(props.route.params.singleEnddates);
    setstartmultiDate(props.route.params.multiStartdate);
    setendMultiDate(props.route.params.multiEnddate);
    if (calendarTypeval === "Multiple") {
      let multistartdateform = moment(props.route.params.singleStartdates)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let multienddateform = moment(props.route.params.singleEnddates)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      return await getAttendanceList(multistartdateform, multienddateform);
    }
  }, [calendarTypeval]);

  /**
   * Setting the initial params when we apply self toggle
   */
  const onSelfToggleChange = () => {
    setsinglestartdate(props.route.params.singleStartdates);
    setsingleenddate(props.route.params.singleEnddates);
    setstartmultiDate(props.route.params.multiStartdate);
    setendMultiDate(props.route.params.multiEnddate);
  };

  /**
   * Self Handle Change
   */
  const selfHandleChange = async () => {
    onSelfToggleChange();
    setselfButSel(true);
    setallStaffButSel(false);
    setcalendarTypeval("Multiple");
    return await onCalendayTypeHandler();
  };

  /**
   * All Staff Handle Change
   */

  const allStaffHandleChange = async () => {
    onSelfToggleChange();
    setcalendarTypeval("Single");
    setselfButSel(false);
    setallStaffButSel(true);
    return await onCalendayTypeHandler();
  };

  /**
   * Attendance List view
   */
  const attendanceListView = attendanceList.map((item: any, index) => {
    return (
      <View style={styles.attendanceViewStyle} key={index}>
        <TouchableOpacity
          onPress={() => {
            let clickedDate = moment(new Date(item.clockInTime))
              .tz(timeZonecheckval)
              .format("YYYY-MM-DDThh:mm:ss");

            if (
              item.isRequestSubmitted === false &&
              item.isAbsent === false &&
              item.isWeekend === false
            ) {
              let newArraypassed = {
                currentClickedDate:
                  item.clockInTime == null ? item.date : item.clockInTime,
                date: item.date,
                day: item.day,
                empTimeID: item.empTimeID,
                employeeId: item.employeeId,
                isRequestSubmitted: item.isRequestSubmitted,
              };

              navigation.navigate("AttendanceDetail", {
                attendanceItemArray: newArraypassed,
                screentype: "",
                tabType: "Self",
              });
            }
          }}
        >
          <View style={styles.attendanceListCard}>
            <View style={styles.attendanceTextStyle}>
              <Text style={styles.textstyleView}>
                {moment(new Date(item.date)).tz(timeZonecheckval).format("DD") +
                  " " +
                  item.day.toUpperCase()}
              </Text>
            </View>
            <View style={styles.clockinclockOutViewSytle}>
              {item.isWeekend ? (
                <Text style={styles.requiredIcon1}>
                  {translation.Attendance.Weekend}
                </Text>
              ) : item.isAbsent ? (
                <Text style={styles.requiredIcon1}>
                  {translation.Attendance.NoAttendance}
                </Text>
              ) : !item.isRequestSubmitted ? (
                <Text style={styles.clockinclockoutView}>
                  {(item.clockInTime !== null
                    ? moment(item.clockInTime).format("hh : mm A")
                    : "00:00") +
                    " - " +
                    (item.clockOutTime !== null
                      ? moment(item.clockOutTime).format("hh : mm A")
                      : "00:00")}
                </Text>
              ) : (
                <Required style={styles.requiredIcon} width={113} height={25} />
              )}
              <View
                style={{
                  width: wp(150),
                  height: hp(2),
                  backgroundColor: COLORS.LightGrey,
                  marginLeft: wp(0),
                }}
              />
            </View>

            <Text style={styles.totalTimeView}>
              {item.totalTime === null ? " 00:00 " : item.totalTime}
            </Text>
            {!item.isRequestSubmitted &&
            item.isAbsent === false &&
            item.isWeekend === false ? (
              <View style={styles.messageView}>
                <Message width={20} height={20} />
              </View>
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  /**
   * Facility Change handler
   */

  const onFacilityChangePress = () => {
    setFacilityPopup(false);
    navigation.navigate("FacilityChangeQrScanner", {
      type: "clockIn",
      val: "retake",
      emploID: employeeIdval,
      scanval: false,
      isGpsAttendance: false,
      isFacilityChange: true,
    });
  };

  /**
   * Proceed handler for Normal QrScnning attendance Scan
   */

  const onProceedPress = () => {
    setFacilityPopup(false);
    navigation.navigate("AttendanceQRScan", {
      type: "clockIn",
      val: "retake",
      emploID: employeeIdval,
      scanval: false,
      isFacilityChange: true,
    });
  };

  /**
   * Function for check the user location is near by the Facility coordinates
   */

  const isUserNearByLoc = async (position: any) => {
    let currLoc: any = {},
      isUserNearByRange: boolean = true;
    currLoc.latitude = position?.latitude;
    currLoc.longitude = position?.longitude;

    // currLoc.latitude = 1.327222;
    // currLoc.longitude = 103.870833;

    if (
      userDetails.listtblGPSConfigurations &&
      userDetails.listtblGPSConfigurations.length > 0
    ) {
      isUserNearByRange =
        userDetails?.listtblGPSConfigurations.length > 0 &&
        userDetails.listtblGPSConfigurations.some((configLoc, index) => {
          const pdis = getPreciseDistance(currLoc, {
            latitude: configLoc.latitude,
            longitude: configLoc.longitude,
          });

          return pdis <= configLoc.range;
        });
    } else isUserNearByRange = true;
    return isUserNearByRange;
  };

  const clockinCallback = async () => {
    if (isAllowFacilityChange === true) {
      const attendanceProfileRes = await dispatch(
        getattendancesProfileDetails([employeeIdval, "Self", ""])
      );
      if (
        (attendanceProfileRes?.payload?.lastClockInTime === null &&
          attendanceProfileRes?.payload?.clockOutTime === null) ||
        (attendanceProfileRes?.payload?.clockOutTime !== null &&
          attendanceProfileRes?.payload?.lastClockInTime !== null)
      ) {
        setFacilityPopup(true);
      } else if (
        attendanceProfileRes?.payload?.lastClockInTime !== null &&
        attendanceProfileRes?.payload?.clockOutTime === null
      ) {
        onProceedPress();
      }
    } else {
      onProceedPress();
    }
  };

  /**
   * Clock in Handler
   */

  const clockinBtnPress = async () => {
    if (props?.route?.params?.isGpsAttendance) {
      navigation.navigate("GpsAttendance", {
        emploID: employeeIdval,
        type: "clockIn",
      });
    } else if (
      userDetails.listtblGPSConfigurations &&
      userDetails.listtblGPSConfigurations.length > 0
    ) {
      const geoLocationMethod = GeoLocService;

      if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
      setisLoading(true);
      geoLocationMethod.getCurrentPosition(
        async (position) => {
          const currLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const isUserRange = await isUserNearByLoc(currLoc);
          setisLoading(false);
          if (isUserRange) await clockinCallback();
          else setOutofRangePopup(true);
        },
        (error) => {
          setisLoading(false);
          Alert.alert(
            translation.AlertMessage.location_service,
            translation.AlertMessage.location_alert,
            [
              {
                text: translation.Buttons_lable.Ok,
              },
            ]
          );
        },
        {
          // enableHighAccuracy: Platform.OS === "ios" ? true : false,
          enableHighAccuracy: true,
          accuracy: { android: "high", ios: "best" },
          timeout: 30000,
          maximumAge: 1000,
        }
      );
    } else {
      clockinCallback();
    }
  };

  /**
   * Clock out Handler
   */

  const clockoutBtnPress = async () => {
    if (props?.route?.params?.isGpsAttendance) {
      navigation.navigate("GpsAttendance", {
        emploID: employeeIdval,
        type: "clockOut",
      });
    } else {
      if (
        userDetails.listtblGPSConfigurations &&
        userDetails.listtblGPSConfigurations.length > 0
      ) {
        const geoLocationMethod = GeoLocService;

        if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
        setisLoading(true);
        geoLocationMethod.getCurrentPosition(
          async (position) => {
            const currLoc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            const isUserRange = await isUserNearByLoc(currLoc);
            setisLoading(false);
            if (isUserRange) {
              navigation.navigate("AttendanceQRScan", {
                type: "clockOut",
                val: "retake",
                emploID: employeeIdval,
                scanval: false,
              });
            } else {
              setOutofRangePopup(true);
            }
          },
          (error) => {
            setisLoading(false);
            Alert.alert(
              translation.AlertMessage.location_service,
              translation.AlertMessage.location_alert,
              [
                {
                  text: translation.Buttons_lable.Ok,
                },
              ]
            );
          },
          {
            enableHighAccuracy: true,
            accuracy: { android: "high", ios: "best" },
            timeout: 30000,
            maximumAge: 1000,
          }
        );
      } else {
        navigation.navigate("AttendanceQRScan", {
          type: "clockOut",
          val: "retake",
          emploID: employeeIdval,
          scanval: false,
        });
      }
    }
  };

  const isAcknowledged =
    (isClockedIn && profileDetails.clockInAckImageUrl) ||
    (!isClockedIn && profileDetails.clockOutAckImageUrl);

  return (
    <>
      <SafeAreaView style={styles.safeareaView}>
        <NavigationHeader
          title={
            props?.route?.params?.isGpsAttendance
              ? translation.Attendance.gps_attendance
              : translation.Attendance.headerTitle
          }
          onPressCallBack={() => navigation.goBack()}
        />

        {isShown && (
          <CalendarView
            needToShow={isShown}
            tooglemodel={tooglemodel}
            calendarType={calendarTypeval}
            startsingleDateVal={singlestartdate}
            endsingleDateVal={singleenddate}
            startmultiDateVal={singlestartdate}
            endmultiDateVal={singleenddate}
            viewtypePassed={"Attendance"}
            selfButSel={selfButSel}
          />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              marginLeft: wp(24),
              marginRight: wp(24),
            }}
          >
            <View
              style={[profilepage_styles.subContainer, { marginTop: hp(10) }]}
            >
              <View style={profilepage_styles.row}>
                <Text style={[attendance_styles.textStyle]}>
                  {moment().format("LL")}
                </Text>
                <Text
                  style={[attendance_styles.textStyle, { textAlign: "right" }]}
                >
                  {moment().format("dddd")}
                </Text>
              </View>
            </View>

            {isReClockedIn ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#D4D4D4",
                  borderRadius: hp(10),
                  marginTop: hp(15),
                  paddingVertical: hp(15),
                  paddingHorizontal: hp(10),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      marginRight: wp(10),
                      alignSelf: "center",
                      height: wp(20),
                      width: wp(20),
                      tintColor: COLORS.Green,
                    }}
                    source={require("../../assets/icons/time.png")}
                  />
                  <Text style={attendance_styles.clockoutin}>
                    {clockedInval}
                  </Text>
                  <Ionicons
                    name={
                      !profileDetails.clockInAckImageUrl
                        ? "alert-circle"
                        : "checkmark-circle"
                    }
                    color={
                      !profileDetails.clockInAckImageUrl
                        ? COLORS.Red
                        : COLORS.Green
                    }
                    size={25}
                    style={{ marginHorizontal: 5 }}
                  />
                </View>
                <Text
                  style={{
                    alignItems: "center",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  -
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      marginRight: wp(10),
                      alignSelf: "center",
                      height: wp(20),
                      width: wp(20),
                      tintColor: COLORS.Red,
                      marginLeft: 10,
                    }}
                    source={require("../../assets/icons/time-out.png")}
                  />
                  <Text style={attendance_styles.clockoutin}>
                    {clockedOutval}
                  </Text>

                  <Ionicons
                    name={
                      !profileDetails.clockOutAckImageUrl
                        ? "alert-circle"
                        : "checkmark-circle"
                    }
                    color={
                      !profileDetails.clockOutAckImageUrl
                        ? COLORS.Red
                        : COLORS.Green
                    }
                    size={25}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </View>
            ) : (
              <></>
            )}
            <View
              style={[appHeaderStyles.RadioContainer, { marginTop: hp(13) }]}
            >
              {isClockedIn ? (
                <View>
                  <View>
                    <View
                      style={[
                        appHeaderStyles.RadioContainer,
                        { borderColor: COLORS.White },
                      ]}
                    >
                      <View>
                        <View style={attendance_styles.qrcode}>
                          <View style={attendance_styles.qrimage}>
                            {profileDetails.clockInImageUrl ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setImageViewerState(() => ({
                                    isImageViewer: true,
                                    imageUrl:
                                      BaseURL +
                                      "Image/Download?fileName=" +
                                      profileDetails.clockInImageUrl,
                                  }));
                                }}
                              >
                                <Image
                                  style={attendance_styles.photo}
                                  source={
                                    profileDetails.clockInImageUrl
                                      ? {
                                          uri:
                                            BaseURL +
                                            "Image/Download?fileName=" +
                                            profileDetails.clockInImageUrl,
                                        }
                                      : require("../../assets/images/titleLogo.png")
                                  }
                                />
                              </TouchableOpacity>
                            ) : (
                              <Image
                                style={attendance_styles.photo}
                                source={require("../../assets/icons/No-Image-Placeholder.png")}
                              />
                            )}
                          </View>
                          <View style={attendance_styles.idcard}>
                            <View>
                              <Text
                                style={[
                                  attendance_styles.empDetails,
                                  { fontFamily: FONTS.Urbanist },
                                ]}
                              >
                                {translation.Attendance.emp_name}
                              </Text>
                              <Text
                                style={[
                                  attendance_styles.empDetails,
                                  {
                                    marginBottom: hp(10),
                                    fontFamily: FONTS.Urbanist_Semibold,
                                  },
                                ]}
                              >
                                {profileDetails.employeeName}
                              </Text>
                            </View>
                            <View>
                              <Text style={[attendance_styles.empDetails]}>
                                {translation.Attendance.emp_no}
                              </Text>
                              <Text
                                style={[
                                  attendance_styles.empDetails,
                                  {
                                    marginBottom: hp(10),
                                    fontFamily: FONTS.Urbanist_Semibold,
                                  },
                                ]}
                              >
                                {profileDetails.employeeNameId}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={attendance_styles.progressLayout}>
                      <Text style={attendance_styles.divider_cont} />
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )}
              <View>
                <View
                  style={[
                    appHeaderStyles.idcard_bg_cont,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <View
                    style={[
                      profilepage_styles.rowContainer,
                      { justifyContent: "center", alignItems: "center" },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: 20,
                      }}
                    >
                      <Text
                        style={[
                          profilepage_styles.textStyleRight,
                          { marginLeft: isReClockedIn ? hp(25) : hp(-25) },
                        ]}
                      >
                        {isReClockedIn
                          ? translation.Attendance.clock_in_last
                          : translation.Attendance.clock_in}
                      </Text>
                      <Text style={profilepage_styles.textStyleLeft}>
                        {isReClockedIn
                          ? " : " + lastClockIn
                          : isClockedIn === false
                          ? " : " + "00 : 00"
                          : ": " + clockedInval}
                      </Text>
                    </View>
                    {!isReClockedIn && profileDetails.attendanceToday ? (
                      <Tooltip
                        popover={
                          <Text
                            style={{
                              fontFamily: FONTS.Urbanist_Medium,
                              fontSize: hp(16),
                            }}
                          >
                            {!isAcknowledged
                              ? translation.Attendance.clockin_not_ack
                              : translation.Attendance.clockin_ack}
                          </Text>
                        }
                        height="auto"
                        toggleWrapperProps={{
                          hitSlop: {
                            top: 40,
                            left: 20,
                            bottom: 40,
                            right: 20,
                          },
                        }}
                        backgroundColor={COLORS.White}
                        overlayColor={COLORS.Black_Overlay}
                        // height={hp(70)}
                        // width={wp(150)}
                        // containerStyle={{ height: 400 }}
                        // withOverlay={true}
                        // withPointer={true}
                        // closeOnlyOnBackdropPress
                      >
                        <Ionicons
                          name={
                            isAcknowledged ? "checkmark-circle" : "alert-circle"
                          }
                          color={isAcknowledged ? COLORS.Green : COLORS.Yellow}
                          size={25}
                        />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>

                {!isClockedIn ||
                profileDetails.showclockIn15HoursLapsed === true ? (
                  <Buttons
                    onPress={clockinBtnPress}
                    disabled={profileDetails?.disableClockIn}
                    text={translation.Attendance.clock_in}
                    BTNstyle={
                      profileDetails?.disableClockIn
                        ? attendance_styles.buttonStyleDisable
                        : attendance_styles.buttonStyle
                    }
                    textStyle={
                      profileDetails?.disableClockIn
                        ? attendance_styles.buttonTxt1
                        : attendance_styles.buttonTxt
                    }
                    ImgStyle={undefined}
                    loader={undefined}
                  />
                ) : (
                  <Buttons
                    onPress={clockoutBtnPress}
                    disabled={profileDetails?.disableClockOut}
                    text={translation.Attendance.clock_out}
                    BTNstyle={
                      profileDetails?.disableClockOut == true
                        ? attendance_styles.buttonStyleDisable
                        : attendance_styles.buttonStyleRedBG
                    }
                    textStyle={attendance_styles.buttonTxtclockout}
                    ImgStyle={undefined}
                    loader={undefined}
                  />
                )}

                {/* Progress Bar */}
                <View
                  style={[
                    attendance_styles.progressLayout,
                    { marginBottom: hp(24) },
                  ]}
                >
                  <Progress.Bar
                    progress={currentTime}
                    width={wp(281)}
                    borderColor={COLORS.LightGrey}
                    color={COLORS.Yellow}
                    height={2}
                  />
                </View>

                <View style={[profilepage_styles.timertextStyle]}>
                  <Text
                    style={[
                      attendance_styles.shiftTimingText,
                      {
                        fontFamily: FONTS.Urbanist_Bold,
                        fontSize: hp(40),
                        width: wp(140),
                        // backgroundColor: COLORS.Red,
                      },
                    ]}
                  >
                    {differnceTime}
                  </Text>
                </View>

                <View style={attendance_styles.shiftBackground}>
                  <Text
                    style={[
                      attendance_styles.shiftTimingText,
                      { fontFamily: FONTS.Urbanist, marginTop: hp(15) },
                    ]}
                  >
                    {translation.Attendance.shift_time}
                  </Text>
                  <Text
                    style={[
                      attendance_styles.shiftTimingText,
                      {
                        fontFamily: FONTS.Urbanist_Semibold,
                        width: wp(200),
                        marginTop: hp(-15),
                        marginBottom: hp(-5),
                      },
                    ]}
                  >
                    {tConvert(profileDetails.shiftStartTime)} TO{" "}
                    {tConvert(profileDetails.shiftEndTime)}
                  </Text>
                </View>
              </View>
            </View>
            {isSupervisor &&
            isAllowedEmployeeMobileForOthers &&
            props?.route?.params?.isGpsAttendance === false ? (
              <Buttons
                onPress={() => {
                  navigation.navigate("AttendanceQRScan", {
                    type: "Other",
                    val: "retake",
                    emploID: employeeIdval,
                    scanval: false,
                  });
                }}
                text={translation.Attendance.ci_co_others}
                BTNstyle={attendance_styles.buttonStyle1}
                textStyle={attendance_styles.buttonTxt}
                ImgStyle={undefined}
                loader={undefined}
              />
            ) : (
              <></>
            )}

            <View style={attendance_styles.progressLayout}>
              <Text style={[attendance_styles.divider]} />
            </View>
            <View
              style={[
                {
                  marginTop: hp(27),
                  marginLeft: wp(4),
                  marginRight: wp(10),
                },
              ]}
            >
              <Text style={[attendance_styles.textStyleHeadingHistory]}>
                {translation.Attendance.history}
              </Text>
            </View>

            {isSupervisor && isAllowedEmployeeMobileForOthers ? (
              <View>
                <View style={styles.attendanceTabContainer}>
                  <TouchableOpacity
                    onPress={selfHandleChange}
                    style={[
                      styles.attendanceTab,
                      {
                        backgroundColor:
                          selfButSel === true ? COLORS.Blue : COLORS.White,
                      },
                    ]}
                  >
                    <View style={styles.attendanceTabView}>
                      <Text
                        style={[
                          styles.attendanceTabText,
                          {
                            color:
                              selfButSel === true ? COLORS.White : COLORS.Black,
                          },
                        ]}
                      >
                        {translation.Attendance.self}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={allStaffHandleChange}
                    style={[
                      styles.attendanceTab,
                      {
                        backgroundColor:
                          allStaffButSel === true ? COLORS.Blue : COLORS.White,
                        width: wp(165),
                      },
                    ]}
                  >
                    <View style={styles.attendanceTabView}>
                      <Text
                        style={[
                          styles.attendanceTabText,
                          {
                            color:
                              allStaffButSel === true
                                ? COLORS.White
                                : COLORS.Black,
                          },
                        ]}
                      >
                        {translation.Attendance.all_staff}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.mainCalendarView}>
                  <TouchableOpacity
                    onPress={() => {
                      setisShown(true);
                    }}
                  >
                    <View style={styles.calendarView}>
                      <CalendarImage
                        style={styles.calendarIcon}
                        width={25}
                        height={25}
                      />
                      {calendarTypeval === "Multiple" && !selfButSel ? (
                        <Text style={styles.calendarText}>
                          {moment(singlestartdate)
                            .tz(timeZonecheckval)
                            .format("DD MMM YYYY dddd")}
                        </Text>
                      ) : (
                        <Text style={[styles.calendarText]}>
                          {moment(singlestartdate)
                            .tz(timeZonecheckval)
                            .format("DD MMM YYYY dddd")}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {calendarTypeval === "Multiple" ? (
                  <View>
                    {attendanceList.length > 0 ? (
                      <ScrollView
                        scrollEnabled={true}
                        contentContainerStyle={{ flex: 1 }}
                        style={{
                          marginTop: hp(10),
                          marginBottom: hp(20),
                        }}
                      >
                        <View style={{ flex: 1 }}>{attendanceListView}</View>
                      </ScrollView>
                    ) : (
                      <View style={{ marginLeft: wp(24) }}>
                        <View style={styles.nodataViewStyle}>
                          <Text style={styles.nodataStyle}>
                            {translation.Attendance.no_data_for_att}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <AttendanceList
                    startdate={singlestartdate}
                    viewType={"Home"}
                    pageRefresh={refresh}
                  />
                )}
              </View>
            ) : (
              <View>
                {setStatesForSelfAttendance}
                <View style={styles.mainCalendarView}>
                  <TouchableOpacity
                    onPress={() => {
                      setstartmultiDate(startmultidate);
                      setendMultiDate(endmultidate);
                      setisShown(true);
                    }}
                  >
                    <View style={styles.calendarView}>
                      <CalendarImage
                        style={styles.calendarIcon}
                        width={25}
                        height={25}
                      />
                      {calendarTypeval === "Multiple" ? (
                        <Text style={[attendance_styles.textStyleHeading]}>
                          {moment(singlestartdate)
                            .tz(timeZonecheckval)
                            .format("DD MMM YYYY dddd")}
                        </Text>
                      ) : (
                        <Text style={[attendance_styles.textStyleHeading]}>
                          {moment(singlestartdate)
                            .tz(timeZonecheckval)
                            .format("DD MMM YYYY dddd")}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {calendarTypeval === "Multiple" ? (
                  <View>
                    {attendanceList.length > 0 ? (
                      <ScrollView
                        scrollEnabled={true}
                        contentContainerStyle={{ flex: 1 }}
                        style={{
                          marginTop: hp(10),
                          marginBottom: hp(20),
                        }}
                      >
                        <View style={{ flex: 1 }}>{attendanceListView}</View>
                      </ScrollView>
                    ) : (
                      <View style={{ marginLeft: wp(24) }}>
                        <View style={styles.nodataViewStyle}>
                          <Text style={styles.nodataStyle}>
                            {translation.Attendance.nodata_attendance}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View />
                )}
              </View>
            )}
          </View>
        </ScrollView>
        {isFacilityPopup && (
          <FacilityChangePopup
            onRequestClose={() => setFacilityPopup(false)}
            isVisible={isFacilityPopup}
            navigation={navigation}
            onChangePress={onFacilityChangePress}
            onProceedPress={onProceedPress}
            facilityName={props?.route?.params?.facilityName}
            facilityLogo={props?.route?.params?.facilityLogo}
          />
        )}
        {imageViewerState.isImageViewer && (
          <ImageZoomViewerPopup
            isImageViewer={imageViewerState.isImageViewer}
            closeZoomViewer={() =>
              setImageViewerState((prevState) => ({
                ...prevState,
                isImageViewer: false,
              }))
            }
            images={imageViewerState.imageUrl}
          />
        )}
        {isOutofRangePopup && (
          <OutOfRangePopup
            isVisible={isOutofRangePopup}
            onRequestClose={() => setOutofRangePopup(false)}
          />
        )}
      </SafeAreaView>
      {isLoading || refreshing ? (
        <LoaderView loading={isLoading || refreshing} />
      ) : (
        <></>
      )}
    </>
  );
};

export default AttendanceHomeScreen;
