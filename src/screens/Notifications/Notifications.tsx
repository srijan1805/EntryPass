import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  RefreshControl,
  Keyboard,
  Button,
} from "react-native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../utils/responsive-helper";
import {
  updateMarkAllAsRead,
  updateMarkAsRead,
} from "../../utils/NotificationNetworksAPI";
import { useDispatch, useSelector } from "react-redux";
import LoaderView from "../../components/Loader";
import {
  getNotifications,
  isPendingNotifications,
} from "../../store/Notifications/Notifications";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { timeZonecheck } from "../../store/User/UserDetails";
import moments from "moment-timezone";
import messaging from "@react-native-firebase/messaging";
import NavigationHeader from "../../components/NavigationHeader";
// import translate from "translate-google-api";
// import { translate } from "@vitalets/google-translate-api";

function NotificationsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let timeZonecheckval = timeZonecheck();

  const [notifications, setNotifications] = useState([]);
  const [update, setUpdate] = useState(false);
  const [employeeIDdetails, setEmployeeID] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

  useEffect(() => {
    preload();
  }, [update]);

  // useEffect(() => {
  //   getTranslate();
  // }, []);

  const getTranslate = async () => {
    // const translate = require("google-translate-api");
    // translate("Ik spreek Engels", { to: "en" })
    //   .then((res) => {
    //     console.log(res.text);
    //     //=> I speak English
    //     console.log(res.from.language.iso);
    //     //=> nl
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
    // const result = await translate(`I'm fine.`, {
    //   tld: "cn",
    //   to: "vi",
    // });
    // console.log("PLPLPP", result);
  };

  const preload = () => {
    profileRetrieveData()
      .then((employeeDetails) => {
        setisLoading(true);
        setIsSupervisor(employeeDetails.isSpuervisor);
        dispatch(getNotifications(employeeDetails.employeeId))
          .then((data: any) => {
            let notificationsData = data.payload.result;
            if (data.payload != undefined) {
              setNotifications(notificationsData);
            } else {
              setNotifications([]);
            }
            dispatch(isPendingNotifications(employeeDetails.employeeId));
            setEmployeeID(employeeDetails.employeeId);
            setisLoading(false);
          })
          .catch((err: any) => {
            setNotifications([]);
            setisLoading(false);
            setEmployeeID("");
            if (
              err !== "undefined" &&
              err.toString().includes("Network Error")
            ) {
              alert(translation.AddressVerification.oops_network_err_msg);
            }
          });
      })
      .catch((err) => {
        setisLoading(false);
        setUpdate(false);
        setEmployeeID("");
        setNotifications([]);
        setIsSupervisor(false);
        setRefreshing(false);
      });
  };

  function onRefresh() {
    Keyboard.dismiss();
    preload();
  }

  const markAsRead = async (notificationId: number) => {
    setisLoading(true);
    await updateMarkAsRead(employeeIDdetails, notificationId);
    setUpdate(true);
    preload();
  };

  const markAllAsRead = async () => {
    setisLoading(true);
    await updateMarkAllAsRead(employeeIDdetails);
    setUpdate(true);
    preload();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={translation.Notifications.Notification}
          onPressCallBack={() => navigation.goBack()}
        />

        <View>
          {isSupervisor &&
          notifications.length !== 0 &&
          Array.from(notifications)
            .slice()
            .filter((item) => !item.markAsRead).length > 0 ? (
            <View style={styles.markAllAsReadContainer}>
              <TouchableOpacity onPress={() => markAllAsRead()}>
                <Text style={styles.markAllAsRead}>
                  {translation.Notifications.MarkAllAsRead}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {!isLoading && notifications.length === 0 ? (
            <View style={styles.noNotificationContainer}>
              <Text style={styles.noNotifications1}>
                {translation.Notifications.NoNotifications}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {notifications.length !== 0 &&
            Array.from(notifications)
              .slice()
              .sort(function (a: any, b: any) {
                return a.markAsRead - b.markAsRead;
              })
              .sort(function (a: any, b: any) {
                return new Date(a.createdDate) < new Date(b.createdDate)
                  ? 1
                  : -1;
              })
              .filter((item) => !item.markAsRead)
              .map((item: any, index) => {
                return (
                  <View key={index}>
                    <View
                      style={[
                        styles.notificationContainer,
                        item.markAsRead
                          ? styles.notificationRead
                          : styles.notificationUnread,
                      ]}
                    >
                      <View style={styles.notificationTitle}>
                        <Text
                          style={[
                            styles.notificationTitleContent,
                            item.markAsRead
                              ? { color: COLORS.Black }
                              : item.status === "Completed" ||
                                item.status === "ClockIn" ||
                                item.status === "AttendanceRequest" ||
                                item.status === "ClockOut"
                              ? { color: COLORS.Green }
                              : { color: COLORS.Red },
                          ]}
                        >
                          {item.header}
                        </Text>
                        <View
                          style={[
                            styles.date,
                            {
                              backgroundColor: item.markAsRead
                                ? COLORS.LightGrey
                                : COLORS.White,
                              alignItems: "center",
                            },
                          ]}
                        >
                          <Text style={styles.dateText}>
                            {moments(item?.createdDate)
                              .utc()
                              .local()
                              .format("DD MMM YYYY")}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.notificationBody}>
                        <Text style={styles.notificationBodyContent}>
                          {item.attendanceContent !== null
                            ? item.attendanceContent.startContent +
                              moments(item?.attendanceContent?.date)
                                .utc()
                                .local()
                                .format("hh:mm A") +
                              item.attendanceContent.endContent
                            : item.content}
                        </Text>
                      </View>
                      {item.markAsRead || isSupervisor ? (
                        <View />
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            markAsRead(item.id);
                          }}
                          style={styles.notificationMarkRead}
                        >
                          <Text style={styles.markAsRead}>
                            {translation.Notifications.MarkAsRead}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
          {notifications &&
          Array.from(notifications)
            .slice()
            .filter((item) => item.markAsRead).length === 0 ? (
            <View />
          ) : (
            <Text style={styles.readNotifications}>
              {translation.Notifications.ReadNotifications}
            </Text>
          )}

          {notifications.length !== 0 &&
            Array.from(notifications)
              .slice()
              .sort(function (a: any, b: any) {
                return new Date(a.createdDate) < new Date(b.createdDate)
                  ? 1
                  : -1;
              })
              .filter((item) => item.markAsRead)
              .map((item: any, index) => {
                return (
                  <View key={index}>
                    <View
                      style={[
                        styles.notificationContainer,
                        item.markAsRead
                          ? styles.notificationRead
                          : styles.notificationUnread,
                      ]}
                    >
                      <View style={styles.notificationTitle}>
                        <Text
                          style={[
                            styles.notificationTitleContent,
                            { color: COLORS.Black },
                          ]}
                        >
                          {item.header}
                        </Text>
                        <View
                          style={[
                            styles.date,
                            {
                              backgroundColor: item.markAsRead
                                ? COLORS.LightGrey
                                : COLORS.White,
                              alignItems: "center",
                            },
                          ]}
                        >
                          <Text style={styles.dateText}>
                            {moments(item?.createdDate)
                              .utc()
                              .local()
                              .format("DD MMM YYYY")}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.notificationBody}>
                        <Text style={styles.notificationBodyContent}>
                          {item.attendanceContent !== null
                            ? item.attendanceContent.startContent +
                              moments(item?.attendanceContent?.date)
                                .utc()
                                .local()
                                .format("hh:mm A") +
                              item.attendanceContent.endContent
                            : item.content}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
        </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: hp(26),
    marginBottom: hp(10),
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
    marginLeft: hp(24),
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
  readNotifications: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    fontWeight: "700",
    color: COLORS.Black,
    marginLeft: wp(24),
    marginTop: hp(18),
  },
  notificationContainer: {
    width: wp(327),
    padding: wp(10),
    marginTop: hp(10),
    marginLeft: wp(24),
    marginRight: wp(24),
    borderRadius: wp(10),
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
  },
  notificationRead: {
    borderColor: COLORS.LightGrey,
    backgroundColor: COLORS.White,
  },
  notificationUnread: {
    backgroundColor: COLORS.LightGrey,
  },
  notificationTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  notificationBody: {
    marginTop: hp(10),
  },
  notificationBodyContent: {
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
    fontSize: hp(14),
  },
  notificationMarkRead: {
    marginTop: hp(20),
  },
  notificationTitleContent: {
    fontSize: hp(18),
    width: wp(200),
    fontFamily: FONTS.Urbanist,
    fontWeight: "500",
  },
  date: {
    width: wp(90),
    marginLeft: wp(20),
    borderRadius: wp(3),
  },
  dateText: {
    padding: wp(6),
    fontSize: hp(12),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.Black,
    textAlignVertical: "center",
  },
  markAsRead: {
    color: COLORS.Blue,
    fontSize: hp(14),
    fontWeight: "600",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  noNotifications: {
    fontSize: hp(16),
    fontWeight: "500",
    textAlign: "center",
    color: COLORS.GrayDark,
    marginTop: hp(30),
  },
  noNotificationContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(10),
  },
  noNotifications1: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: hp(17),
    fontFamily: FONTS.Urbanist,
    fontWeight: "700",
    color: COLORS.DarkGrey,
    marginTop: hp(30),
  },
  markAllAsReadContainer: {
    alignSelf: "flex-end",
    marginRight: wp(26),
    marginTop: hp(15),
    marginBottom: hp(10),
  },
  markAllAsRead: {
    color: COLORS.Blue,
    fontSize: hp(14),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  scrollViewStyle: {
    marginBottom: hp(10),
  },
});

export default NotificationsScreen;
