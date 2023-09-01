import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.White,
    //  padding: hp(5),
    // top: hp(height / 3),
    marginTop: hp(34),
    marginLeft: hp(5),
    marginRight: hp(5),
  },
  instructions: {
    fontSize: hp(18),
    textAlign: "center",
    color: "#333333",
    marginBottom: hp(20),
    fontFamily: FONTS.Urbanist,
    fontStyle: "normal",
    fontWeight: "400",
  },
  phonenumber: {
    fontSize: hp(22),
    fontWeight: "400",
    textAlign: "center",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
    fontStyle: "normal",
  },
  textInputContainer: {
    marginTop: hp(40),
    marginBottom: hp(20),
  },
  roundedTextInput: {
    borderRadius: hp(10),
    borderWidth: wp(1),
    fontFamily: FONTS.Urbanist,
    fontSize: hp(20),
  },
  textInput: {
    height: hp(55),
    width: wp(55),
    borderColor: "#000",
    borderWidth: 1,
    padding: hp(10),
    fontSize: hp(16),
    letterSpacing: hp(5),
    marginTop: hp(72),
    marginBottom: hp(10),
    textAlign: "center",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
  },
  resend: {
    color: "blue",
    textDecorationLine: "underline",
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
  imageStyle: {
    // flex: 1,
    justifyContent: "center",
    marginTop: hp(33),
    marginLeft: hp(72),
    width: wp(231),
    height: hp(187),
  },
});

export default styles;
