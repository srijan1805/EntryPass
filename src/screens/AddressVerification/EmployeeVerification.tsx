import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import {
  StackActions,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { postVerifiedAddressAPI } from "../../utils/AddressNetworksAPI";
import {
  profileRetrieveData,
  addressVerficationFacilityStoreData,
  addressVerficationFacilityRetrieveData,
} from "../../store/User/UserDetails";
import { loginAPIcall } from "../../utils/LoginAPI";
import LoaderView from "../../components/Loader";
import { hp, wp } from "../../utils/responsive-helper";
import NavigationHeader from "../../components/NavigationHeader";

function EmployeeVerification(props) {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const ScanQr = () => {
    navigation.navigate("QrScanner", { screentype: "employeeScreen" });
  };
  const isSpuervisor = props.route.params.Supervisor;

  function DrawerView() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: "AddressTabs",
          },
        ],
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />

      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => DrawerView()}
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
        <TouchableOpacity onPress={() => ScanQr()}>
          <Image
            style={styles.Image}
            source={require("../../assets/icons/Scan.png")}
          />
        </TouchableOpacity>
      </View>

      <Buttons
        onPress={() => {
          addressverifyAPICall();
        }}
        text={translation.EmployeeVerification.Continue}
        BTNstyle={{ ...styles.buttonStyle }}
        textStyle={{ ...styles.buttonTxt }}
        ImgStyle={undefined}
        loader={undefined}
      />
    </SafeAreaView>
  );

  function addressverifyAPICall() {
    if (userId === null) {
      Alert.alert(translation.EmployeeVerification.Please_enter_ID);
    } else if (userId !== null && userId.trim().length === 0) {
      Alert.alert(translation.EmployeeVerification.Please_enter_ID);
    } else {
      setisLoading(true);
      loginAPIcall
        .VerifyEmpPost(userId.toUpperCase())
        .then((tokenRes) => {
          if (tokenRes.status === 200) {
            let emplyeedataV = {
              isFacilityVerfied: true,
              facilityId: tokenRes.data.result.employeeID,
            };

            addressVerficationFacilityStoreData(emplyeedataV).then(() => {
              addressVerficationFacilityRetrieveData().then((valG) => {});

              setisLoading(false);
              AsyncStorage.removeItem("ResidenceImage");
              AsyncStorage.removeItem("ImageType");
              navigation.navigate("AddressVerification", {
                empID: tokenRes.data.result.employeeID,
              });
            });
          } else {
            setisLoading(false);
          }
        })
        .catch((err) => {
          setisLoading(false);

          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.EmployeeVerification.oops_network_err_msg);
          } else {
            Alert.alert(
              translation.AlertMessage.Alert,
              translation.AlertMessage.enter_valid_id, //TODO Add translation
              [{ text: translation.Buttons_lable.Ok, onPress: () => {} }],
              { cancelable: false }
            );
          }
        });
    }
  }
}

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

export default EmployeeVerification;
