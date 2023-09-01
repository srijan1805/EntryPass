import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  RefreshControl,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import { ARTTestTabs } from "../../navigations/AppNavigation";
import ArtTestSelf from "./ArtTestSelf";
import { loginAPIcall } from "../../utils";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { ARTtestSelfList } from "../../utils/ArtTestAPI";
import LoaderView from "../../components/Loader";
import { timeZonecheck } from "../../store/User/UserDetails";

function ArtTestHome({ route }) {
  const [userId, setUserId] = useState("");
  const [EmployeeID, setEmployeeID] = useState("");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isTestResultPositive, setIsTestResultPositive] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const navigation = useNavigation();

  let data = {};
  let date = new Date();
  data = {
    startDate: new Date(date.setDate(new Date().getDate() - 15)),
    endDate: new Date(),
  };

  const preload = () => {
    profileRetrieveData()
      .then((tokenval) => {
        setIsSupervisor(tokenval.isSpuervisor);
        setEmployeeID(tokenval.empNameId);
        setisAllowedEmployeeMobileForOthers(
          tokenval.isAllowedEmployeeMobileForOthers
        );

        ARTtestSelfList(tokenval.employeeId, data)
          .then((resp) => {
            let result = resp.data.result;
            if (result.length === 0) {
              setIsTestResultPositive(false);
            } else {
              let sortedResult = result.sort(function (a, b) {
                return new Date(b.testDate) - new Date(a.testDate);
              });
              let testResult = sortedResult[0].testResult;
              testResult === "Positive"
                ? setIsTestResultPositive(true)
                : setIsTestResultPositive(false);
            }
            setisLoading(false);
          })
          .catch((err) => {
            setisLoading(false);
            setIsTestResultPositive(false);
          });
      })
      .catch((err) => {
        setIsSupervisor(false);
        setEmployeeID("");
      });
  };

  useEffect(() => {
    setisLoading(true);
    preload();
    setisLoading(false);
  });

  function onRefresh() {
    Keyboard.dismiss();
    preload();
  }

  const ScanQr = () => {
    navigation.navigate("ArtTestQrScan", { scanType: "arttest" });
  };

  const selfArtTest = () => {
    loginAPIcall
      .ArtTestIdApiGet(EmployeeID, 2)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          if (tokenRes.data.result.success) {
            navigation.navigate("ArtTestDetails", {
              employeeID: tokenRes.data.result.employeeID,
            });
          } else {
            Alert.alert(
              translation.AlertMessage.Alert,
              translation.ArtTest.pls_enter_correct_id,
              [{ text: translation.Buttons_lable.Ok, onPress: () => {} }],
              { cancelable: false }
            );
          }
        }
      })
      .catch((err) => {
        Alert.alert(
          translation.AlertMessage.Alert,
          translation.ArtTest.pls_enter_correct_id,
          [{ text: translation.Buttons_lable.Ok, onPress: () => {} }],
          { cancelable: false }
        );
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Image
              style={styles.backButton}
              source={require("../../assets/icons/BackArrow.png")}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translation.ArtTest.ArtTest}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.marginTop60}>
          <Image
            source={require("../../assets/images/ART-Image.png")}
            style={styles.backgroundImage}
          />

          <Buttons
            onPress={selfArtTest}
            text={translation.ArtTest.Start}
            BTNstyle={{ ...styles.buttonStyle }}
            textStyle={{ ...styles.buttonTxt }}
            ImgStyle={undefined}
            loader={undefined}
          />

          {isSupervisor && isAllowedEmployeeMobileForOthers ? (
            <Buttons
              onPress={() => navigation.navigate("ArtTestForOthers")}
              text={translation.ArtTest.Art_Test_Others}
              BTNstyle={{
                ...styles.SuperbuttonStyle,
                backgroundColor: COLORS.Yellow,
              }}
              textStyle={{ ...styles.buttonTxt, color: COLORS.Black }}
              ImgStyle={undefined}
              loader={undefined}
            />
          ) : (
            <></>
          )}

          {isTestResultPositive ? (
            <View style={styles.testResContainer}>
              <Text style={styles.artTextResultTit}>
                {translation.ArtTest.Result +
                  ": " +
                  translation.ArtTest.Positive}
              </Text>
              <Text style={styles.artTextResult}>
                {translation.ArtTest.TestResultPositive}
              </Text>
            </View>
          ) : (
            <View />
          )}

          <View style={styles.bottomBorder} />
        </View>
        {isSupervisor && isAllowedEmployeeMobileForOthers ? (
          <>
            <Text style={styles.artHistoryTitleText}>
              {translation.ArtTest.History}
            </Text>
            <View style={styles.supervisorScrollTabs}>
              <ARTTestTabs />
            </View>
          </>
        ) : (
          <>
            <ArtTestSelf />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  scrollView: {
    marginBottom: hp(10),
    backgroundColor: COLORS.White,
  },
  marginTop60: {
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
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
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
  backgroundImage: {
    width: wp(160),
    height: hp(219.5),
    alignSelf: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  textField: {
    flexDirection: "row",
    marginTop: hp(55),
  },
  inputField: {
    marginLeft: wp(24),
    borderColor: COLORS.placeHolderColor,
    borderWidth: wp(1),
    width: wp(277),
    fontFamily: FONTS.Urbanist,
    padding: wp(10),
    fontSize: hp(18),
    borderRadius: wp(10),
    color: COLORS.DarkGrey,
  },
  buttonStyle: {
    padding: wp(10),
    width: wp(326),
    height: hp(54),
    backgroundColor: COLORS.Blue,
    marginTop: hp(20),
    marginBottom: hp(20),
    borderRadius: wp(10),
    marginLeft: wp(24),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Semibold,
    paddingTop: hp(5),
  },
  scanIcon: {
    width: wp(30),
    height: hp(30),
    marginLeft: wp(16),
    alignSelf: "center",
  },
  bottomBorder: {
    width: wp(327),
    alignSelf: "center",
    borderBottomWidth: wp(1),
    borderBottomColor: COLORS.LightGrey,
    marginTop: hp(20),
  },
  supervisorScrollTabs: {
    flex: 1,
    height: Dimensions.get("window").height / 1.5,
  },
  testResContainer: {
    width: wp(327),
    height: hp(120),
    borderRadius: wp(22),
    alignSelf: "center",
    borderColor: COLORS.Red,
    borderWidth: 1,
    alignItems: "center",
    paddingTop: hp(10),
    paddingBottom: hp(10),
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
  SuperbuttonStyle: {
    padding: wp(10),
    width: wp(326),
    height: hp(54),
    backgroundColor: COLORS.Blue,
    marginTop: hp(0),
    marginBottom: hp(20),
    borderRadius: wp(10),
    marginLeft: wp(24),
  },
});

export default ArtTestHome;
