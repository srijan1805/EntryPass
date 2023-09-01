import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  emptyDataContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(16),
    color: COLORS.Black,
  },
});

export default styles;
