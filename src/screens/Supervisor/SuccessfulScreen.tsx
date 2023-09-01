import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  SafeAreaView,
} from "react-native";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { loginAPIcall } from "../../utils/LoginAPI";
import {
  employeestoreData,
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
  loginStoreData,
  storeUserDefaultFacility,
} from "../../store/User/UserDetails";
import LoaderView from "../../components/Loader";
import { hp, wp } from "../../utils/responsive-helper";
import { Config } from "../../utils/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const BaseURL = Config.BASE_URL;
const { width, height } = Dimensions.get("window");

const SuccessfulScreen = (props) => {
  const navigation = useNavigation();
  const scanTypeVal = props.route.params.scanType;
  const [isLoading, setisLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [getText, setext] = useState("");
  const BaseURL = Config.BASE_URL;
  const Name = props.route.params.name;
  const logo = props.route.params.logo;
  const facilityId = props.route.params.facilityId;
  const facilityName = props.route.params.facilityName;

  let tempFac = {
    facilityName,
    facilityId,
    facilityLogo: logo,
  };

  useEffect(() => {
    if (scanTypeVal == "facility") {
      setext(translation.Registration.Facility_Registration_Successful);
    } else {
      setext(translation.Registration.Supervisor_Successfully_Verified);
    }
  });

  const imageErr = () => {
    setImageError(true);
  };

  const onPressNav = async () => {
    await storeUserDefaultFacility(tempFac);
    navigation.navigate("Registration", {
      scanType: scanTypeVal,
      scancompete: true,
      stepIndicatorval: 2,
    });
  };

  return (
    <>
      <SafeAreaView style={styles.viewcontainer}>
        <View style={styles.viewcontainer}>
          <View
            style={[
              styles.imagebackgroundStyle,
              { backgroundColor: COLORS.Yellow },
            ]}
          >
            <Image
              style={styles.imageStyle}
              source={require("../../assets/images/tick.png")}
            />
          </View>
          <Text style={styles.textSytle}>{getText}</Text>

          {scanTypeVal === "facility" ? (
            <View style={styles.viewthirdStyle}>
              {(() => {
                if (imageError) {
                  return (
                    <View style={styles.noLogo}>
                      <Text style={styles.noLogoText}>
                        {translation.Attendance.no_logo}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <Image
                      style={styles.logoimageStyle}
                      source={{
                        uri: `${logo}`,
                      }}
                      onError={imageErr}
                    />
                  );
                }
              })()}
              <View style={styles.facilityName}>
                <Text style={styles.failityTextStyle}>{Name}</Text>
              </View>
            </View>
          ) : (
            <></>
          )}

          {scanTypeVal == "facility" ? (
            <View style={styles.newcontainer}>
              <TouchableOpacity
                style={{
                  //backgroundColor: 'red',
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={onPressNav}
              >
                <Text style={styles.text}>
                  {translation.Registration.Proceed}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.newcontainer}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => profileDetials(true)}
              >
                <Text style={styles.text}>
                  {translation.Registration.Proceed}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );

  function profileDetials(isScaaned) {
    // setisLoading(true);
    employeeretrieveData().then((tokenValr) => {
      let employeedIDVAl = tokenValr.employeeId;

      loginAPIcall
        .profileDetailGetAPI(employeedIDVAl)
        .then(async (tokenRes) => {
          if (tokenRes.status === 200) {
            let profiledata = {
              employeeId: tokenRes.data.result.employeeID,
              empNameId: tokenRes.data.result.empNameId,
              employeeName: tokenRes.data.result.employeeName,
              contactNumber: tokenRes.data.result.contactNumber,
              emailID: tokenRes.data.result.emailID,
              qrPassCode: tokenRes.data.result.qrPassCode,
              facility: facilityName,
              facilityId: facilityId,
              facilityLogo: logo,
              doj: tokenRes.data.result.doj,
              role: tokenRes.data.result.role,
              isSpuervisor: tokenRes.data.result.isSpuervisor,
              hasNotification: tokenRes.data.result.hasNotification,
              supervisorName: tokenRes.data.result.supervisorName,
              isSupervisorVerfied: tokenRes.data.result.isSupervisorVerfied,
              isAddressPending: tokenRes.data.result.isAddressPending,
              shiftStartTime: tokenRes.data.result.shiftStartTime,
              shiftEndTime: tokenRes.data.result.shiftEndTime,
              clockIn: tokenRes.data.result.clockIn,
              clockOut: tokenRes.data.result.clockOut,
              isArtTestPending: tokenRes.data.result.isArtTestPending,
              isAllowedEmployeeMobileForOthers:
                tokenRes.data.result.isAllowedEmployeeMobileForOthers,
              postalCode: tokenRes.data.result.postalCode,
              isAlowToWorkForOtherFailities:
                tokenRes.data.result.isAlowToWorkForOtherFailities,
            };

            await AsyncStorage.setItem(
              "supervisorLastupdateDate",
              moment().format("DD-MM-YYYY HH:MM:SS")
            );

            storeUserDefaultFacility(tempFac).then(() => {
              profileStoreData(profiledata).then((tokenRes) => {
                let registrationCompleted = {
                  IsregistrationCompleted: true,
                };
                setisLoading(false);
                loginStoreData(registrationCompleted).then(() => {
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
                });
              });
            });
          } else {
            setisLoading(false);
            alert(translation.Attendance.pls_try_again);
          }
        })
        .catch((err) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          } else {
            Alert.alert(err);
          }
        });
    });
  }
};

const styles = StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column",
  },
  imagebackgroundStyle: {
    height: wp(187),
    width: wp(187),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(93),
    borderRadius: wp(100),
  },
  imageStyle: {
    height: wp(40),
    width: wp(56),
    //marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:COLORS.Red
  },

  textSytle: {
    marginTop: hp(20),
    fontSize: wp(28),
    textAlign: "center",
    color: COLORS.Black,
    marginLeft: wp(20),
    marginRight: wp(20),
    fontFamily: FONTS.Urbanist_Bold,
  },

  viewthirdStyle: {
    marginTop: hp(20),
    paddingLeft: wp(10),
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderRadius: wp(5),
    borderColor: COLORS.LightGrey,
    borderBottomWidth: wp(1),
    height: hp(94),
    width: wp(327),
    flexDirection: "row",
  },
  logoimageStyle: {
    height: wp(60),
    width: wp(60),
    marginLeft: wp(10),
    backgroundColor: COLORS.White,
    alignSelf: "center",
    resizeMode: "contain",
  },

  facilityName: {
    justifyContent: "center",
    flexWrap: "wrap",
    marginRight: wp(10),
    width: wp(260),
  },

  failityTextStyle: {
    marginLeft: wp(16),
    flexWrap: "wrap",
    // width: '60%',
    //fontWeight: 'normal',
    fontSize: hp(18),
    textAlignVertical: "center",
    alignSelf: "center",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist,
  },

  newcontainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: hp(0),
    width: "90%",
    height: hp(54),
    marginBottom: hp(20),
    borderWidth: wp(1),
    borderRadius: wp(10),
    borderBottomWidth: wp(1),
    borderColor: COLORS.LightGrey,
    // shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.9,
    shadowRadius: 5,
    backgroundColor: COLORS.PurpleButton,
  },
  text: {
    color: COLORS.White,
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
  },
  noLogo: {
    width: wp(60),
    height: hp(60),
    marginTop: hp(17),
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
  },
  noLogoText: {
    color: COLORS.BlackDark,

    fontSize: hp(14),
    flexWrap: "wrap",
    fontFamily: FONTS.Urbanist,
  },
});

export default SuccessfulScreen;
