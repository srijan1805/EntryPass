import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/color";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { hp, wp } from "../../utils/responsive-helper";
import { FONTS } from "../../constants/font";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { Buttons } from "../../components/Buttons";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import translation from "../../assets/translations/translate";

const EmployeeDetailsScreen = (props: any) => {
  const navigation = useNavigation();
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => props.resetFlip()}
        // disabled
      >
        <View style={styles.boxContainer}>
          <View style={styles.roundContainer}>
            <Image
              style={
                profileDetails.imageUrl
                  ? styles.profileImageStyle
                  : styles.profileIcon
              }
              source={
                profileDetails.imageUrl
                  ? { uri: profileDetails.imageUrl }
                  : require("../../assets/icons/Profile.png")
              }
            />
          </View>
          <View style={styles.detailsView}>
            <Text style={styles.detailsText}>{profileDetails.empNameId}</Text>
            <Text
              style={[
                styles.detailsText,
                {
                  color: COLORS.Gray,
                },
              ]}
            >
              {profileDetails.employeeName}
            </Text>
            <Text
              style={[
                styles.detailsText,
                {
                  color: COLORS.Gray,
                },
              ]}
            >
              {profileDetails.facility}
            </Text>
          </View>
          <View style={styles.qrcodeView}>
            <ImageBackground
              source={require("../../assets/icons/qr-code-border.png")}
              style={styles.qrcodeBorderIcon}
              resizeMode="contain"
            >
              {profileDetails.qrPassCode !== "" && (
                <QRCode
                  value={profileDetails.qrPassCode}
                  size={hp(210)}
                  logoMargin={4}
                  backgroundColor="white"
                  color={"#050390"}
                />
              )}
            </ImageBackground>
          </View>
          <View style={styles.scannerTextView}>
            <Text style={styles.scannerText}>
              {translation.Home.scan_qr_code}
            </Text>
            <Text style={styles.scannerText}>
              {translation.Home.place_qr_code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default EmployeeDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
    marginTop: hp(70),
    marginLeft: wp(24),
    marginRight: wp(20),
    marginBottom: hp(20),
    width: wp(327),
  },
  boxContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.White,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  roundContainer: {
    height: hp(75),
    width: hp(75),
    borderRadius: hp(75) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.White,
    position: "absolute",
    top: -30,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    height: hp(50),
    width: hp(50),
    tintColor: COLORS.Black,
  },
  profileImageStyle: {
    width: hp(75),
    height: hp(75),
    resizeMode: "cover",
    borderRadius: hp(75) / 2,
  },
  detailsView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(60),
  },
  detailsText: {
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(16),
    color: COLORS.BlackDark,
  },
  qrcodeView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    marginVertical: hp(30),
  },
  qrcodeBorderIcon: {
    height: hp(280),
    width: hp(280),
    justifyContent: "center",
    alignItems: "center",
  },
  scannerTextView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(30),
  },
  scannerText: {
    fontFamily: FONTS.Urbanist,
    fontSize: hp(16),
    color: COLORS.Gray,
  },
  divider: {
    backgroundColor: COLORS.White,
    height: hp(1),
    marginTop: hp(0),
    marginLeft: wp(14),
    marginRight: wp(16),
  },
  idcard: {
    flexWrap: "wrap",
    position: "relative",
    marginLeft: wp(16),
  },
  buttonStyle: {
    backgroundColor: COLORS.Blue,
    borderRadius: wp(10),
    alignItems: "center",
    marginTop: hp(30),
  },
  textStyle: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Semibold,
    paddingVertical: hp(12),
  },
});
