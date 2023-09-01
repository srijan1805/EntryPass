import React, { useState, useEffect } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import moments from "moment-timezone";
import { wp, hp } from "../../utils/responsive-helper";
import { ScrollView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import { RootState } from "../../store";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import LoaderView from "../../components/Loader";
import { Buttons } from "../../components/Buttons";
import { Config } from "./../../utils/Config";
import translation from "../../assets/translations/translate";
import { useDispatch, useSelector } from "react-redux";
import { timeZonecheck } from "../../store/User/UserDetails";
import { attendanceStaffAPI } from "../../utils/AttendanceNetworkAPI";
import {
  AttendancesProfileDetails,
  getattendancesProfileDetails,
} from "../../store/Attendances/Attendances";
import { setLoading } from "../../store/AddressHistory/AddressHistory";
import ImageZoomViewerPopup from "../../components/ImageZoomViewerPopup";
import { ImageViewerProps } from "../../utils/interface-helpers/common-interface";
import moment from "moment-timezone";
import NavigationHeader from "../../components/NavigationHeader";
const BaseURL = Config.BASE_URL;

function AttendanceDetail({ route }) {
  const dispatch = useDispatch();
  let timeZonecheckval = timeZonecheck();

  const navigation = useNavigation();
  const [readval, setReasonval] = useState([]);
  const [selectedreadval, setSelectedReasonval] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [employeeIDval, setemployeeIdval] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [ShiftTime, setShiftTime] = useState("");
  const { attendanceItemArray, screentype, tabType } = route.params;
  const [clockinval, setClockinval] = useState("");
  const [noImage, setNoImage] = useState("no");
  const [clockinNoImage, setclockinNoImage] = useState("no");

  const [isImageLoading, setImageLoading] = useState<Boolean>(false);

  //image zoom viewer
  const [imageViewerState, setImageViewerState] = useState<ImageViewerProps>({
    isImageViewer: false,
    imageUrl: "",
  });

  const profileDetails = useSelector(
    (state: RootState) => state.attendanceprofileState.attendanceDetails
  );

  useEffect(() => {
    setisLoading(true);
    try {
      dispatch(
        AttendancesProfileDetails([
          attendanceItemArray.employeeId,
          "",
          attendanceItemArray.currentClickedDate,
          route.params?.attendanceItemArray?.empTimeID,
        ])
      ).then((data: any) => {
        setisLoading(false);
        if (
          profileDetails.shiftStartTime === "" ||
          profileDetails.shiftEndTime === ""
        ) {
          setShiftTime("00 : 00 To 00 : 00");
        } else {
          setShiftTime(
            tConvert(profileDetails.shiftStartTime) +
              " TO " +
              tConvert(profileDetails.shiftEndTime)
          );
        }
        setClockinval(profileDetails.clockInTime);
      });
    } catch (err) {
      setisLoading(false);
      if (err !== "undefined" && err.toString().includes("Network Error")) {
        alert(translation.AddressVerification.oops_network_err_msg);
      } else {
        alert(err.toString());
      }
    }

    async function listdata() {
      await getAttendanceReason();
    }
    listdata();
  }, []);

  function tConvert(time) {
    // Check correct time format and split into components
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
  function getAttendanceReason() {
    setisLoading(true);
    setemployeeIdval(attendanceItemArray.employeeId);
    setReasonval([]);
    try {
      attendanceStaffAPI
        .attendanceReasonGetAPI()
        .then((tokenRes) => {
          let historyData = tokenRes.data.result;

          historyData &&
            historyData.map((item: any, index) => {
              setReasonval((readvals) => [...readvals, `${item.reason}`]);
              setisLoading(false);
            });

          setisLoading(false);
        })
        .catch((err: any) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          } else {
            alert(err.toString());
          }
        });
    } catch (ex) {
      setisLoading(false);
      Alert.alert(translation.AddressVerification.oops_err_msg);
    }
  }

  function submitReason() {
    setisLoading(true);

    if (selectedreadval === 0) {
      setisLoading(false);
      alert(translation.Attendance.pls_provide_reason);
    } else {
      let emplyeedata = {
        empTimeID: attendanceItemArray.empTimeID,
        reasonId: selectedreadval,
        comment: reasonText,
        attendanceDate: attendanceItemArray.date,
      };

      attendanceStaffAPI
        .attendanceSubmitReasonApiPost(employeeIDval, emplyeedata)
        .then((tokenRes) => {
          setisLoading(false);
          if (tokenRes.status === 200 && tokenRes.data.result == true) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: "AttendanceRequestScreen",
                  },
                ],
              })
            );
          }
        })
        .catch((err: any) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }

          Alert.alert(translation.Attendance.pls_try_again);
        });
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={translation.Attendance.attendance_details}
          onPressCallBack={() => navigation.goBack()}
        />

        <ScrollView
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View>
            <View
              style={{
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={styles.topViewSytle}>
                <Text style={styles.monthTitle}>
                  {moment(attendanceItemArray.currentClickedDate.toString())
                    .utc()
                    .local()
                    .format("MMMM DD, YYYY")}
                </Text>
                <Text style={styles.dayTitle}>
                  {moment(attendanceItemArray.currentClickedDate.toString())
                    .utc()
                    .local()
                    .format("dddd")}
                </Text>
              </View>

              <View
                style={{
                  marginTop: hp(16),
                  width: wp(326),
                  height: hp(281),
                  marginBottom: hp(16),
                  borderColor: COLORS.LightGrey,
                  borderRadius: hp(22),
                  borderWidth: hp(1),
                }}
              >
                <View style={styles.mainViewStyle}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.clockTextstyle}>
                      {translation.Attendance.clock_in}
                    </Text>
                    <Text style={styles.TimeTextstyle}>
                      {profileDetails.clockInTime === null ||
                      profileDetails.clockInTime === ""
                        ? "00:00"
                        : moments(profileDetails.clockInTime).format("hh:mm A")}
                    </Text>

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
                          source={{
                            uri:
                              BaseURL +
                              "Image/Download?fileName=" +
                              profileDetails.clockInImageUrl,
                          }}
                          style={styles.clockImage}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Image
                        source={require("../../assets/icons/No-Image-Placeholder.png")}
                        style={styles.clockImage}
                      />
                    )}
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.clockTextstyle}>
                      {translation.Attendance.clock_out}
                    </Text>
                    <Text style={styles.TimeTextstyle}>
                      {profileDetails.clockOutTime === null ||
                      profileDetails.clockOutTime === ""
                        ? "00:00"
                        : moments(profileDetails.clockOutTime).format(
                            "hh:mm A"
                          )}
                    </Text>

                    {profileDetails.clockOutImageUrl ? (
                      <TouchableOpacity
                        onPress={() => {
                          setImageViewerState(() => ({
                            isImageViewer: true,
                            imageUrl:
                              BaseURL +
                              "Image/Download?fileName=" +
                              profileDetails.clockOutImageUrl,
                          }));
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              BaseURL +
                              "Image/Download?fileName=" +
                              profileDetails.clockOutImageUrl,
                          }}
                          style={styles.clockImage}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Image
                        source={require("../../assets/icons/No-Image-Placeholder.png")}
                        style={styles.clockImage}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.bottomBorder} />
                <View>
                  <Text
                    style={[
                      styles.clockTextstyle,
                      {
                        fontSize: hp(16),
                        marginBottom: hp(10),
                        fontFamily: FONTS.Urbanist_Semibold,
                      },
                    ]}
                  >
                    {`${translation.Attendance.total_hrs}` +
                      (profileDetails.totalTime === null ||
                      profileDetails.totalTime === ""
                        ? " 00 : 00 Hrs"
                        : " " + profileDetails.totalTime + " Hrs")}
                  </Text>
                  <View style={styles.shifttimeStyle}>
                    <Text
                      style={[
                        styles.clockTextstyle,
                        {
                          fontSize: hp(16),
                          marginBottom: hp(10),
                          marginTop: hp(10),
                        },
                      ]}
                    >
                      {translation.Attendance.shift_time}
                    </Text>
                    <Text
                      style={[
                        styles.TimeTextstyle,
                        { fontFamily: FONTS.Urbanist_Semibold },
                      ]}
                    >
                      {ShiftTime}
                    </Text>
                  </View>
                </View>
              </View>

              {/* {tabType === "Self" ? (
                <View style={styles.viewreasonStle}>
                  <Text style={[styles.headerTitle, styles.extrastyleText]}>
                    {translate("Attendance.reason", false)}
                  </Text>
                  <View style={styles.inputField}>
                    {readval.length === 0 ? (
                      <Text style={styles.dropdownTextDesign}>
                        {"No reason found"}
                      </Text>
                    ) : (
                      <SelectDropdown
                        data={readval}
                        defaultButtonText={
                          readval.length === 0
                            ? "No reason found"
                            : translate("Attendance.reason_for_req", false)
                        }
                        renderDropdownIcon={() =>
                          readval.length === 0 ? (
                            <></>
                          ) : (
                            <Image
                              style={styles.dropdown}
                              source={require("../../assets/icons/Dropdown.png")}
                            />
                          )
                        }
                        buttonTextStyle={{
                          fontFamily: FONTS.Urbanist,
                          fontSize: hp(18),
                          textAlign: "left",
                          marginLeft: wp(0),
                          paddingLeft: wp(0),
                          color: isOptionSelected
                            ? COLORS.Black
                            : COLORS.placeHolderColor,
                        }}
                        buttonStyle={styles.pickerButton}
                        dropdownStyle={{ borderRadius: wp(22) }}
                        onSelect={(selectedItem, index) => {
                          if (readval.length === 0) {
                            setLoading(false);
                            setisLoading(false);
                          } else {
                            setLoading(false);
                            setisLoading(false);
                            setIsOptionSelected(true);
                            setSelectedReasonval(Number(index) + 1);
                          }
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                          return item;
                        }}
                      />
                    )}
                  </View>

                  <Text style={[styles.headerTitle, styles.extrastyleText]}>
                    {translate("Attendance.submit_a_req", false)}
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.placeHolderColor}
                    returnKeyType="next"
                    onEndEditing={() => {
                      setReasonText(reasonText.trim().replace(/\s+/g, " "));
                    }}
                    editable
                    multiline
                    maxLength={100}
                    secureTextEntry={false}
                    value={reasonText}
                    placeholder={translate(
                      "Attendance.type_your_comments_here",
                      false
                    )}
                    onChangeText={(userId: any) => {
                      setReasonText(userId);
                    }}
                    style={[
                      styles.inputField,
                      {
                        height: hp(120),
                        padding: wp(10),
                        paddingTop: hp(10),
                        textAlignVertical: "top",
                      },
                    ]}
                  />
                </View>
              ) : (
                <></>
              )} */}
            </View>
            {/* {tabType === "Self" ? (
              <View style={styles.cancelButton}>
                <Buttons
                  text="Cancel"
                  onPress={() => {
                    navigation.goBack();
                  }}
                  BTNstyle={styles.buttonStyle}
                  textStyle={styles.newtextStyle}
                  ImgStyle={undefined}
                  loader={undefined}
                />

                <Buttons
                  text="Submit"
                  onPress={() => {
                    submitReason();
                    // navigation.goBack();
                    // addressverifyAPICall(addressData);
                  }}
                  disabled={readval.length === 0 ? true : false}
                  BTNstyle={
                    readval.length === 0
                      ? styles.disNewbuttonStyle
                      : styles.newbuttonStyle
                  }
                  textStyle={
                    readval.length === 0
                      ? styles.disNewbuttontextStyle
                      : styles.newbuttontextStyle
                  }
                  ImgStyle={undefined}
                  loader={undefined}
                />
              </View>
            ) : (
              <></>
            )} */}
          </View>
        </ScrollView>
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
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  facility: {
    marginVertical: hp(50),
    marginLeft: hp(25),
    height: hp(270),
    width: wp(50),
    alignItems: "center",
    marginTop: hp(10),
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: hp(24),
    marginTop: hp(26),
    marginBottom: hp(26),
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
  headerTitle1: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignSelf: "flex-start",
  },

  monthTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignSelf: "center",
  },
  dayTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignSelf: "center",
    marginLeft: wp(18),
    textAlign: "right",
    //backgroundColor: COLORS.Red,
  },
  buttonStyle: {
    backgroundColor: COLORS.White,
    marginLeft: hp(5),
    marginRight: hp(5),
    marginTop: hp(5),
    marginBottom: hp(5),
    //padding: 12,
    borderRadius: hp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.Blue,
    borderWidth: hp(1),
    justifyContent: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  newbuttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    marginLeft: hp(5),
    marginRight: hp(5),
    marginTop: hp(5),
    marginBottom: hp(5),
    //padding: 12,
    borderRadius: hp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: hp(1),
    justifyContent: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  newtextStyle: {
    color: COLORS.GrayDark,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
  },
  disNewbuttonStyle: {
    backgroundColor: COLORS.GrayLight,
    marginLeft: hp(5),
    marginRight: hp(5),
    marginTop: hp(5),
    marginBottom: hp(5),
    //padding: 12,
    borderRadius: hp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: hp(1),
    justifyContent: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  disNewbuttontextStyle: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    textAlignVertical: "center",
  },
  newbuttontextStyle: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    textAlignVertical: "center",
  },
  clockTextstyle: {
    color: COLORS.Black,
    alignSelf: "center",
    fontSize: hp(14),
    //fontWeight: '500',
    fontFamily: FONTS.Urbanist_Medium,
    textAlign: "center",
  },

  TimeTextstyle: {
    color: COLORS.Black,
    alignSelf: "center",
    fontSize: hp(16),
    // fontWeight: '600',
    fontFamily: FONTS.Urbanist_Semibold,
    textAlign: "center",
  },
  inputField: {
    backgroundColor: COLORS.White,
    borderColor: COLORS.placeHolderColor,
    borderWidth: wp(1),
    width: wp(326),
    fontFamily: FONTS.Urbanist,
    textAlign: "left",
    fontSize: hp(18),
    fontWeight: "500",
    borderRadius: wp(10),
    marginTop: hp(10),
    color: COLORS.DarkGrey,
  },
  dropdown: {
    width: wp(16),
    height: hp(16),
    marginRight: wp(10),
    tintColor: COLORS.Black,
  },
  pickerButton: {
    width: wp(320),
    height: hp(56),
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
  },
  cancelButton: {
    flexDirection: "row",
    marginLeft: hp(20),
    marginRight: hp(20),
    //position: 'absolute', //Here is the trick
    marginBottom: hp(20),
    marginTop: hp(14),
    alignContent: "center",
    // position: 'absolute',
    // bottom:00,
  },
  viewreasonStle: {
    marginTop: hp(10),
    width: wp(326),
    // backgroundColor: COLORS.Green,
    justifyContent: "flex-start",
    borderTopWidth: hp(1),
    borderColor: COLORS.LightGrey,
  },
  extrastyleText: {
    marginTop: hp(20),
    fontSize: hp(18),
    textAlign: "left",
    fontFamily: FONTS.Urbanist_Bold,
  },
  shifttimeStyle: {
    width: wp(324),
    height: hp(78),
    backgroundColor: COLORS.LightBlue,
    borderBottomEndRadius: hp(20),
    borderBottomStartRadius: hp(20),
    marginLeft: hp(0),
    marginRight: hp(0),
    marginBottom: hp(0),
  },
  mainViewStyle: {
    flexDirection: "row",
    // backgroundColor: COLORS.Red,
    marginTop: hp(3),
    padding: hp(20),
    marginLeft: hp(5),
    marginRight: hp(5),
    justifyContent: "space-between",
    // marginBottom: hp(16),
    borderTopRightRadius: hp(20),
    borderTopLeftRadius: hp(20),
    // borderBottomWidth: hp(1),
    borderColor: COLORS.LightGrey,
  },
  topViewSytle: {
    marginTop: hp(8),
    flexDirection: "row",
    width: wp(326),
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: hp(18),
    //fontWeight: '500',
    fontFamily: FONTS.Urbanist,
    textAlign: "left",
  },
  dropdownTextDesign: {
    fontSize: hp(18),
    // fontWeight: '500',
    fontFamily: FONTS.Urbanist_Medium,
    textAlign: "left",
    color: COLORS.Grey2,
    width: wp(314),
    height: hp(50),
    padding: hp(15),
    paddingLeft: hp(5),
    marginLeft: hp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
  },
  clockImage: {
    width: wp(63),
    height: hp(80),
    marginTop: hp(7),
    borderRadius: wp(8),
    alignSelf: "center",
  },
  bottomBorder: {
    width: wp(262),
    alignSelf: "center",
    borderBottomWidth: wp(1),
    borderBottomColor: COLORS.LightGrey,
    marginBottom: hp(15),
  },
});

export default AttendanceDetail;
