import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    marginBottom: hp(12),
  },
  textLeft: {
    marginLeft: wp(24),
    fontSize: hp(14),
    fontFamily: FONTS.Urbanist_Medium,
    alignSelf: "center",
    width: wp(90),
    color: COLORS.Black,
  },
  textContainer: {
    // borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(8),
    marginLeft: wp(15),
    width: wp(233),
    height: hp(40),
    marginRight: wp(24),
    alignContent: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: hp(14),
    fontFamily: FONTS.Urbanist_Semibold,
    justifyContent: "flex-start",
    textAlignVertical: "center",
    marginLeft: wp(10),
    color: COLORS.Black,
  },
  divider: {
    borderColor: COLORS.LightGrey,
    borderBottomWidth: wp(1),
    marginLeft: wp(24),
    marginRight: wp(24),
    marginBottom: hp(10),
  },
  buttonStyle: {
    width: wp(106),
    height: hp(40),
    marginRight: wp(24),
    marginBottom: hp(10),
    alignSelf: "flex-end",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.Yellow,
    borderRadius: wp(10),
  },
  buttonTxt: {
    fontSize: hp(14),
    alignSelf: "center",
    textAlignVertical: "center",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  pending: {
    height: wp(26),
    width: wp(24),
    alignSelf: "center",
    marginRight: wp(18),
  },
  logoutBtn: {
    backgroundColor: COLORS.Blue,
    borderRadius: wp(10),
    width: wp(327),
    height: hp(55),
    marginLeft: wp(24),
    marginRight: wp(24),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  logoutIcons: {
    alignItems: "center",
    resizeMode: "contain",
    height: hp(22),
    width: wp(22),
  },
  logoutText: {
    textAlignVertical: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.White,
  },
});

export default styles;
