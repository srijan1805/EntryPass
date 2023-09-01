import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import CalendarView from "../../components/CalendarView";
import LoaderView from "../../components/Loader";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { ARTtestSelfList } from "../../utils/ArtTestAPI";
import { hp, wp } from "../../utils/responsive-helper";
import CalendarImage from "../../assets/images/Calendar.svg";
import translation from "../../assets/translations/translate";
import { timeZonecheck } from "../../store/User/UserDetails";
function ArtTestSelf(props) {
  const [userId, setUserId] = useState("");
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const [isSupervisor, setIsSupervisor] = useState(false);
  const [datalist, setDatalist] = useState([]);
  const [isShown, setisShown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  const [calendarTypeval, setcalendarTypeval] = useState("Multiple");
  let date = new Date();
  const [startmultidate, setstartmultiDate] = useState<Date | undefined>(
    new Date(date.setDate(new Date().getDate() - 6))
  );
  const [endmultidate, setendMultiDate] = useState<Date | undefined>(
    new Date()
  );

  const [singlestartdate, setsinglestartdate] = useState<Date>(new Date());
  const [singleenddate, setsingleenddate] = useState<Date | undefined>(
    new Date()
  );

  const preload = () => {
    profileRetrieveData().then((tokenval) => {
      setUserId(tokenval.employeeId);
      setIsSupervisor(tokenval.isSpuervisor);
      setisAllowedEmployeeMobileForOthers(
        tokenval.isAllowedEmployeeMobileForOthers
      );

      let multistartdateform = moments(startmultidate)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");

      let multienddateform = moments(endmultidate)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");

      let data = {};
      if (tokenval.isSpuervisor) {
        data = {
          startDate: multistartdateform,
          endDate: multienddateform,
        };
      } else {
        data = {
          startDate: singlestartdate,
          endDate: singlestartdate,
        };
      }
      selfArtTestAPICall(tokenval.employeeId, data);
      setisLoading(false);
    });
  };

  useEffect(() => {
    preload();
    setisLoading(false);
  }, [startmultidate, endmultidate, singlestartdate]);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    preload();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function selfArtTestAPICall(empID, data) {
    setisLoading(true);
    ARTtestSelfList(empID, data)
      .then((resp) => {
        setDatalist(resp.data.result);
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        setDatalist([]);
        console.log("Error inside API call", err);
      });
    // setisLoading(false);
  }

  const tooglemodel = (
    calendartype: any,
    startsingleDateVal: Date,
    endsingleDateVal: Date,
    startmultiDateVal: Date,
    endmultiDateVal: Date
  ) => {
    let multistartdateform = moments(startmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");

    let multienddateform = moments(endmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");

    setstartmultiDate(startmultiDateVal);
    setendMultiDate(endmultiDateVal);
    setsingleenddate(endsingleDateVal);
    setsinglestartdate(startsingleDateVal);
    setcalendarTypeval(calendartype);
    setisShown(false);
    if (calendarTypeval === "Multiple") {
      let data = {
        startDate: multistartdateform,
        endDate: multienddateform,
      };
      selfArtTestAPICall(userId, data);
      setisLoading(false);
    } else {
      let data = {
        startDate: startsingleDateVal,
        endDate: startsingleDateVal,
      };
      selfArtTestAPICall(userId, data);
      setisLoading(false);
    }
    onRefresh();
  };

  const selfTestCard = (index, date, day, testResult) => (
    <View style={styles.cardContainer} key={index}>
      <View style={styles.cardHeader}>
        <Text style={styles.text}>
          {Platform.OS === "android"
            ? moments.utc(date).format("DD MMM YYYY, hh:mm A")
            : moments
                .utc(date)
                .tz(timeZonecheckval)
                .format("DD MMM YYYY, hh:mm A")}
        </Text>
        <Text style={styles.text}>{day}</Text>
      </View>
      <View style={styles.testResultContainer}>
        <Text
          style={[
            styles.testResult,
            {
              color:
                testResult === "Positive"
                  ? COLORS.Red
                  : testResult === "Negative"
                  ? COLORS.Green
                  : COLORS.Yellow,
            },
          ]}
        >
          {testResult}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.White }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <LoaderView loading={isLoading} />
        <CalendarView
          needToShow={isShown}
          tooglemodel={tooglemodel}
          calendarType={calendarTypeval}
          startsingleDateVal={singlestartdate}
          endsingleDateVal={singleenddate}
          startmultiDateVal={startmultidate}
          endmultiDateVal={endmultidate}
          viewtypePassed={"ART"}
        />

        {isSupervisor && isAllowedEmployeeMobileForOthers ? (
          <View>
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
                  {calendarTypeval === "Multiple" ? (
                    <Text style={[styles.textStyleHeading]}>
                      {moments(startmultidate)
                        .tz(timeZonecheckval)
                        .format("DD MMM YYYY") +
                        " - " +
                        moments(endmultidate)
                          .tz(timeZonecheckval)
                          .format("DD MMM YYYY")}
                    </Text>
                  ) : (
                    <Text style={[styles.textStyleHeading]}>
                      {moments(singlestartdate)
                        .tz(timeZonecheckval)
                        .format("DD MMM YYYY dddd")}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.artHistoryTitleRow}>
            <Text style={styles.artHistoryTitleText}>
              {translation.ArtTest.SelfTestHistory}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setisShown(true);
                setcalendarTypeval("Single");
              }}
            >
              <Image
                style={styles.calendarIconNonSupervisor}
                source={require("../../assets/icons/Calendar-ART.png")}
              />
            </TouchableOpacity>
          </View>
        )}

        {datalist.length > 0 &&
          datalist.map((item, index) => {
            return selfTestCard(
              index,
              new Date(item.testDate),
              item.testDay,
              item.testResult
            );
          })}
        {datalist.length === 0 ? (
          <View style={styles.noArt}>
            <View style={styles.noArtData}>
              <Text style={styles.noArtDataText}>
                {translation.ArtTest.NoSelfData}
              </Text>
            </View>
          </View>
        ) : (
          <View />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: wp(327),
    height: hp(112),
    borderRadius: wp(10),
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
    marginTop: hp(8),
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: hp(8),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: wp(18),
    marginRight: wp(18),
    marginBottom: hp(21),
  },
  text: {
    fontSize: hp(16),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  testResultContainer: {
    width: wp(297),
    height: hp(39),
    backgroundColor: COLORS.LightGrey,
    borderRadius: wp(6),
    alignSelf: "center",
    justifyContent: "center",
  },
  testResult: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: hp(16),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Semibold,
  },
  mainCalendarView: {
    marginTop: hp(20),
    justifyContent: "center",
    alignItems: "center",
  },
  calendarView: {
    width: wp(298),
    height: hp(50),
    borderRadius: hp(22),
    borderWidth: wp(1),
    borderColor: COLORS.Blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    padding: hp(10),
  },
  calendarIcon: {
    marginLeft: wp(20),
  },
  textStyleHeading: {
    fontSize: wp(16),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "600",
    flex: 1,
    marginLeft: wp(18),
  },
  noArt: {
    marginLeft: wp(24),
    marginTop: hp(20),
  },
  noArtData: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(10),
  },
  noArtDataText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: hp(17),
    fontFamily: FONTS.Urbanist,
    fontWeight: "700",
    color: COLORS.DarkGrey,
  },
  artHistoryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  artHistoryTitleText: {
    fontSize: hp(18),
    fontWeight: "700",
    lineHeight: hp(25),
    marginLeft: wp(24),
    marginTop: hp(27),
    marginBottom: hp(25),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  artTextResult: {
    fontSize: hp(16),
    fontWeight: "400",
    marginLeft: wp(18),
    marginRight: wp(18),
    marginBottom: hp(10),
    fontFamily: FONTS.Urbanist,
    lineHeight: hp(25),
    color: COLORS.DarkGrey,
  },
  artTextResultTit: {
    fontSize: hp(18),
    fontWeight: "700",
    marginLeft: wp(25),
    marginRight: wp(25),
    fontFamily: FONTS.Urbanist_Semibold,
    lineHeight: hp(25),
    color: COLORS.Red,
    paddingBottom: hp(14),
  },
  calendarIconNonSupervisor: {
    width: wp(44),
    height: hp(44),
    marginTop: hp(17),
    marginRight: wp(25),
  },
});

export default ArtTestSelf;
