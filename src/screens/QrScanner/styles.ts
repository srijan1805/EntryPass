import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  facility: {
    marginVertical: hp(50),
    marginLeft: hp(25),
    height: hp(270),
    width: wp(50),
    alignItems: "center",
    marginTop: hp(10),
  },
  selectItem: {
    height: hp(40),
    borderRadius: wp(8),
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.White,
  },
  TextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
  },
  registration: {
    fontSize: hp(18),
    justifyContent: "space-evenly",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Medium,
    marginLeft: wp(14),
    marginTop: hp(13),
    alignSelf: "center",
  },

  RadioContainer: {
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(8),
    marginBottom: hp(8),
    marginLeft: wp(10),
    marginTop: hp(25),
    marginRight: wp(20),
    width: wp(260),
    height: hp(58),
  },

  RadioButtons: {
    alignItems: "center",
    marginBottom: wp(8),
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
    fontSize: hp(25),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
  dropdown: {
    width: wp(26),
    height: hp(26),
    marginTop: hp(13),
    tintColor: COLORS.White,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: wp(10),
  },

  //qrscanner

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
  bottomTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
    textAlignVertical: "center",
    alignSelf: "center",
    margin: wp(10),
    height: hp(30),
  },
  bottomIcon: {
    height: wp(42),
    width: wp(42),
    borderRadius: wp(10),
    alignSelf: "center",
  },
  bottomView: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: COLORS.LightGrey,
    width: wp(65),
    height: wp(65),
    borderRadius: wp(50),
  },
  preview: {
    height: hp(620),
    borderRadius: hp(30),
    width: wp(375),
    justifyContent: "center",
  },
  bottomContainer: {
    backgroundColor: COLORS.White,
    height: hp(150),
    width: wp(375),
    position: "absolute",
    bottom: hp(0),
  },
});

export default styles;
