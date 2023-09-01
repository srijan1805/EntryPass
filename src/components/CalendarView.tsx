import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { profilepage_styles } from "../utils/Styles";
import { Buttons } from "../components/Buttons";
import { wp, hp } from "../utils/responsive-helper";
import { FONTS } from "../constants/font";
import { COLORS } from "../constants/color";
//import { Calendar, ThemeType } from 'react-native-calendario';
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";
import { range } from "lodash";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { timeZonecheck } from "../store/User/UserDetails";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { Theme, MarkingTypes } from "react-native-calendars/src/types";
import translation from "../assets/translations/translate";
const CalendarView = (props) => {
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const {
    calendarType,
    needToShow,
    tooglemodel,
    startsingleDateVal,
    endsingleDateVal,
    startmultiDateVal,
    endmultiDateVal,
    viewtypePassed,
    selfButSel,
  } = props;

  const [startSingledate, setstartSingleDate] = useState<Date | undefined>(
    startsingleDateVal
  );
  const [endSingledate, setendSingleDate] = useState<Date | undefined>(
    endsingleDateVal
  );

  const [startMultidate, setstartMultiDate] = useState<Date | undefined>(
    startmultiDateVal
  );
  const [endMultidate, setendMultiDate] = useState<Date | undefined>(
    endmultiDateVal
  );

  const [singlestartdatestr, setsinglestartDatestr] = useState(
    moments(startSingledate).tz(timeZonecheckval).format("YYYY-MM-DD")
  );
  const [singleenddatestr, setsingleendDatestr] = useState(
    moments(endSingledate).tz(timeZonecheckval).format("YYYY-MM-DD")
  );

  const [multistartdatestr, setmultistartDatestr] = useState(
    moments(startMultidate).tz(timeZonecheckval).format("YYYY-MM-DD")
  );
  const [multienddatestr, setmultiendDatestr] = useState(
    moments(endMultidate).tz(timeZonecheckval).format("YYYY-MM-DD")
  );
  type MarkedDatesType = {
    [key: string]: MarkingProps;
  };
  const navigation = useNavigation();

  const [singleArryDate, setsingleArryDate] = useState<
    MarkedDatesType | undefined
  >({ fordefaulttype });

  const [markingtypecal, setmarkingtypecal] = useState<
    MarkingTypes | undefined
  >(calendarType === "Multiple" ? "period" : "dot");

  const [currentDate, setcurrentDate] = useState("");
  const [currentDatevalue, setcurrentDatevalue] = useState("");

  useEffect(() => {
    let newdateVal = moments(new Date())
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");
    setcurrentDate(newdateVal);

    handlePress(newdateVal);
    console.log("-----singleArryDate--currentDate--", currentDate);

    if (needToShow === true) {
      fordefaulttype();
    } else {
    }
  }, [needToShow]);

  async function fordefaulttype() {
    if (calendarType === "Multiple" && !selfButSel) {
      let selectedotherdateone = new Date(endMultidate);
      selectedotherdateone.setDate(selectedotherdateone.getDate() - 1);
      let endStrOne = moments(selectedotherdateone)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatetwo = new Date(endMultidate);
      selectedotherdatetwo.setDate(selectedotherdatetwo.getDate() - 2);
      let endStrTwo = moments(selectedotherdatetwo)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatethree = new Date(endMultidate);
      selectedotherdatethree.setDate(selectedotherdatethree.getDate() - 3);
      let endStrThree = moments(selectedotherdatethree)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatefour = new Date(endMultidate);
      selectedotherdatefour.setDate(selectedotherdatefour.getDate() - 4);
      let endStrFour = moments(selectedotherdatefour)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatefive = new Date(endMultidate);
      selectedotherdatefive.setDate(selectedotherdatefive.getDate() - 5);
      let endStrFive = moments(selectedotherdatefive)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");

      let selecteddate = new Date(endMultidate);
      selecteddate.setDate(selecteddate.getDate() - 6);
      let endStr = moments(selecteddate)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selecteddatestart = new Date(endMultidate);
      let dateval = moments(selecteddatestart)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");

      await defaultval(
        dateval,
        endStrOne,
        endStrTwo,
        endStrThree,
        endStrFour,
        endStrFive,
        endStr
      );
    } else {
      let selecteddatestart = new Date(startSingledate);
      let dateval = moments(selecteddatestart)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      await singledefault(dateval);
      setstartSingleDate(dateval);
      setendSingleDate(dateval);
      setsinglestartDatestr(dateval);
      setsingleendDatestr(dateval);
    }
  }

  function defaultval(
    value1: String,
    value2: String,
    value3: String,
    value4: String,
    value5: String,
    value6: String,
    value7: String
  ) {
    setsingleArryDate({
      [value7]: {
        startingDay: true,
        //selected: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value6]: {
        // selected: true,
        //endingDay: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value5]: {
        // selected: true,
        //endingDay: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value4]: {
        // selected: true,
        //endingDay: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value3]: {
        //selected: true,
        //endingDay: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value2]: {
        //selected: true,
        // endingDay: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
      [value1]: {
        endingDay: true,
        // selected: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
    });
    let newdatesstart = new Date(value7);
    setstartMultiDate(newdatesstart);
    let newdateend = new Date(value1);
    setendMultiDate(newdateend);
  }

  async function handlePress(dateval: string) {
    console.log("-------Maarkingtype-dateval---", dateval);

    if (calendarType === "Multiple" && !selfButSel) {
      setsingleArryDate(undefined);
      // console.log('-------Maarkingtype----', markingtypecal);
      let selecteddate = new Date(dateval);
      selecteddate.setDate(selecteddate.getDate() - 6);
      let endStr = moments(selecteddate)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      //
      setmultistartDatestr(dateval);
      setmultiendDatestr(endStr);

      let selectedotherdateone = new Date(dateval);
      selectedotherdateone.setDate(selectedotherdateone.getDate() - 1);
      let endStrOne = moments(selectedotherdateone)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatetwo = new Date(dateval);
      selectedotherdatetwo.setDate(selectedotherdatetwo.getDate() - 2);
      let endStrTwo = moments(selectedotherdatetwo)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatethree = new Date(dateval);
      selectedotherdatethree.setDate(selectedotherdatethree.getDate() - 3);
      let endStrThree = moments(selectedotherdatethree)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatefour = new Date(dateval);
      selectedotherdatefour.setDate(selectedotherdatefour.getDate() - 4);
      let endStrFour = moments(selectedotherdatefour)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let selectedotherdatefive = new Date(dateval);
      selectedotherdatefive.setDate(selectedotherdatefive.getDate() - 5);
      let endStrFive = moments(selectedotherdatefive)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");

      await defaultval(
        dateval,
        endStrOne,
        endStrTwo,
        endStrThree,
        endStrFour,
        endStrFive,
        endStr
      );
    } else {
      setsingleArryDate(undefined);
      let selecteddate = new Date(dateval);
      // console.log(":>:>:>:>", dateval, selecteddate);
      await singledefault(dateval);
      setstartSingleDate(selecteddate);
      setendSingleDate(selecteddate);
      setsinglestartDatestr(dateval);
      setsingleendDatestr(dateval);
    }
  }

  function singledefault(startdateval: String) {
    setsingleArryDate({
      [startdateval]: {
        // startingDay: true,
        startingDay: true,
        endingDay: true,
        selected: true,
        color: COLORS.PurpleButton,
        textColor: COLORS.White,
      },
    });
  }

  return (
    <Modal transparent={true} animationType={"fade"} visible={needToShow}>
      <View style={styles.container}>
        <View style={styles.modalBackground}>
          <Calendar
            style={{
              height: hp(400),
              marginBottom: hp(10),
            }}
            // Specify theme properties to override specific styles for calendar parts. Default = {}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: COLORS.PurpleButton,
              // textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: COLORS.PurpleButton,
              selectedDayTextColor: COLORS.White,
              todayTextColor: "#00adf5",
              // dayTextColor: '#2d4150',
              textDisabledColor: "#d9e1e8",
              // dotColor: '#00adf5',
              selectedDotColor: COLORS.Black,
              arrowColor: COLORS.PurpleButton,
              disabledArrowColor: "#d9e1e8",
              monthTextColor: COLORS.PurpleButton,
              indicatorColor: "blue",
              textDayFontFamily: FONTS.Urbanist_Semibold,
              textMonthFontFamily: FONTS.Urbanist_Semibold,
              textDayHeaderFontFamily: FONTS.Urbanist_Semibold,
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 14,
              textMonthFontSize: 22,
              textDayHeaderFontSize: 14,
            }}
            onDayPress={(day) => {
              console.log("selected day 12---->100", day.dateString);
              handlePress(day.dateString);
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {
              console.log("selected day 2-------899", day);
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"MMMM yyyy"}
            maxDate={currentDate}
            initialDate={currentDatevalue}
            key={currentDatevalue}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {
              let newdateVal = moments(new Date(month.dateString))
                .tz(timeZonecheckval)
                .format("YYYY-MM-DD");
              setcurrentDatevalue(newdateVal);
              console.log("month changed -7888---", month.dateString);
            }}
            markingType={markingtypecal}
            // markingType={markingtypecal}
            markedDates={singleArryDate}
            // markingType={'period'}
            // markedDates={{
            //   '2022-01-20': { textColor: 'green' },
            //   '2022-01-22': { startingDay: true, color: 'green' },
            //   '2022-01-23': {
            //     selected: true,
            //     endingDay: true,
            //     color: 'green',
            //     textColor: 'gray',
            //   },
            // }}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // renderArrow={(direction) => <Arrow />}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={false}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            //firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={false}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={(addMonth) => addMonth()}
            // Disable left arrow. Default = false
            disableArrowLeft={false}
            // Disable right arrow. Default = false
            disableArrowRight={false}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            // Replace default month and year title with custom one. the function receive a date as parameter
            // renderHeader={(date) => {
            //   /*Return JSX*/
            //   // console.log('date---', date);
            // }}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
          />

          <View
            style={{
              flexDirection: "row",
              marginLeft: hp(12),
              alignItems: "center",
              position: "absolute",
              bottom: 0,
            }}
          >
            <Buttons
              text={translation.Attendance.cancel}
              onPress={() => {
                tooglemodel(
                  calendarType,
                  startSingledate,
                  endSingledate,
                  startMultidate,
                  endMultidate
                );
              }}
              BTNstyle={styles.buttonStyle}
              textStyle={styles.newtextStyle}
              ImgStyle={undefined}
              loader={undefined}
            />

            <Buttons
              text={translation.Attendance.ok}
              onPress={() => {
                if (calendarType === "Multiple") {
                  tooglemodel(
                    calendarType,
                    startSingledate,
                    endSingledate,
                    startMultidate,
                    endMultidate
                  );
                } else {
                  tooglemodel(
                    calendarType,
                    startSingledate,
                    endSingledate,
                    startMultidate,
                    endMultidate
                  );
                  if (viewtypePassed === "ART") {
                  } else {
                    navigation.navigate("AttendanceList", {
                      startdate: startSingledate,
                    });
                  }
                }
              }}
              BTNstyle={styles.newbuttonStyle}
              textStyle={styles.newbuttontextStyle}
              ImgStyle={undefined}
              loader={undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    //borderRadius: hp(10),
  },
  modalBackground: {
    padding: hp(5),
    // flex: 1,
    // bottom: hp(-10),
    // position: 'absolute',
    height: hp(550),
    width: wp(355),
    // borderRadius: hp(20),
    backgroundColor: "white",
    //alignItems: 'center',
  },
  imagebackgroundStyle: {
    marginTop: hp(-20),
    height: hp(50),
    width: wp(50),
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    height: hp(20),
    width: wp(20),
    alignItems: "center",
  },
  textStyle: {
    marginTop: hp(10),
    height: hp(80),
    marginLeft: hp(23),
    marginRight: hp(23),
    width: wp(319),
    fontWeight: "600",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    //  backgroundColor: COLORS.Blue,
    fontSize: hp(20),
  },
  welcomeStyle: {
    marginTop: hp(23),
    height: hp(30),
    marginLeft: hp(23),
    marginRight: hp(23),
    width: wp(319),
    fontWeight: "bold",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
    fontSize: hp(24),
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
    borderColor: COLORS.LightGrey,
    borderWidth: hp(1),
    textAlign: "center",
    // alignItems: 'center',
    // alignSelf: 'center',
  },
  newbuttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    marginLeft: hp(5),
    marginRight: hp(5),
    marginBottom: hp(5),
    marginTop: hp(5),
    //padding: 12,
    borderRadius: hp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: hp(1),
    textAlign: "center",
    alignItems: "center",
    // alignSelf: 'center',
  },
  newtextStyle: {
    color: COLORS.GrayDark,
    // alignSelf: 'center',
    fontSize: hp(18),
    // fontWeight: '700',
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
    paddingTop: hp(15),
  },
  newbuttontextStyle: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
    paddingTop: hp(15),
  },
});

export default CalendarView;
