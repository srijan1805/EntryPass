import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  StatusBar,
  Platform,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Linking,
} from "react-native";
import translation from "../../assets/translations/translate";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { wp, hp } from "../../utils/responsive-helper";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MainNavigationHeader } from "../../components/NavigationHeader";

const ProfileDisabled = () => {
  const navigation = useNavigation();

  const onEmailPress = () => {
    Linking.openURL("mailto:techsupport@uemsgroup.com");
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <MainNavigationHeader navigation={navigation} isDisabled={true} />
        <View style={styles.mainContainer}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ImageBackground
              source={require("../../assets/images/non-user.png")}
              style={{
                height: hp(400),
                width: hp(400),
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              resizeMode="contain"
            >
              <View style={{ paddingTop: hp(90) }}>
                <Text
                  style={[
                    styles.noUserContentText,
                    {
                      textDecorationLine: "underline",
                      textDecorationColor: COLORS.Black,
                      textDecorationStyle: "double",
                      fontFamily: FONTS.Urbanist_Bold,
                    },
                  ]}
                >
                  {translation.Profile.inactive_acc}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.Profile.inactive_desc1}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.Profile.inactive_desc2}
                </Text>
                <Text style={styles.noUserContentText}>
                  {translation.Profile.please}
                  <Text
                    onPress={onEmailPress}
                    style={{
                      color: COLORS.Blue,
                      textDecorationLine: "underline",
                      textDecorationStyle: "double",
                    }}
                  >
                    {translation.Profile.inactive_desc3}
                  </Text>
                  {translation.Profile.inactive_desc4}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  noUserContentText: {
    marginHorizontal: 20,
    marginTop: hp(0),
    fontSize: hp(15),
    // fontWeight: "400",
    lineHeight: hp(22),
    fontFamily: FONTS.Urbanist_Medium,
    color: COLORS.Black,
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default ProfileDisabled;
