import React, { useState, useEffect } from "react";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { Buttons } from "../../components/Buttons";
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
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";

import { wp, hp } from "../../utils/responsive-helper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ScrollView } from "react-native-gesture-handler";
import {
  employeestoreData,
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
} from "../../store/User/UserDetails";
import { attendanceStaffAPI } from "../../utils/AttendanceNetworkAPI";
import { useDispatch, useSelector } from "react-redux";
import LoaderView from "../../components/Loader";
import {
  getStaffData,
  onRefreshPage,
} from "../../store/Attendances/Attendances";
// import moment from 'moment';
import { setLoading } from "../../store/Employee/Employee";
import { RootState } from "../../store";
import translation from "../../assets/translations/translate";
import { timeZonecheck } from "../../store/User/UserDetails";
import InfiniteScroll from "react-native-infinite-scrolling";
import NavigationHeader from "../../components/NavigationHeader";
//'utils/AttendanceStaffAPI';
const AttendanceList = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const [selectedYear, setSelectedYear] = useState("");

  const [employeeIdval, setemployeeIdval] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const { startdate, viewType, pageRefresh } = props;

  let listAttendance = [];
  const [searchText, setsearchText] = useState("");
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );

  const StaffDetails = useSelector(
    (state: RootState) => state.attendanceprofileState.staffData
  );
  const [attendanceList, setAttendanceList] = useState(StaffDetails);
  const [attendanceMasterList, setAttendanceMasterList] = useState([]);

  const [fullnewdate, setfullnewdate] = useState<Date | undefined>(
    startdate
    //props.route.params.fullDate,
  );

  const data = attendanceList;

  useEffect(() => {
    setAttendanceList(StaffDetails);
    setisLoading(true);
    dispatch(onRefreshPage(false));
    async function listdata() {
      getAttendanceList();
    }
    listdata();
  }, [pageRefresh, startdate]);

  function onRefresh() {
    Keyboard.dismiss();

    async function listdata() {
      await getAttendanceList();
    }
    listdata();
  }

  function getAttendanceList() {
    profileRetrieveData().then((tokenval) => {
      setemployeeIdval(tokenval.employeeId);
      let s1 = "";
      if (viewType === undefined) {
        s1 = moments(new Date(props.route.params.startdate))
          .tz(timeZonecheckval)
          .format("YYYY-MM-DD");
      } else {
        s1 = moments(startdate).tz(timeZonecheckval).format("YYYY-MM-DD");
      }

      let dateText = s1;

      let ID = tokenval.employeeId;
      dispatch(getStaffData({ ID, dateText }))
        .then((data: any) => {
          let staffData = data.payload;
          setAttendanceList(staffData);
          setAttendanceMasterList(staffData);
          setisLoading(false);
        })
        .catch((err: any) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    });
  }

  function search(searchTexts: string) {
    // setLoading(true);
    setsearchText(searchTexts);

    let filteredData = attendanceMasterList.filter(function (item) {
      return item.employeeName
        .toLowerCase()
        .includes(searchTexts.toLowerCase());
    });
    setAttendanceList(filteredData);
  }

  function infiniteScrolling() {
    const RenderData = ({ item }) => {
      return (
        <View
          style={[
            styles.card,
            {
              marginLeft:
                viewType === undefined || viewType === null ? hp(18) : hp(-10),
            },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ minHeight: hp(150) }}
              onPress={() => {
                let clickedDate = "";
                if (viewType === undefined) {
                  clickedDate = moments(new Date(props.route.params.startdate))
                    .tz(timeZonecheckval)
                    .format("YYYY-MM-DDThh:mm:ss");
                } else {
                  clickedDate = moments(startdate)
                    .tz(timeZonecheckval)
                    .format("YYYY-MM-DDThh:mm:ss");
                }

                let newArraypassed = {
                  currentClickedDate: clickedDate,
                  date: item.date,
                  day: item.day,
                  empTimeID: item.empTimeId,
                  employeeId: item.employeeID,
                  isRequestSubmitted: item.isRequestSubmitted,
                };

                navigation.navigate("AttendanceDetail", {
                  attendanceItemArray: newArraypassed,
                  screentype: "All staff",
                  tabType: "All staff",
                });
              }}
            >
              <View style={styles.mainViewStyle}>
                <View style={styles.coloumdirectionStyle}>
                  <Text
                    style={[styles.clockTextstyle, styles.clockTextviewStyle]}
                  >
                    {item.employeeName}
                  </Text>
                  <Text
                    style={[
                      styles.clockTextstyle,
                      {
                        fontSize: hp(18),
                        marginLeft: wp(20),
                        marginTop: hp(5),
                        marginBottom: hp(24),
                      },
                    ]}
                  >
                    {item.role}
                  </Text>
                </View>
                <View style={styles.rightArrowStyle}>
                  <Image
                    style={{ height: hp(20), width: hp(20) }}
                    source={require("../../assets/icons/RightArrow.png")}
                  />
                </View>
              </View>

              <View style={styles.clockViewStyle}>
                <View style={styles.coloumdirectionStyle}>
                  <Text
                    style={[
                      styles.clockTextstyle,
                      { fontFamily: FONTS.Urbanist_Medium },
                    ]}
                  >
                    {translation.Attendance.clock_in}
                  </Text>
                  <Text style={styles.TimeTextstyle}>
                    {item.clockIn === null
                      ? "- -"
                      : moments(item?.clockIn).utc().local().format("hh:mm A")}
                  </Text>
                </View>
                <View style={styles.coloumdirectionStyle}>
                  <Text
                    style={[
                      styles.clockTextstyle,
                      { fontFamily: FONTS.Urbanist_Medium },
                    ]}
                  >
                    {translation.Attendance.clock_out}
                  </Text>
                  <Text style={styles.TimeTextstyle}>
                    {item.clockOut === null
                      ? "- -"
                      : moments(item?.clockOut).utc().local().format("hh:mm A")}
                  </Text>
                </View>
                <View style={styles.coloumdirectionStyle}>
                  <Text
                    style={[
                      styles.clockTextstyle,
                      {
                        fontFamily: FONTS.Urbanist_Medium,
                        alignSelf: "flex-end",
                      },
                    ]}
                  >
                    {translation.Attendance.total_hrs}
                  </Text>
                  <Text
                    style={[styles.TimeTextstyle, { alignSelf: "flex-end" }]}
                  >
                    {item.totalTime === null
                      ? "- -"
                      : item.totalTime + translation.Attendance.hrs}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    return (
      <>
        <View>
          {attendanceList.map((item, index) => {
            return <RenderData key={`Attendance-list${index}`} item={item} />;
          })}
        </View>
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {viewType === undefined || viewType === null ? (
          <NavigationHeader
            title={translation.Attendance.headerTitle}
            onPressCallBack={() => navigation.goBack()}
          />
        ) : (
          <></>
        )}
        <View>
          {viewType === undefined || viewType === null ? (
            <View style={styles.topviewStyle}>
              <Text
                style={[styles.headerTitle, { fontFamily: FONTS.Urbanist }]}
              >
                {moments(new Date(props.route.params.startdate))
                  .tz(timeZonecheckval)
                  .format("MMMM DD, YYYY")}
              </Text>
              <Text
                style={[styles.headerTitle, { fontFamily: FONTS.Urbanist }]}
              >
                {moments(new Date(props.route.params.startdate))
                  .tz(timeZonecheckval)
                  .format("dddd")}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View
            style={[
              styles.textInputContainer,
              {
                marginLeft:
                  viewType === undefined || viewType === null ? wp(24) : wp(0),

                width: wp(327),
              },
            ]}
          >
            <TextInput
              autoCapitalize="none"
              placeholderTextColor={COLORS.placeHolderColor}
              returnKeyType="next"
              onEndEditing={() => {
                // setUserId(userId.trim().replace(/\s+/g, ' '));
              }}
              editable
              secureTextEntry={false}
              value={searchText}
              placeholder={translation.Attendance.SearchStaff}
              onChangeText={(userId: any) => {
                if (userId === "") {
                  onRefresh();
                }
                search(userId);
              }}
              style={styles.inputField}
            />
            <Image
              source={require("../../assets/icons/Search-icon.png")}
              style={styles.iconStyle}
            />
          </View>
          <View style={styles.bottomBorder} />
        </View>

        {attendanceList.length > 0 ? (
          <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ marginTop: hp(10), marginBottom: hp(10) }}
          >
            <View style={{ flex: 1 }}>{infiniteScrolling()}</View>
          </ScrollView>
        ) : (
          <View style={styles.noAddress}>
            <View style={styles.noAddressData}>
              <Text style={styles.noAddressDataText}>
                {translation.Attendance.no_data_for_staff}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

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
    marginBottom: hp(4),
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
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    color: COLORS.White,
    marginLeft: hp(10),
    marginRight: hp(10),
  },
  buttonStyle: {
    backgroundColor: COLORS.White,
    marginLeft: hp(200),
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    //padding: 12,
    borderRadius: 10,
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: 1,
    textAlign: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  newbuttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    //padding: 12,
    borderRadius: 10,
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: 1,
    textAlign: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  newtextStyle: {
    color: COLORS.GrayDark,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    paddingTop: 10,
  },
  newbuttontextStyle: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    paddingTop: 10,
  },
  clockTextstyle: {
    color: COLORS.Black,
    alignSelf: "flex-start",
    fontSize: hp(16),
    fontFamily: FONTS.Urbanist,
    textAlign: "left",
  },

  TimeTextstyle: {
    color: COLORS.Black,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    textAlign: "center",
  },
  textInputContainer: {
    height: hp(56),
    flexDirection: "row",
    justifyContent: "space-between",
    textAlignVertical: "center",
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    marginTop: hp(25),
  },
  iconStyle: {
    width: wp(24),
    height: hp(24),
    marginTop: hp(16),
    marginLeft: wp(-15),
    marginRight: wp(16),
    resizeMode: "contain",
  },
  inputField: {
    fontFamily: FONTS.Urbanist_Medium,
    paddingLeft: wp(12),
    fontSize: hp(18),
    width: wp(307),
  },
  dropdown: {
    width: wp(16),
    height: hp(16),
  },
  pickerButton: {
    paddingLeft: hp(5),
    width: wp(297),
    height: hp(60),
    //borderRadius: wp(30),
  },
  card: {
    // borderColor: COLORS.LightGrey,
    // borderWidth: 1,
    borderRadius: wp(15),
    padding: wp(10),
    margin: wp(5),
    marginHorizontal: wp(15),
  },
  noAddress: {
    marginLeft: wp(24),
  },
  noAddressData: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(10),
  },
  noAddressDataText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: hp(17),
    fontFamily: FONTS.Urbanist,
    fontWeight: "700",
    color: COLORS.DarkGrey,
  },
  topviewStyle: {
    marginTop: hp(20),
    flexDirection: "row",
    backgroundColor: COLORS.PurpleButton,
    height: hp(50),
    width: wp(317),
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: hp(30),
    borderRadius: hp(10),
  },
  coloumdirectionStyle: {
    flexDirection: "column",
  },
  clockViewStyle: {
    flexDirection: "row",
    padding: hp(20),
    // marginLeft: hp(0),
    // marginRight: hp(5),
    justifyContent: "space-between",
    borderTopRightRadius: hp(20),
    borderTopLeftRadius: hp(20),
    borderBottomWidth: hp(1),
    borderColor: COLORS.LightGrey,
  },
  rightArrowStyle: {
    marginRight: hp(10),
    height: hp(28),
    width: hp(28),
    borderRadius: hp(5),
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: COLORS.White,
  },
  clockTextviewStyle: {
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(16),
    marginLeft: hp(20),
    marginTop: hp(15),
    width: wp(200),
  },
  mainViewStyle: {
    flexDirection: "row",
    backgroundColor: COLORS.LightGrey,
    width: wp(326),
    minHeight: hp(87),
    borderRadius: hp(10),
    justifyContent: "space-between",
    marginTop: hp(-10),
  },
  bottomBorder: {
    width: wp(327),
    alignSelf: "center",
    borderBottomWidth: wp(1),
    borderBottomColor: COLORS.LightGrey,
    marginTop: hp(20),
  },
});

export default AttendanceList;
