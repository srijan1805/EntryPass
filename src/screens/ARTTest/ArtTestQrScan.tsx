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
} from "react-native";
import { COLORS } from "../../constants/color";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { scannerAPIcall } from "../../utils/ScannerAPI";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
} from "../../store/User/UserDetails";
import { loginAPIcall } from "../../utils/LoginAPI";
import { wp, hp } from "../../utils/responsive-helper";
import LoaderView from "../../components/Loader";
import { FONTS } from "../../constants/font";
import { VerifyQR } from "../../utils/AttendenceQrAPI";
import translation from "../../assets/translations/translate";
import { vaccinationAPIcall } from "../../utils/VaccinationAPI";

const ArtTestQrScan = (props) => {
  const navigation = useNavigation();
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState();
  const scanTypeVal = props.route.params.scanType;
  const [isLoading, setisLoading] = useState(false);
  const [isSupervisor, setSupervisor] = useState(false);
  const [getId, setId] = useState(0);
  const [camType, setCam] = useState("back");
  const [camText, setCamText] = useState(
    translation.LoginQrScan.Scan_your_employee_staff_card
  );
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  const qrReference = React.useRef(null);

  useEffect(() => {
    profileRetrieveData().then((tokenval) => {
      setSupervisor(tokenval.isSpuervisor);
      setId(tokenval.employeeId);
      setisAllowedEmployeeMobileForOthers(
        tokenval.isAllowedEmployeeMobileForOthers
      );
    });

    setScan(true);
    navigation.addListener("focus", () => {
      setScan(true);
    });
    navigation.addListener("blur", () => {
      setScan(false);
    });

    return () => {
      navigation.removeListener("focus", () => {
        setScan(true);
      });
      navigation.removeListener("blur", () => {
        setScan(false);
      });
    };
  }, []);

  const flipCamera = () => {
    if (camType === "back") {
      setCam("front");
      setCamText(translation.LoginQrScan.Scan_your_employee_staff_card);
    } else {
      setCam("back");
      setCamText(translation.LoginQrScan.Scan_your_employee_staff_card);
    }
  };

  const onSuccess = (e) => {
    let val = e.data.trim().replace("http://", "");
    setScan(false);

    if (scanTypeVal == "arttest") {
      artTestQRAPICall(val.toUpperCase(), 2, getId);
    } else {
      VaccinationQRAPICall(val.toUpperCase(), 3, getId);
    }
  };

  function artTestQRAPICall(tokenVal, scanType, empId) {
    profileRetrieveData()
      .then((data) => {
        setSupervisor(data.isSpuervisor);
        setisAllowedEmployeeMobileForOthers(
          data.isAllowedEmployeeMobileForOthers
        );
        let emplID = data.empNameId.toString().toUpperCase();

        if (emplID === tokenVal) {
          ARTTestQRScan(tokenVal, scanType, empId);
        } else if (isSupervisor && isAllowedEmployeeMobileForOthers) {
          ARTTestQRScan(tokenVal, scanType, empId);
        } else {
          setisLoading(false);
          Alert.alert(
            translation.Registration.alert,
            translation.Registration.invalid_qr_try_again,
            [
              {
                text: translation.Attendance.ok,
                onPress: () => setScan(true),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function VaccinationQRAPICall(tokenVal, scanType, empId) {
    profileRetrieveData()
      .then((data) => {
        setSupervisor(data.isSpuervisor);
        setisAllowedEmployeeMobileForOthers(
          data.isAllowedEmployeeMobileForOthers
        );
        let emplID = data.empNameId;

        if (emplID === tokenVal) {
          VaccinationQRScan(tokenVal, scanType, empId, "self");
        } else if (isSupervisor && isAllowedEmployeeMobileForOthers) {
          VaccinationQRScan(tokenVal, scanType, empId, "other");
        } else {
          setisLoading(false);
          Alert.alert(
            translation.Registration.alert,
            translation.Registration.invalid_qr_try_again,
            [
              {
                text: translation.Attendance.ok,
                onPress: () => setScan(true),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function VaccinationQRScan(tokenVal, scanType, empId, Type) {
    setisLoading(true);
    scannerAPIcall
      .artTestqRCodeApiGET(tokenVal, scanType, empId)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          setisLoading(false);
          if (tokenRes.data.result.success) {
            navigation.navigate("VaccinationDetails", {
              StaffID: tokenVal,
              Type: Type,
            });
          } else {
            setisLoading(false);
          }
        } else {
          setisLoading(false);
          Alert.alert("Please wait");
          setScan(true);
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("Network Error")) {
          alert(translation.AddressVerification.oops_network_err_msg);

          setScan(true);
        } else {
          Alert.alert(
            translation.Registration.alert,
            translation.Registration.invalid_qr_try_again,
            [
              {
                text: translation.Attendance.ok,
                onPress: () => setScan(true),
              },
            ],
            { cancelable: false }
          );
        }
      });
  }

  function ARTTestQRScan(tokenVal, scanType, empId) {
    setisLoading(true);
    scannerAPIcall
      .artTestqRCodeApiGET(tokenVal, scanType, empId)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          setisLoading(false);
          if (tokenRes.data.result.success) {
            navigation.navigate("ArtTestDetails", {
              employeeID: tokenRes.data.result.employeeID,
            });
          } else {
            setisLoading(false);
          }
        } else {
          setisLoading(false);
          Alert.alert("Please wait");
          setScan(true);
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("Network Error")) {
          alert(translation.AddressVerification.oops_network_err_msg);
          setScan(true);
        } else {
          Alert.alert(
            translation.Registration.alert,
            translation.Registration.invalid_qr_try_again,
            [
              {
                text: translation.Attendance.ok,
                onPress: () => setScan(true),
              },
            ],
            { cancelable: false }
          );
        }
      });
  }

  const ValidateQRCode = (value) => {
    if (value === getId) {
      return true;
    }
    return false;
  };

  // const ValidateQR = (value) => {
  //   VerifyQR(value)
  //     .then((resp) => {
  //       if (ValidateQRCode(resp.data.result.employeeID) || isSupervisor) {
  //         if (scanTypeVal === 'arttest') {
  //           navigation.navigate('ArtTestDetails', {
  //             ID: resp.data.result.employeeID,
  //           });
  //         } else {
  //           // navigation.navigate('ArtTestDetails', {     //TODO navigate to vaccination Details screen
  //           //   ID: resp.data.result.employeeID,
  //           // });
  //           alert('Vaccination Development in progress');
  //         }
  //       } else {
  //         alert(translate('ArtTest.pls_scan_valid_qr_code', false));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoaderView loading={isLoading} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Image
              style={styles.backButton}
              source={require("../../assets/icons/BackArrow.png")}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {translation.LoginQrScan.Scan_QR_Code}
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        {scan && (
          <QRCodeScanner
            reactivate={false}
            ref={qrReference}
            onRead={onSuccess}
            cameraType={camType}
            cameraStyle={styles.camstyle}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>{camText}</Text>
        <TouchableOpacity
          onPress={() => flipCamera()}
          style={styles.bottomView}
        >
          <Image
            source={require("../../assets/icons/Flip.png")}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: hp(0),
    height: "100%",
  },
  headersectionContainer: {
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
  text: {
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(18),
    marginTop: hp(10),
  },
  camstyle: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  backBackground: {
    height: hp(100),
    width: wp(80),
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
  bottomContainer: {
    backgroundColor: COLORS.White,
    height: hp(150),
    width: wp(375),
    position: "absolute",
    bottom: hp(0),
  },
  bottomTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
    textAlignVertical: "center",
    alignSelf: "center",
    margin: wp(10),
    height: hp(30),
  },
  bottomIcon: {
    height: wp(42),
    width: wp(42),
    borderRadius: wp(10),
    alignSelf: "center",
  },
  bottomView: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: COLORS.LightGrey,
    width: wp(65),
    height: wp(65),
    borderRadius: wp(50),
  },
});

export default ArtTestQrScan;
