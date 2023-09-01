import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  StatusBar,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { wp, hp } from "../../utils/responsive-helper";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { searchNonExistingUser } from "../../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MainNavigationHeader } from "../../components/NavigationHeader";

const HomeDisabled = (props) => {
  const navigation = useNavigation();

  const { name: userName, loginDetails } = useSelector(
    (state: RootState) => state.disabledUserState
  );

  const isPhoneNotNumberValid =
    (loginDetails?.phoneNumber === "" || loginDetails?.phoneNumber === null) &&
    loginDetails?.loginType === 0;

  const onSearchProfilePress = async () => {
    try {
      await searchNonExistingUser(loginDetails);
      await props?.navigation.goBack();
      await props?.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "Registration",
              params: {
                scanType: "facility",
                scancompete: false,
                stepIndicatorval: 1,
              },
            },
          ],
        })
      );
    } catch (error) {
      Alert.alert(translation.InactiveUser.alert_message);
    }
  };

  const onPressHandler = () => navigation.navigate("DefaultPromptScreen");

  const onEmailPress = () => {
    Linking.openURL("mailto:techsupport@uemsgroup.com");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <MainNavigationHeader navigation={navigation} isDisabled={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeText}>
          <Text style={[styles.welcomeTop, { fontSize: wp(22) }]}>
            {translation.Home.welcome}
          </Text>
          {userName ? (
            <Text style={[styles.signInName, { fontSize: wp(25) }]}>
              {userName}
            </Text>
          ) : (
            <></>
          )}
        </View>

        {isPhoneNotNumberValid ? (
          <View style={styles.RadioContainer}>
            <View>
              <View style={styles.idcard_bg}>
                <Image
                  style={styles.profileImage}
                  source={require("../../assets/icons/logo.png")}
                />
                <Text style={styles.entry_label}>
                  {translation.Home.entry_pass}
                </Text>
              </View>
              <View>
                <Text style={styles.idText}>
                  {translation.Home.digital_id_card}
                </Text>
              </View>
              <Text style={styles.divider} />
              <View
                style={[
                  styles.homeDisabledCard,
                  {
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Image
                  style={styles.disabledImage}
                  source={require("../../assets/images/HomeDisabled.png")}
                />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={[styles.noUserContentText]}>
                    {translation.InactiveUser.inactive_account}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc1}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc2}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc3}
                    <Text onPress={onEmailPress} style={styles.emailText}>
                      {translation.InactiveUser.desc4}
                    </Text>
                    {translation.InactiveUser.desc5}
                  </Text>
                </View>
              </View>

              <View style={styles.searchProfileView}>
                <TouchableOpacity
                  style={{ backgroundColor: COLORS.Red, borderRadius: 5 }}
                  onPress={onSearchProfilePress}
                >
                  <Text style={styles.searchProfileText}>
                    {translation.InactiveUser.search_profile}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.noUserCard}>
              <View>
                <View style={styles.nouserIdCard}>
                  <Image
                    style={styles.profileImage}
                    source={require("../../assets/icons/logo.png")}
                  />
                  <Text style={styles.entry_label}>
                    {translation.Home.entry_pass}
                  </Text>
                </View>

                <Text style={styles.divider} />
                <View
                  style={[
                    styles.homeDisabledCard,
                    {
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Image
                    style={styles.noUserImage}
                    source={require("../../assets/images/non-user.png")}
                  />
                  <Text style={[styles.noUserContentText]}>
                    {translation.InactiveUser.inactive_account}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc1}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc2}
                  </Text>
                  <Text style={styles.noUserContentText}>
                    {translation.InactiveUser.desc3}
                    <Text onPress={onEmailPress} style={styles.emailText}>
                      {translation.InactiveUser.desc4}
                    </Text>
                    {translation.InactiveUser.desc5}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

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
                alignItems: "center",
              }}
            >
              <TouchableHighlight
                style={[styles.drawerComponentsRow]}
                underlayColor={COLORS.LightGrey}
                onPress={onPressHandler}
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
                onPress={onPressHandler}
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
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <TouchableHighlight
                style={[styles.drawerComponentsRow]}
                underlayColor={COLORS.LightGrey}
                onPress={onPressHandler}
              >
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("../../assets/icons/ART-Test.png")}
                  />
                </View>
              </TouchableHighlight>

              <Text style={[styles.componentTitle]}>
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
                onPress={onPressHandler}
              >
                <View style={styles.componentImageBackground}>
                  <Image
                    style={styles.componentImage}
                    source={require("../../assets/icons/Vaccination.png")}
                  />
                </View>
              </TouchableHighlight>

              <Text style={[styles.componentTitle]}>
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
                onPress={onPressHandler}
              >
                <View style={styles.componentImageBackground}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={hp(25)}
                    color={"#665DE5"}
                  />
                </View>
              </TouchableHighlight>

              <Text style={[styles.componentTitle]}>
                {translation.Home.gps_attendance}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  CardContainer: {
    backgroundColor: COLORS.White,
    flex: 1,
  },
  ShortCutComponentsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(27),
    width: wp(327),
  },
  welcomeText: {
    marginTop: hp(25),
    alignItems: "flex-start",
    marginLeft: wp(25),
    fontSize: wp(25),
  },
  empData: {
    marginTop: hp(25),
    fontSize: wp(14),
    // fontWeight: 'normal',
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
    // fontStyle: 'normal',
  },
  welcomeTop: {
    marginTop: hp(4),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
    fontStyle: "normal",
  },
  signInName: {
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
    fontStyle: "normal",
  },
  welcome: {
    marginTop: hp(25),
    fontSize: wp(14),
    fontWeight: "500",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  shortcutHeading: {
    marginTop: hp(25),
    marginLeft: wp(24),
    fontSize: wp(16),

    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },
  facility: {
    marginTop: hp(12),
    fontSize: wp(14),
    fontWeight: "500",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  empfacility: {
    marginTop: hp(12),
    fontSize: wp(14),

    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },
  emailText: {
    color: COLORS.Blue,
    textDecorationLine: "underline",
    textDecorationStyle: "double",
  },
  searchProfileView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  searchProfileText: {
    fontSize: hp(17),
    color: COLORS.White,
    textAlign: "center",
    fontFamily: FONTS.Urbanist_Semibold,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  idText: {
    fontSize: wp(14),
    fontWeight: "500",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,

    marginLeft: wp(16),
    marginTop: hp(7),
    marginBottom: hp(7),
  },
  entry_label: {
    fontSize: wp(18),

    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,

    paddingLeft: wp(6),
  },
  shortcutLayout: {
    marginTop: hp(28),
    width: wp(327),
    marginLeft: wp(24),
    marginRight: wp(24),

    borderRadius: wp(15),
    borderTopRightRadius: wp(20),
    backgroundColor: COLORS.GreyAccent,
  },
  digitalId: {
    flexDirection: "column",
    //fontWeight: 'bold',
  },
  drawerComponentsRow: {
    flexDirection: "row",

    borderRadius: wp(8),
  },
  idcard: {
    flexWrap: "wrap",
    position: "relative",
    marginLeft: wp(16),
  },
  idcard_bg: {
    flexDirection: "row",
    width: wp(321),
    height: hp(44),
    margin: wp(2),
    alignItems: "center",
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    backgroundColor: COLORS.White,
  },
  qrcode: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    width: wp(321),
  },
  qrimage: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(74),
    height: wp(74),
    backgroundColor: COLORS.White,
    borderRadius: wp(6),
    marginTop: hp(10),
    marginRight: hp(16),
  },
  profileImage: {
    width: wp(30),
    height: hp(20),
    marginLeft: wp(10),
    alignItems: "center",
  },
  componentImageBackground: {
    height: hp(46),
    width: wp(46),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.White,
    borderRadius: wp(8),
  },
  componentImage: {
    width: wp(30),
    height: wp(30),
    paddingRight: wp(10),
  },
  componentTitle: {
    // top: hp(7),
    fontSize: wp(12),
    color: COLORS.Black,
    textAlign: "center",
    paddingBottom: wp(7),
    fontFamily: FONTS.Urbanist_Semibold,
    flexWrap: "wrap",
    width: wp(96),
    // marginLeft: wp(18),
    marginTop: hp(12),
  },
  buttonStyle: {
    padding: wp(15),
    width: wp(320),
    height: hp(60),
    alignSelf: "center",
    marginTop: hp(36),
    marginBottom: hp(32),
    borderRadius: wp(18),
    backgroundColor: COLORS.Purple,
  },
  buttonTxt: {
    fontSize: wp(20),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist,
  },
  componentVerification: {
    left: wp(12),
    width: wp(20),
    height: wp(20),
    top: wp(15),
    alignContent: "flex-end",
    marginLeft: wp(70),
    marginTop: wp(-25),
    zIndex: wp(1),
  },
  containerborder: {
    padding: wp(20),
    flex: 1,
    backgroundColor: COLORS.White,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  TextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
  },

  RadioContainer: {
    borderWidth: 1,
    borderColor: COLORS.LightBlue,
    borderRadius: wp(8),
    marginLeft: wp(24),
    marginRight: wp(20),
    marginTop: hp(25),
    padding: 0,
    // flexWrap: 'wrap',
    width: wp(327),
    // height: hp(191),
    backgroundColor: COLORS.LightBlue,
  },
  divider: {
    backgroundColor: COLORS.White,
    height: hp(1),
    width: wp(295),
    marginTop: hp(0),
    marginLeft: wp(14),
    marginRight: wp(16),
  },
  homeDisabledCard: {
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledImage: {
    width: wp(73),
    height: wp(74),
    // marginLeft: wp(16),
    marginTop: hp(16),
    resizeMode: "contain",
  },
  disabledText: {
    // width: wp(200),
    // marginLeft: wp(25),
    marginHorizontal: 20,
    marginTop: hp(21),
    fontSize: hp(14),
    fontWeight: "400",
    lineHeight: hp(22),
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
    textAlign: "center",
    paddingBottom: 5,
  },

  noUserCard: {
    borderWidth: 1,
    borderColor: COLORS.LightGrey,
    borderRadius: wp(8),
    marginLeft: wp(24),
    marginRight: wp(20),
    marginTop: hp(15),
    padding: 0,
    // flexWrap: 'wrap',
    width: wp(327),
    // height: hp(191),
    backgroundColor: COLORS.White,
  },
  nouserIdCard: {
    flexDirection: "row",
    width: wp(321),
    height: hp(44),
    margin: wp(2),
    alignItems: "center",
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    // backgroundColor: COLORS.LightBlue,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LightGrey,
  },
  noUserImage: {
    width: wp(300),
    height: wp(200),
    marginLeft: wp(16),
    // marginTop: hp(16),
    resizeMode: "cover",
    overflow: "hidden",
  },
  noUserContentText: {
    marginHorizontal: 20,
    marginTop: hp(0),
    fontSize: hp(15),
    lineHeight: hp(22),
    color: COLORS.Black,
    textAlign: "center",
    paddingBottom: 10,
    // textDecorationLine: "underline",
    textDecorationColor: COLORS.Black,
    textDecorationStyle: "double",
    fontFamily: FONTS.Urbanist_Bold,
  },
  emailText: {
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(14),
    color: COLORS.Blue,
    textDecorationLine: "underline",
  },
});

export default HomeDisabled;
