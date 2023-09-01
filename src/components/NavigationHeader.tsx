import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { hp, wp } from "../utils/responsive-helper";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface IProps {
  title: string;
  navigation?: any;
  isTitleLogo?: boolean;
  onPressCallBack: () => void;
}

const NavigationHeader = ({
  title = "",
  navigation,
  isTitleLogo,
  onPressCallBack = () => {},
}: IProps) => {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPressCallBack}>
          <View style={styles.back}>
            <Image
              style={styles.backButton}
              source={require("../assets/icons/BackArrow.png")}
            />
          </View>
        </TouchableOpacity>
        {isTitleLogo ? (
          <Image
            source={require("../assets/images/EP-Logo1.png")}
            style={{
              height: hp(140),
              width: hp(140),
              resizeMode: "contain",
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>
    </>
  );
};

export const MainNavigationHeader = ({ navigation, isDisabled = false }) => {
  const headerHeight = useHeaderHeight();
  const isNotifPending = useSelector(
    (state: RootState) => state.notificationState.isPendingNotif
  );

  const btnActiveArea = {
    top: hp(15),
    bottom: hp(15),
    left: wp(22),
    right: wp(22),
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // height: hp(30),
          marginHorizontal: hp(24),
          paddingVertical: Platform.OS === "android" ? hp(15) : 0,
          // backgroundColor: COLORS.PurpleButton,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.openDrawer, {}]}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            hitSlop={btnActiveArea}
          >
            <Image
              style={styles.logoImg}
              source={require("../assets/icons/menu.png")}
            />
          </TouchableOpacity>
          <View
            style={
              {
                // marginTop: hp(7)
              }
            }
          >
            <Image
              style={styles.logo}
              source={require("../assets/images/EP-Logo1.png")}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={() => {
            if (isDisabled) navigation.navigate("DefaultPromptScreen");
            else navigation.navigate("NotificationsScreen");
          }}
          hitSlop={btnActiveArea}
        >
          {!isDisabled && (
            <View style={isNotifPending ? styles.hasNotification : {}} />
          )}
          <Image
            style={styles.notifications}
            source={require("../assets/icons/Notification.png")}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NavigationHeader;

const styles = StyleSheet.create({
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
  openDrawer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImg: {
    height: hp(20),
    width: wp(27),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
  },
  notifications: {
    height: hp(33),
    width: wp(30),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
  },
  logo: {
    height: hp(29),
    width: wp(155),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
    marginLeft: wp(15),
  },
  button: {
    justifyContent: "center",
    marginLeft: wp(10),
    alignItems: "center",
  },
  hasNotification: {
    width: wp(10),
    height: hp(10),
    borderRadius: wp(10),
    backgroundColor: COLORS.Red,
    top: hp(2),
    left: wp(15),
    position: "absolute",
    zIndex: 2,
  },
});
