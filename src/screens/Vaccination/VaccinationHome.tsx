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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import { VerifyQR } from "../../utils/AttendenceQrAPI";
import { loginAPIcall } from "../../utils";
import { profileRetrieveData } from "../../store/User/UserDetails";
import LoaderView from "../../components/Loader";
import NavigationHeader from "../../components/NavigationHeader";

function VaccinationHome() {
  const [getId, setId] = useState(0);
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [EmployeeID, setEmployeeID] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  useEffect(() => {
    setisLoading(true);
    preload();
    setisLoading(false);
  });

  const preload = () => {
    profileRetrieveData()
      .then((tokenval) => {
        setIsSupervisor(tokenval.isSpuervisor);
        setEmployeeID(tokenval.empNameId);
        setisAllowedEmployeeMobileForOthers(
          tokenval.isAllowedEmployeeMobileForOthers
        );
      })
      .catch((err) => {
        setIsSupervisor(false);
        setEmployeeID("");
      });
  };

  const selfVaccination = () => {
    loginAPIcall
      .ArtTestIdApiGet(EmployeeID, 3)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          if (tokenRes.data.result.success) {
            navigation.navigate("VaccinationDetails", {
              StaffID: userId,
              Type: "self",
            });
          } else {
            console.log("Invalid ID Try Again");
          }
        }
      })
      .catch((err) => {
        if (
          err !== "undefined" &&
          err.response.data.result.statusCode.toString().includes("403") &&
          err.response.data.result.errors
            .toString()
            .includes("Staff is Inactive")
        ) {
          Alert.alert(err.response.data.result.errors.toString());
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else {
          Alert.alert(translation.ArtTest.pls_enter_correct_id);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        title={translation.DrawerNavigation.Vaccination}
        onPressCallBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.marginTop60}>
          <Image
            source={require("../../assets/images/vaccination.png")}
            style={styles.backgroundImage}
          />

          <Buttons
            onPress={selfVaccination}
            text={translation.ArtTest.Start}
            BTNstyle={{ ...styles.buttonStyle }}
            textStyle={{ ...styles.buttonTxt }}
            ImgStyle={undefined}
            loader={undefined}
          />
          {isSupervisor && isAllowedEmployeeMobileForOthers ? (
            <Buttons
              onPress={() =>
                navigation.navigate("VaccinationVerificationForOthers")
              }
              text={translation.Vaccination.vacc_others}
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
        </View>
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
    height: hp(25),
    tintColor: COLORS.DarkGrey,
  },
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },

  backgroundImage: {
    width: wp(160),
    height: hp(219.5),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  textField: {
    flexDirection: "row",
    marginTop: hp(55),
  },
  inputField: {
    // marginLeft: wp(24),
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
    // marginLeft: wp(24),
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
    marginTop: hp(5),
  },
  marginTop60: {
    alignItems: "center",
    justifyContent: "center",
  },
  SuperbuttonStyle: {
    padding: wp(10),
    width: wp(326),
    height: hp(54),
    backgroundColor: COLORS.Blue,
    marginTop: hp(0),
    marginBottom: hp(20),
    borderRadius: wp(10),
    alignItems: "center",
    alignSelf: "center",
  },
});

export default VaccinationHome;
