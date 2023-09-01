import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import translation from "../../assets/translations/translate";
import NavigationHeader from "../../components/NavigationHeader";
import { useNavigation } from "@react-navigation/native";
import LoaderView from "../../components/Loader";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import { loginAPIcall } from "../../utils";

const ArtTestForOthers = (props: any) => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState<string>("");

  const artTestForOthers = () => {
    if (userId.trim().length !== 0) {
      loginAPIcall
        .ArtTestIdApiGet(userId.toUpperCase(), 2)
        .then((tokenRes) => {
          if (tokenRes.status === 200) {
            if (tokenRes.data.result.success) {
              navigation.navigate("ArtTestDetails", {
                employeeID: tokenRes.data.result.employeeID,
              });
            } else {
              Alert.alert(
                "Alert!",
                translation.ArtTest.pls_enter_correct_id,
                [{ text: "OK", onPress: () => {} }],
                { cancelable: false }
              );
              console.log("Invalid ID Try Again");
            }
          }
        })
        .catch((err) => {
          Alert.alert(
            "Alert!",
            translation.ArtTest.pls_enter_correct_id,
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        });
    } else {
      Alert.alert(translation.ArtTest.pls_enter_correct_id);
    }
  };

  const ScanQr = () => {
    navigation.navigate("ArtTestQrScan", { scanType: "arttest" });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <LoaderView loading={isLoading} /> */}
        <NavigationHeader
          title="ART Test for others"
          onPressCallBack={() => navigation.goBack()}
        />
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="contain"
          source={require("../../assets/images/Login1.png")}
        />
        <View style={styles.welcomeText}>
          <Text style={styles.signin}>
            {translation.EmployeeVerification.ScanQR}
          </Text>
        </View>

        <View style={styles.textField}>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={COLORS.placeHolderColor}
            returnKeyType="next"
            onEndEditing={() => {
              setUserId(userId.trim().replace(/\s+/g, " "));
            }}
            editable={true}
            secureTextEntry={false}
            value={userId}
            placeholder={translation.EmployeeVerification.EmployeeID}
            onChangeText={(userId: any) => {
              setUserId(userId);
            }}
            style={styles.inputField}
          />
          <TouchableOpacity onPress={ScanQr}>
            <Image
              style={styles.Image}
              source={require("../../assets/icons/Scan.png")}
            />
          </TouchableOpacity>
        </View>

        <Buttons
          onPress={artTestForOthers}
          text={translation.EmployeeVerification.Continue}
          BTNstyle={{ ...styles.buttonStyle }}
          textStyle={{ ...styles.buttonTxt }}
          ImgStyle={undefined}
          loader={undefined}
        />
      </SafeAreaView>
    </>
  );
};

export default ArtTestForOthers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  welcomeText: {
    alignItems: "center",
  },
  imageBackground: {
    alignSelf: "center",
    width: wp(192),
    height: hp(151),
    marginTop: hp(50),
  },
  Image: {
    width: wp(30),
    height: hp(30),
    alignSelf: "center",
    marginLeft: wp(16),
  },
  signin: {
    fontSize: hp(18),
    fontWeight: "normal",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
    fontStyle: "normal",
    marginTop: hp(12),
  },
  textField: {
    flexDirection: "row",
    marginTop: hp(49),
    alignItems: "center",
  },
  inputField: {
    backgroundColor: COLORS.White,
    marginHorizontal: wp(5),
    borderColor: COLORS.placeHolderColor,
    borderWidth: 1,
    width: wp(277),
    height: hp(55),
    fontFamily: FONTS.Urbanist,
    fontSize: hp(18),
    borderRadius: wp(10),
    marginLeft: wp(24),
    color: COLORS.Black,
    paddingLeft: wp(5),
  },
  buttonStyle: {
    width: wp(324),
    height: hp(55),
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: COLORS.Blue,
    marginTop: hp(20),
    borderRadius: wp(10),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
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
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
});
