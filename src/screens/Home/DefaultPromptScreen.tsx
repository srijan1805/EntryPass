import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Linking,
} from "react-native";
import React from "react";
import { COLORS } from "../../constants/color";
import NavigationHeader from "../../components/NavigationHeader";
import { useNavigation } from "@react-navigation/native";
import { hp } from "../../utils/responsive-helper";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";

const DefaultPromptScreen = () => {
  const navigation = useNavigation();

  const onEmailPress = () => {
    Linking.openURL("mailto:techsupport@uemsgroup.com");
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.mainContainer}>
          <NavigationHeader
            isTitleLogo
            onPressCallBack={() => navigation.goBack()}
          />
          <View style={styles.subContainer}>
            <ImageBackground
              source={require("../../assets/images/non-user.png")}
              style={styles.bg_image}
              resizeMode="contain"
            >
              <View style={{ paddingTop: hp(90) }}>
                <Text style={[styles.noUserContentText]}>
                  {translation.InactiveUser.inactive_account}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.InactiveUser.desc1}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.InactiveUser.desc2}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.InactiveUser.desc3}
                  <Text onPress={onEmailPress} style={styles.emailText}>
                    {translation.InactiveUser.desc4}
                  </Text>
                  {translation.InactiveUser.desc5}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default DefaultPromptScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  subContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noUserContentText: {
    marginHorizontal: 20,
    marginTop: hp(0),
    fontSize: hp(15),
    lineHeight: hp(22),
    color: COLORS.Black,
    textAlign: "center",
    paddingBottom: 10,
    textDecorationLine: "underline",
    textDecorationColor: COLORS.Black,
    textDecorationStyle: "double",
    fontFamily: FONTS.Urbanist_Bold,
  },

  bg_image: {
    height: hp(400),
    width: hp(400),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailText: {
    color: COLORS.Blue,
    textDecorationLine: "underline",
    textDecorationStyle: "double",
  },
});
