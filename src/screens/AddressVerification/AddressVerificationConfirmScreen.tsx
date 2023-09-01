import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import AddressVerification from "../../components/AddressVerification";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { Buttons } from "../../components/Buttons";
import GirlLocation from "../../assets/images/girlLocation.svg";
import { hp, wp } from "../../utils/responsive-helper";
const { width, height } = Dimensions.get("window");
import LoaderView from "../../components/Loader";
import { postVerifiedAddressAPI } from "../../utils/AddressNetworksAPI";
import NavigationHeader from "../../components/NavigationHeader";

function AddressVerificationConfirmScreen({ route }) {
  const navigation = useNavigation();
  const { addressData, employeeIds } = route.params;
  const [isLoading, setisLoading] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => navigation.goBack()}
      />
      <View style={styles.girlViewStyle}>
        <GirlLocation width={134} height={131} />
        <Text style={styles.textStyle}>
          {translation.AddressVerification.ConfirmLocation}
        </Text>
        <Text
          style={[styles.locationtextStyle, { fontFamily: FONTS.Urbanist }]}
        >
          {translation.AddressVerification.pls_confirm_info_acc}
        </Text>
      </View>
      <View style={styles.girlViewStyle}>
        <Image
          style={styles.icons}
          source={require("../../assets/icons/Location.png")}
        />
        <Text style={styles.locationtextStyle}>
          {addressData.blockNoStreetName +
            " , " +
            addressData.floorNoUnitNo +
            " , " +
            addressData.postalCode}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          bottom: hp(8),
          marginLeft: hp(20),
          marginRight: hp(20),
          position: "absolute", //Here is the trick
          alignContent: "flex-end",
        }}
      >
        <Buttons
          text={translation.AddressVerification.Back}
          onPress={() => {
            navigation.goBack();
          }}
          BTNstyle={styles.buttonStyle}
          textStyle={styles.newtextStyle}
          ImgStyle={undefined}
          loader={undefined}
        />

        <Buttons
          text={translation.AddressVerification.Confirm}
          onPress={() => {
            addressverifyAPICall(
              addressData,
              employeeIds,
              addressData.latitude,
              addressData.longitude
            );
          }}
          BTNstyle={styles.newbuttonStyle}
          textStyle={styles.newbuttontextStyle}
          ImgStyle={undefined}
          loader={undefined}
        />
      </View>
    </SafeAreaView>
  );

  function addressverifyAPICall(addresArray, employeeIdval, lat, long) {
    setisLoading(true);
    postVerifiedAddressAPI(addresArray, employeeIdval, lat, long)
      .then((tokenRes) => {
        if (tokenRes.status === 200 && tokenRes.data.success === true) {
          setisLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "AddressVerificationSucessScreen",
                  params: {
                    adressresponse: true,
                    useraddress:
                      addressData.blockNoStreetName +
                      " , " +
                      addressData.floorNoUnitNo +
                      " , " +
                      addressData.postalCode,
                    addressId:
                      tokenRes.data.addressID || tokenRes.data.addressID,
                    emplId: tokenRes.data.staffVerification
                      ? tokenRes.data.staffEmployeeID
                      : tokenRes.data.employeeID,
                  },
                },
              ],
            })
          );
        } else {
          setisLoading(false);
          navigation.navigate("AddressVerificationSucessScreen", {
            adressresponse: false,
            useraddress: "",
          });
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("Network Error")) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else {
          navigation.navigate("AddressVerificationSucessScreen", {
            adressresponse: false,
            useraddress: "",
          });
        }
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  locationContainer: {
    flex: 1,
    // padding: 5,
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
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
  girlViewStyle: {
    top: hp(10),
    alignItems: "center",
    justifyContent: "center",
  },
  icons: {
    top: hp(20),
    alignSelf: "center",
    height: wp(22),
    width: wp(22),
    resizeMode: "contain",
    tintColor: COLORS.Blue,
  },
  textStyle: {
    marginTop: hp(20),
    fontSize: hp(22),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },
  locationtextStyle: {
    marginTop: hp(28),
    marginLeft: hp(43),
    marginRight: hp(43),
    fontSize: hp(18),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
    textAlign: "center",
    // fontWeight: 'Regular',
  },
  buttonStyle: {
    backgroundColor: COLORS.White,
    margin: wp(5),
    //padding: 12,
    borderRadius: wp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.Blue,
    borderWidth: wp(1),
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: 'center',
  },
  newbuttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    margin: wp(5),
    //padding: 12,
    borderRadius: wp(10),
    // margin: 10,
    // marginTop: -2,
    width: wp(157),
    height: hp(54),
    borderColor: COLORS.LightGrey,
    borderWidth: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: 'center',
  },
  newtextStyle: {
    color: COLORS.GrayDark,
    alignSelf: "center",
    fontSize: hp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
  },
  newbuttontextStyle: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Bold,
    textAlign: "center",
  },
});

export default AddressVerificationConfirmScreen;
