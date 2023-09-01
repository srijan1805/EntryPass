import React, { useEffect, useState } from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Platform,
} from "react-native";
import { COLORS } from "../../constants/color";
import {
  useNavigation,
  StackActions,
  CommonActions,
  useIsFocused,
} from "@react-navigation/native";
import { scannerAPIcall } from "../../utils/ScannerAPI";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
  loginStoreData,
  retriveUserDefaultFacility,
} from "../../store/User/UserDetails";
import { loginAPIcall } from "../../utils/LoginAPI";
import { wp, hp } from "../../utils/responsive-helper";
import { useDispatch, useSelector } from "react-redux";
import LoaderView from "../../components/Loader";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const ScanQRcodesupervisor = (props) => {
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const [scan, setScan] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [result, setResult] = useState();
  const dispatch = useDispatch();
  const scanTypeVal = props.route.params.scanType;
  const [titleval, settitleVal] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [IsSupervisor, setIsSupervisor] = useState(false);

  const qrReference = React.useRef(null);

  useEffect(() => {
    if (isFocused) {
      setScannerVisible(true);
    } else {
      setScannerVisible(false);
    }
  }, [isFocused]);

  const onSuccess = (e) => {
    try {
      const check = e.data.substring(0, 4);
      let val = e.data.trim().replace("http://", "");
      if (scanTypeVal == "facility") {
        if (val.length === 36) {
          facilityAPICall(val);
        } else {
          navigation.navigate("UnsuccesfulScreen", {
            facilitycomplete: false,
            scanType: "facility",
            message: translation.AlertMessage.invalid_fac_code, //TODO add translation
          });
          setScan(true);
        }
      } else {
        supervisiorScanAPICall(val);
      }
    } catch (error) {
      setScan(true);
      setisLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.back}>
              <Image
                style={styles.backButton}
                source={require("../../assets/icons/Close.png")}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => profileDetials()}
            style={styles.newcontainer}
          >
            <View>
              <Text style={styles.text}>
                {translation.EmployeeVerification.Proceed_and_verify_later}
              </Text>
            </View>
          </TouchableOpacity> */}
          {scanTypeVal === "facility" ? (
            <Text style={styles.headerTitle}>
              {translation.EmployeeVerification.ScanFacilityQR}
            </Text>
          ) : (
            <Text
              style={[styles.headerTitle, { width: wp(300) }]}
              numberOfLines={2}
            >
              {translation.EmployeeVerification.SupervisorVerification}
            </Text>
          )}
        </View>

        <View style={styles.sectionContainer}>
          {isScannerVisible && (
            <QRCodeScanner
              reactivate={false}
              showMarker={false}
              ref={qrReference}
              onRead={onSuccess}
              cameraType={"back"}
              cameraStyle={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
              }}
            />
          )}
        </View>
        {scanTypeVal == "facility" ? (
          <>
            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>
                {translation.EmployeeVerification.ScanFacility}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => profileDetials()}
              style={styles.newcontainer}
            >
              <View>
                <Text style={styles.text}>
                  {translation.EmployeeVerification.Proceed_and_verify_later}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );

  function facilityAPICall(tokenVal) {
    setisLoading(true);
    employeeretrieveData().then((employData) => {
      let employeedIDVAl = employData.employeeId;
      scannerAPIcall
        .facilityqRCodeApiGET(employeedIDVAl, tokenVal)
        .then((tokenRes) => {
          if (
            tokenRes.status === 200 &&
            tokenRes.data.result.isFacilityVerified === true
          ) {
            let registrationCompleted = {
              IsregistrationCompleted: false,
            };
            loginStoreData(registrationCompleted).then(() => {
              setisLoading(false);
              navigation.navigate("SuccessfulScreen", {
                facilitycomplete: true,
                scanType: "facility",
                name: tokenRes.data.result.facilityName,
                logo: tokenRes.data.result.facilityLogo,
                facilityId: tokenRes.data.result.facilityId,
                facilityName: tokenRes.data.result.facilityName,
              });
            });
          } else {
            setisLoading(false);

            setScan(false);

            navigation.navigate("UnsuccesfulScreen", {
              facilitycomplete: false,
              scanType: "facility",
              message: translation.Registration.No_facility_match_found,
            });
            // alert('Wrong OTP!. Pls enter the correct OTP');
          }
        })
        .catch((err) => {
          let error = err.response.data.result.errors;
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);

            setScan(true);
          } else if (err.toString().includes("404")) {
            navigation.navigate("UnsuccesfulScreen", {
              facilitycomplete: false,
              scanType: "facility",
              message: translation.AlertMessage.invalid_fac_code,
            });
            setScan(true);
          } else {
            navigation.navigate("UnsuccesfulScreen", {
              facilitycomplete: false,
              scanType: "facility",
              message: error,
            });
            setScan(true);
          }
        });
    });
  }

  function profileDetials() {
    setisLoading(true);
    employeeretrieveData().then((tokenValr) => {
      let employeedIDVAl = tokenValr.employeeId;

      scannerAPIcall
        .supervisiorNotscanqRCodeApiPUT(employeedIDVAl)
        .then((responseval) => {
          if (responseval.status === 200) {
            loginAPIcall
              .profileDetailGetAPI(employeedIDVAl)
              .then((tokenRes) => {
                retriveUserDefaultFacility().then(async (facResp) => {
                  if (tokenRes.status === 200) {
                    let profiledata = {
                      employeeId: tokenRes.data.result.employeeID,
                      empNameId: tokenRes.data.result.empNameId,
                      employeeName: tokenRes.data.result.employeeName,
                      contactNumber: tokenRes.data.result.contactNumber,
                      emailID: tokenRes.data.result.emailID,
                      qrPassCode: tokenRes.data.result.qrPassCode,
                      facility: tokenRes.data.result.facility,
                      facilityId: facResp?.facilityId,
                      facilityLogo: facResp?.facilityLogo,
                      doj: tokenRes.data.result.doj,
                      role: tokenRes.data.result.role,
                      isSpuervisor: tokenRes.data.result.isSpuervisor,
                      hasNotification: tokenRes.data.result.hasNotification,
                      supervisorName: tokenRes.data.result.supervisorName,
                      isSupervisorVerfied:
                        tokenRes.data.result.isSupervisorVerfied,
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

                    profileStoreData(profiledata).then((tokenResdd) => {
                      let registrationCompleted = {
                        IsregistrationCompleted: true,
                      };
                      loginStoreData(registrationCompleted).then(() => {
                        registergetTokenFromFCM(
                          tokenRes.data.result.employeeID
                        );
                      });
                    });
                  } else {
                    setisLoading(false);
                  }
                });
              })
              .catch((err) => {
                setisLoading(false);
                if (
                  err !== "undefined" &&
                  err.toString().includes("Network Error")
                ) {
                  alert(translation.AddressVerification.oops_network_err_msg);
                } else {
                  Alert.alert(err);
                }
              });
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

  async function registergetTokenFromFCM(empIds) {
    try {
      // Ignore all that permission request stuff. You need to do it but it is UNRELATED to tokens.
      // Handle your permissions separately. Ideally with react-native-permissions

      // From the example https://rnfirebase.io/messaging/server-integration#saving-tokens
      const token = await messaging().getToken();

      // Alert.alert(token);
      if (token) {
        await callRefreshToken(token, empIds);
        // await AsyncStorage.setItem(Constants.FCM_TOKEN, token);
      } else {
        alert("Please try again.Token not found");
      }

      // Listen to whether the token changes
      // let tokenRefreshListenerUnsubscriber = messaging().onTokenRefresh(
      //   (token) => {
      //     console.log(
      //       'we have a refreshed token and should do something with it: ' +
      //         token,
      //     );
      //     console.log('---bodyVal----token 11');
      //     callRefreshToken(token, empIds);
      //   },
      // );
    } catch (e) {
      let error = `token registration failed? ${e}`;
      Alert.alert(error);
    }
  }

  function callRefreshToken(token, empIds) {
    const bodyVal = {
      employeeId: empIds,
      fcmToken: token,
      deviceType: Platform.OS === "ios" ? 2 : 1,
      //otp: tokenVal,
    };

    console.log("---bodyVal----", bodyVal);
    // 1 as Android
    //2 as ios
    loginAPIcall
      .deviceRegistrationPost(bodyVal)
      .then(async (tokenRes) => {
        if (tokenRes.status === 200) {
          //alert('Resend OTP successful');
          setisLoading(false);
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
        } else {
          setisLoading(false);
          Alert.alert(tokenRes.errors);
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("403")) {
          Alert.alert(err);
        } else if (err.toString().includes("404")) {
          Alert.alert(err);
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else {
          alert(translation.Attendance.pls_try_again);
        }
      });
  }

  function supervisiorScanAPICall(tokenVal) {
    setisLoading(true);
    employeeretrieveData().then((tokenvalue) => {
      let QRId = tokenVal.toString().toUpperCase();

      scannerAPIcall
        .supervisiorqRCodeApiGET(tokenvalue.employeeId, QRId)
        .then((tokenRes) => {
          if (tokenRes.status === 200 && tokenRes.data.result === true) {
            setisLoading(false);
            retriveUserDefaultFacility().then((facResp) => {
              navigation.navigate("SuccessfulScreen", {
                facilitycomplete: true,
                scanType: "Supervisor",
                facilityName: facResp?.facilityName,
                facilityId: facResp?.facilityId,
                logo: facResp?.facilityLogo,
              });
            });
          } else {
            setScan(false);
            setisLoading(false);
            navigation.navigate("UnsuccesfulScreen", {
              facilitycomplete: false,
              scanType: "Supervisor",
              message: translation.Registration.No_Supervisor_match_found,
            });
          }
        })
        .catch((err) => {
          let error = err.response.data.result.errors;
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);

            setScan(false);
          } else {
            navigation.navigate("UnsuccesfulScreen", {
              facilitycomplete: false,
              scanType: "Supervisor",
              message: error,
            });
            setScan(true);
          }
        });
    });
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: hp(0),
    height: "100%",
  },
  headersectionContainer: {
    // marginTop: hp(8),
    height: hp(50),
    backgroundColor: COLORS.White,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  textStyle: {
    textAlign: "center",
    fontSize: hp(24),
    paddingLeft: hp(0),
    alignContent: "center",
    marginTop: hp(4),
    alignSelf: "center",
    justifyContent: "center",
    top: hp(5),
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  newcontainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    width: wp(326),
    height: hp(54),
    marginLeft: wp(24),
    marginBottom: hp(42),
    borderWidth: 1,
    borderColor: COLORS.PurpleButton,
    borderRadius: hp(10),
    shadowOffset: { width: wp(0), height: hp(1) },
    shadowRadius: hp(5),
    backgroundColor: COLORS.White,
    alignSelf: "center",
  },
  headernewcontainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    top: hp(40),
    width: "100%",
    height: hp(50),
    marginTop: hp(20),
    borderWidth: wp(1),
    borderRadius: hp(2),
    borderBottomWidth: hp(1),
    // shadowColor: '#000000',
    shadowOffset: { width: wp(0), height: hp(1) },
    // shadowOpacity: 0.9,
    shadowRadius: hp(5),
    backgroundColor: "transparent",
  },
  text: {
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Bold,
    fontSize: hp(18),
  },
  backButtonView: {
    marginLeft: hp(24),
    width: wp(40),
    height: hp(40),
    tintColor: COLORS.Black,
    backgroundColor: COLORS.LightGrey,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(20),
    marginTop: hp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: hp(24),
    marginTop: hp(18),
    marginBottom: hp(18),
    alignItems: "center",
    // height: hp(40),
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
    width: wp(24),
    height: hp(24),
    tintColor: COLORS.Black,
  },
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
  bottomContainer: {
    width: wp(375),
    height: hp(100),
    backgroundColor: COLORS.White,
    position: "absolute",
    bottom: wp(0),
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
    fontSize: hp(18),
  },
});

export default ScanQRcodesupervisor;
