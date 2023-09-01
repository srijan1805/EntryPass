import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";

function getTabIndex(state) {
  if (state && state.index) {
    return state.index;
  }
  return 0;
}

const CustomAttendanceTabs = (props: any) => {
  return (
    <>
      <View style={{ backgroundColor: COLORS.White }}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AttendanceHomeScreen");
            }}
            style={[
              styles.verificationTab,
              {
                backgroundColor:
                  getTabIndex(props.state) === 0 ? COLORS.Blue : COLORS.White,
                borderTopRightRadius:
                  getTabIndex(props.state) === 0 ? wp(10) : 0,
                borderBottomRightRadius:
                  getTabIndex(props.state) === 0 ? wp(10) : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarTitle,
                {
                  color:
                    getTabIndex(props.state) === 0
                      ? COLORS.White
                      : COLORS.Black,
                },
              ]}
            >
              {translation.Attendance.self}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AttendanceList");
            }}
            style={[
              styles.historyTab,
              {
                backgroundColor:
                  getTabIndex(props.state) === 1 ? COLORS.Blue : COLORS.White,
                borderTopLeftRadius:
                  getTabIndex(props.state) === 1 ? wp(10) : 0,
                borderBottomLeftRadius:
                  getTabIndex(props.state) === 1 ? wp(10) : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarTitle,
                {
                  color:
                    getTabIndex(props.state) === 1
                      ? COLORS.White
                      : COLORS.Black,
                },
              ]}
            >
              {translation.Attendance.all_staff}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: hp(50),
    borderWidth: wp(1),
    borderColor: COLORS.White,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
  },
  tabBar: {
    borderRadius: wp(10),
    borderWidth: hp(1),
    borderColor: COLORS.LightGrey,
    height: hp(47),
    marginHorizontal: wp(23),
    flexDirection: "row",
  },
  tabBarTitle: {
    fontSize: hp(18),
    textAlign: "center",
    marginTop: hp(10),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist_Semibold,
  },
  verificationTab: {
    flex: 0.5,
    borderTopLeftRadius: wp(10),
    borderBottomLeftRadius: wp(10),
  },
  historyTab: {
    flex: 0.5,
    borderTopRightRadius: wp(10),
    borderBottomRightRadius: wp(10),
  },
});

export default CustomAttendanceTabs;
