import React from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  BackHandler,
} from "react-native";
import translation from "../../assets/translations/translate";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddressVerificationHomeScreen from "./AddressVerificationHomeScreen";
import AddressHistoryList from "../Address/AddressHistory/AddressHistoryList";
import { hp, wp } from "../../utils/responsive-helper";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { useEffect } from "react";
import NavigationHeader from "../../components/NavigationHeader";

export function AddressTabs() {
  const AddressTab = createMaterialTopTabNavigator();
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
      <AddressTab.Navigator
        screenOptions={{
          tabBarIndicatorContainerStyle: { backgroundColor: COLORS.White },
          tabBarIndicatorStyle: { backgroundColor: COLORS.White },
          tabBarIconStyle: {
            backgroundColor: COLORS.White,
            width: wp(186),
            height: hp(47),
            marginTop: hp(5),
          },
          swipeEnabled: false,
          lazy: true,
        }}
        style={styles.tabContainer}
      >
        <AddressTab.Screen
          name="AddressVerificationHomeScreen"
          component={AddressVerificationHomeScreen}
          options={{
            tabBarShowLabel: false,
            swipeEnabled: false,
            lazy: true,
            title: translation.AddressHistory.Verification,
            tabBarIcon: ({ focused, color }) => {
              return (
                <View
                  style={[
                    styles.tabBar,
                    {
                      backgroundColor: focused ? COLORS.Blue : COLORS.White,
                      marginLeft: wp(23),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBarTitle,
                      { color: focused ? COLORS.White : COLORS.Black },
                    ]}
                  >
                    {translation.AddressHistory.Verification}
                  </Text>
                </View>
              );
            },
          }}
        />

        <AddressTab.Screen
          name="AddressHistoryList"
          component={AddressHistoryList}
          options={{
            tabBarShowLabel: false,
            swipeEnabled: false,
            lazy: true,
            title: translation.AddressHistory.History,
            tabBarIcon: ({ focused, color }) => {
              return (
                <View
                  style={[
                    styles.tabBar,
                    {
                      backgroundColor: focused ? COLORS.Blue : COLORS.White,
                      marginRight: wp(23),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBarTitle,
                      { color: focused ? COLORS.White : COLORS.Black },
                    ]}
                  >
                    {translation.AddressHistory.History}
                  </Text>
                </View>
              );
            },
          }}
        />
      </AddressTab.Navigator>
    </>
  );
}

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
    fontFamily: FONTS.Urbanist_Bold,
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
    width: wp(165),
    borderRadius: wp(10),
    borderWidth: hp(1),
    borderColor: COLORS.LightGrey,
    height: hp(47),
    marginTop: hp(-14),
    textAlign: "center",
  },
  tabBarTitle: {
    fontSize: hp(18),
    textAlign: "center",
    marginTop: hp(10),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist_Semibold,
  },
});
