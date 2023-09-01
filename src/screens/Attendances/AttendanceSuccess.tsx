import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import moment from "moment";
import { timeZonecheck } from "../../store/User/UserDetails";
import { useDispatch } from "react-redux";
import { updateAction } from "../../store/Attendances/Attendances";
import SuccessAnimation from "../../components/SuccessAnimation";

const AttendanceSuccess = ({ navigation, route }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      let todaydate = new Date();
      let timeZonecheckval = timeZonecheck();
      todaydate.setDate(todaydate.getDate() - 6);
      let datesend = moment(todaydate.toString() + "Z")
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD");
      let todaydateend = new Date(datesend);
      let todaydatestart = new Date();

      dispatch(updateAction());
      navigation.navigate("AttendanceHomeScreen", {
        employeeID: route?.params?.item?.employeeID,
        multiStartdate: todaydatestart,
        multiEnddate: todaydateend,
        singleStartdates: todaydatestart,
        singleEnddates: todaydatestart,
        isGpsAttendance: route?.params?.item?.isGpsAttendance,
      });
    }, 2300);
  }, []);
  return (
    <>
      <SuccessAnimation />
    </>
  );
};

export default AttendanceSuccess;

const styles = StyleSheet.create({});
