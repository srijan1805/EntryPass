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

const VaccinationVerificationForOthers = (props: any) => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState<string>("");

  const vaccinationForOthers = () => {
    if (userId.trim().length !== 0) {
      loginAPIcall
        .ArtTestIdApiGet(userId.toUpperCase(), 3)
        .then((tokenRes) => {
          if (tokenRes.status === 200) {
            if (tokenRes.data.result.success) {
              navigation.navigate("VaccinationDetails", {
                StaffID: userId,
                Type: "self",
              });
            } else {
              console.log("Invalid ID Try Again");
            }
          }
        })
        .catch((err) => {
          if (
            err !== "undefined" &&
            err.response.data.result.statusCode.toString().includes("403") &&
            err.response.data.result.errors
              .toString()
              .includes("Staff is Inactive")
          ) {
            Alert.alert(err.response.data.result.errors.toString());
          } else if (
            err !== "undefined" &&
            err.toString().includes("Network Error")
          ) {
            alert(translation.AddressVerification.oops_network_err_msg);
          } else {
            Alert.alert(translation.ArtTest.pls_enter_correct_id);
          }
        });
    } else {
      Alert.alert(translation.ArtTest.pls_enter_correct_id);
    }
  };

  const ScanQr = () => {
    navigation.navigate("ArtTestQrScan", { scanTypeVal: "vaccination" });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title="Vaccination for others"
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
          onPress={vaccinationForOthers}
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

export default VaccinationVerificationForOthers;

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
