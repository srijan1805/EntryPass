import React, { useState, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getVersion } from "react-native-device-info";
import {
  useNavigation,
  DrawerActions,
  CommonActions,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { Buttons } from "./Buttons";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import translation from "../assets/translations/translate";
import { wp, hp } from "../utils/responsive-helper";
import {
  profileRetrieveData,
  addressVerficationFacilityStoreData,
  googlesignOut,
  microsoftLogout,
  appleLogout,
  employeeretrieveData,
  clearingLogoutData,
  tokenRetrieveData,
} from "../store/User/UserDetails";
import { postLogoutAPI } from "../utils/ProfileNetworkAPI";
import { getProfileDetails } from "../store/Profile/Profile";
import { RootState } from "../store";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { logout } from "../store/Profile/Profile";
import { clearDisabledUser } from "../store/User/DisabledUser";

function DisabledDrawerComponent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );
  const [isVerifiedBySupervisor, setIsVerifiedBySuper] = useState(false);

  const [lang, setLang] = useState("en");
  const [getEmployee, setEmployee] = useState({
    name: " ",
    employeeNo: " ",
    facility: " ",
    QrPass: " ",
    notify: "",
    employeeQrcode: "",
  });
  const loginDetails = useSelector(
    (state: RootState) => state.disabledUserState
  );

  function onselect(e) {
    if (e === "ch") {
      setI18nConfig("ch", false);
    } else {
      setI18nConfig("en", false);
    }
  }

  const onPressHandler = () => navigation.navigate("DefaultPromptScreen");

  const onLogout = async () => {
    try {
      employeeretrieveData().then((tokenval) => {
        clearingLogoutData();
        dispatch(logout());
        dispatch(clearDisabledUser());
        navigation.goBack();
      });
    } catch (error) {
      console.error("Error clearing app data.", error);
    }
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
            <Text style={[styles.drawerTitle, { marginLeft: wp(20) }]}>
              {translation.DrawerNavigation.Menu}
            </Text>
            <Buttons
              text=""
              onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
              source={require("../assets/icons/Close.png")}
              ImgStyle={{ ...styles.drawerClose }}
              textStyle={{ ...styles.drawerTitle }}
              loader={false}
              BTNstyle={{ color: COLORS.Black }}
            />
          </View>

          <View
            style={[
              styles.profile,
              {
                backgroundColor: isVerifiedBySupervisor
                  ? COLORS.Green
                  : COLORS.Red,
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
                  style={styles.profileImage}
                  source={require("./../assets/icons/Profile.png")}
                />
                <View>
                  {loginDetails?.loginDetails?.tokenVal
                    // .toUpperCase()
                    .match("/uems/gi") && (
                    <Text style={styles.profileTitle}>
                      {loginDetails?.loginDetails?.tokenVal.toLowerCase()}
                    </Text>
                  )}
                  <Text style={styles.profileName}>{loginDetails.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Drawer Components */}
          <View style={styles.drawerComponents}>
            <TouchableHighlight
              disabled={false}
              underlayColor={COLORS.White}
              onPress={onPressHandler}
            >
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Address.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.AddressVerification}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              disabled={false}
              underlayColor={COLORS.White}
              onPress={onPressHandler}
            >
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Location.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.AddressHistory}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              disabled={false}
              underlayColor={COLORS.White}
              onPress={onPressHandler}
            >
              <View style={[styles.drawerComponentsRow]}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/ART-Test.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.ARTTest}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              disabled={false}
              underlayColor={COLORS.White}
              onPress={onPressHandler}
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
              underlayColor={COLORS.White}
              onPress={onPressHandler}
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
              <View style={styles.drawerComponentsRow}>
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("./../assets/icons/Language.png")}
                  />
                </View>
                <Text style={styles.componentTitle}>
                  {translation.DrawerNavigation.ChangeLanguage}
                </Text>
              </View>
              <View>
                <View style={styles.tabs}>
                  <TouchableWithoutFeedback
                    disabled={false}
                    onPress={() => {
                      onselect("en");
                      setLang("en");
                    }}
                  >
                    <View style={[lang == "en" ? styles.tabStyle : {}]}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          style={styles.checkLanguage}
                          source={
                            lang == "en"
                              ? require("../assets/icons/Checked-Select.png")
                              : require("../assets/icons/Unchecked.png")
                          }
                        />
                        <Text style={[styles.Language]}>English</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback
                    disabled={false}
                    onPress={() => Alert.alert("Development in progress")}
                  >
                    <View style={[lang == "ch" ? styles.tabStyle : {}]}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          style={[styles.checkLanguage, { marginTop: hp(4) }]}
                          source={
                            lang == "ch"
                              ? require("../assets/icons/Checked-Select.png")
                              : require("../assets/icons/Unchecked.png")
                          }
                        />
                        <Text style={[styles.Language, { marginTop: 5 }]}>
                          {translation.Chines.Chines}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={onLogout}>
              <View style={[styles.drawerComponentsRow1, styles.logout]}>
                <View style={styles.componentImageBackground1}>
                  <Image
                    style={styles.componentImage1}
                    source={require("./../assets/icons/Logout.png")}
                  />
                </View>
                <Text style={styles.componentTitle1}>
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
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.Urbanist_Medium,
                fontSize: hp(16),
                color: COLORS.DarkGrey,
              }}
            >
              {`${translation.DrawerNavigation.version} ${getVersion()}`}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerView: {
    backgroundColor: COLORS.White,
    marginLeft: wp(10),
    marginRight: wp(10),
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp(5),
  },
  drawerTitle: {
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(25),
    color: COLORS.Black,
    lineHeight: hp(30),
  },
  drawerClose: {
    tintColor: COLORS.Black,
    height: hp(20),
    width: wp(20),
    marginTop: hp(5),
    marginRight: wp(5),
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
    marginBottom: hp(10),
  },
  profileName: {
    color: COLORS.White,
    fontSize: hp(22),
    marginLeft: wp(14),
    right: wp(8),
    marginTop: hp(2),
    width: wp(170),
    fontFamily: FONTS.Urbanist_Semibold,
    flexWrap: "wrap",
  },
  loggedInView: {
    justifyContent: "flex-start",
    marginTop: hp(17),
    // padding: hp(5),
  },
  profileTitle: {
    color: COLORS.White,
    fontSize: hp(16),
    marginLeft: wp(8),
    fontFamily: FONTS.Urbanist_Semibold,
  },
  loggedIn: {
    color: COLORS.White,
    fontSize: hp(14),
    marginLeft: wp(18),
    fontFamily: FONTS.Urbanist,
  },
  profileImage: {
    width: wp(41),
    height: wp(41),
    marginLeft: wp(8),
  },
  horizontalLine: {
    marginTop: hp(16),
    borderBottomColor: COLORS.White,
    borderBottomWidth: wp(1),
    opacity: 0.25,
  },
  profileSubTitleRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  subTitle: {
    color: COLORS.White,
    fontSize: hp(15),
    marginLeft: wp(8),
    margin: hp(12),
    fontFamily: FONTS.Urbanist,
  },

  drawerComponents: {
    width: wp(312),
    justifyContent: "flex-start",
  },
  drawerComponentsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "auto",
    padding: hp(10),
  },
  componentImageBackground: {
    // padding: wp(7),
    backgroundColor: COLORS.LightGrey,
    borderColor: COLORS.Grey2,
    borderRadius: wp(30),
    marginTop: hp(15),
    marginLeft: wp(14),
    height: wp(39),
    width: wp(39),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  componentImage: {
    width: wp(22),
    height: wp(22),
    alignSelf: "center",
    // tintColor: COLORS.Grey2,
  },
  componentTitle: {
    marginLeft: wp(12),
    marginTop: hp(15),
    fontSize: hp(16),
    textAlignVertical: "center",
    fontFamily: FONTS.Urbanist_Medium,
    color: COLORS.Black,
  },
  componentVerification: {
    width: wp(28),
    height: hp(28),
    marginTop: hp(20),
    marginLeft: wp(14),
    right: hp(0),
    position: "absolute",
  },
  logout: {
    // marginTop: hp(50),
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: wp(175),
    marginLeft: wp(70),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(8),
    paddingVertical: hp(4),
  },
  Language: {
    color: COLORS.Black,
    fontSize: hp(14),
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "normal",
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
    fontWeight: "bold",
    padding: wp(5),
    marginRight: wp(10),
  },
  alertIcon: {
    height: hp(20),
    width: wp(20),
    marginLeft: wp(18),
    marginTop: hp(12),
  },
  drawerComponentsRow1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "auto",
    padding: hp(10),
    //backgroundColor: COLORS.Yellow,
  },
  componentImageBackground1: {
    marginLeft: wp(14),
    backgroundColor: COLORS.GreyAccent,
    borderColor: COLORS.GreyAccent,
    borderRadius: wp(30),
    marginTop: hp(15),
    height: wp(39),
    width: wp(39),
    justifyContent: "center",
    alignContent: "center",
  },
  componentImage1: {
    width: wp(22),
    height: wp(22),
    alignSelf: "center",
    // paddingRight: wp(10),
  },
  componentTitle1: {
    marginLeft: wp(12),
    marginTop: hp(15),
    fontSize: hp(16),
    textAlignVertical: "center",
    fontFamily: FONTS.Urbanist_Medium,
    color: COLORS.Black,
  },
  componentVerification1: {
    width: wp(28),
    height: wp(28),
    marginTop: hp(20),
    marginLeft: wp(14),
    right: hp(0),
    position: "absolute",
  },
});

export default DisabledDrawerComponent;
