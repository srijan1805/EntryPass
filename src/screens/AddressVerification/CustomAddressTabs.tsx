import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { CommonActions, useNavigation } from "@react-navigation/native";
import NavigationHeader from "../../components/NavigationHeader";

function getTabIndex(state) {
  if (state && state.index) {
    return state.index;
  }
  return 0;
}

const CustomAddressTabs = (props) => {
  const navigation = useNavigation();
  function gotoMydrawer() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "MyDrawer",
              // params: { user: 'jane' },
            },
          ],
        })
      );
    }
  }

  return (
    <>
      <SafeAreaView style={{ backgroundColor: COLORS.White }}>
        <NavigationHeader
          title={translation.AddressHistory.AddressVerification}
          onPressCallBack={() => gotoMydrawer()}
        />
      </SafeAreaView>
      <View style={{ backgroundColor: COLORS.White }}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AddressVerificationHomeScreen");
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
              {translation.AddressHistory.Verification}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AddressHistoryList");
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
              {translation.AddressHistory.History}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    marginLeft: hp(24),
  },
  backButton: {
    width: wp(25),
    height: wp(25),
    tintColor: COLORS.DarkGrey,
  },
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
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

export default CustomAddressTabs;
