import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  topLogoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: hp(10),
    marginBottom: hp(30),
  },
  topLogo: {
    height: hp(40),
    width: wp(40),
  },
  topLogoText: {
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.Black,
    fontSize: wp(25),
  },
  girlLogo: {
    alignItems: "center",
    justifyContent: "center",
    // marginTop: hp(36),
  },
  welcomeText: {
    alignItems: "center",
  },
  welcome: {
    fontSize: hp(30),
    marginTop: hp(34),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
    fontStyle: "normal",
  },
  empContainer: {
    marginTop: hp(34),
    alignItems: "center",
    flexDirection: "row",
  },
  textField: {
    flexDirection: "row",
    width: wp(277),
    height: hp(55),
  },
  newImageStyle: {
    width: wp(30),
    height: hp(30),
    marginLeft: wp(16),
    // top: 10,
  },
  inputField: {
    backgroundColor: "#F8F7F7",
    marginHorizontal: hp(24),
    borderColor: COLORS.placeHolderColor,
    borderWidth: wp(1),
    width: wp(277),
    fontFamily: FONTS.Urbanist,
    padding: hp(12),
    fontSize: hp(18),
    borderRadius: wp(10),
    color: COLORS.Black,
  },

  signin: {
    fontSize: wp(20),
    marginTop: hp(11),
    /// fontWeight: 'normal',
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
    //fontStyle: 'normal',
  },

  buttonStyle: {
    marginLeft: wp(24),
    width: wp(326),
    height: hp(54),
    backgroundColor: COLORS.Blue,
    marginTop: hp(20),
    borderRadius: wp(10),
  },
  buttonTxt: {
    fontSize: hp(18),
    marginTop: hp(16),
    alignSelf: "center",
    // fontWeight: '700',
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },
  or: {
    textAlign: "center",
    fontSize: hp(17),
    color: COLORS.GrayDark,
    marginTop: hp(24),
    marginBottom: hp(24),
    fontFamily: FONTS.Urbanist_Bold,
    // top: -height * 0.02,
  },
  socialSignin: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.White,
    borderColor: COLORS.LightGrey,
    marginHorizontal: wp(24),
    marginVertical: hp(5),
    height: hp(55),
    borderWidth: wp(1),
    borderRadius: wp(10),
    // flexDirection: "row",
    // // flexWrap: "wrap",
    // // alignItems: "center",
    // // justifyContent: "flex-start",
    // backgroundColor: COLORS.White,
    // borderColor: COLORS.LightGrey,
    // width: wp(327),
    // height: hp(55),
    // borderWidth: wp(1),
    // borderRadius: wp(10),
    // marginTop: hp(5),
    // marginBottom: hp(5),
    // marginLeft: wp(24),
  },
  logoStyle: { marginLeft: wp(23), alignSelf: "center" },
  socialSigninText: {
    marginLeft: wp(20),
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
  },
  versionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? hp(60) : 0,
    paddingTop: 10,
  },
  versionText: {
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(16),
    color: COLORS.DarkGrey,
  },
});

export default styles;
