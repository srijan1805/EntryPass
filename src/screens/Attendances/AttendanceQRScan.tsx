import React, { useRef, useEffect, useState } from "react";
import { COLORS } from "../../constants/color";
import { RNCamera } from "react-native-camera";
import "react-native-gesture-handler";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  Platform,
} from "react-native";
import {
  StackActions,
  useNavigation,
  CommonActions,
  useIsFocused,
} from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import { VerifyQR } from "../../utils/AttendenceQrAPI";
import { hp, wp } from "../../utils/responsive-helper";
import LoaderView from "../../components/Loader";
import { FONTS } from "../../constants/font";
import { setLoading } from "../../store/Notifications/Notifications";
import {
  profileRetrieveData,
  profileStoreData,
} from "../../store/User/UserDetails";
import { fileResizer } from "../../utils/file-resizer/fileResizer";
import NavigationHeader from "../../components/NavigationHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AttendanceScanner = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let cameraRef = useRef(null);

  const { isAllowFaceDetect } = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );

  const [camType, setCam] = useState(RNCamera.Constants.Type.front);
  const [camText, setCamText] = useState(
    translation.LoginQrScan.Scan_your_employee_staff_card
  );
  const screenValType = props.route.params.type;
  const emploID = props.route.params.emploID;
  const [hideScanner, setHideScanner] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isScanned, setisScanned] = useState(true);
  const [isSupervisor, setSupervisor] = useState(false);
  const [getId, setId] = useState(0);
  const [canDetectFaces, setDetectFace] = useState<boolean>(false);
  const [faceBox, setFaceBox] = useState<any>(null);

  let screenVal = props.route.params.val;
  let screentype = props.route.params.type;

  useEffect(() => {
    if (isFocused) {
      setisLoading(false);
      setLoading(false);
      setisScanned(true);
      profileRetrieveData().then((tokenval) => {
        setSupervisor(tokenval.isSpuervisor);
        setId(tokenval.employeeId);
      });
      if (screenValType === "clockIn") {
        setCam(RNCamera.Constants.Type.front);
      } else if (screenValType === "clockOut") {
        setCam(RNCamera.Constants.Type.front);
      } else if (screenValType === "Other") {
        setCam(RNCamera.Constants.Type.back);
        setCamText(translation.LoginQrScan.Scan_Employee_Card);
      }
    } else {
      setisLoading(false);
      setLoading(false);
      setisScanned(true);
    }
  }, [isFocused]);

  const onSuccessHnadler = async (
    resp: any,
    compressedImage: any,
    data: any
  ) => {
    if (resp.data.result === null) {
      Alert.alert(
        translation.AlertMessage.location_alert_title,
        translation.Attendance.scan_valid_qr_code,
        [
          {
            text: translation.Buttons_lable.Ok,
            onPress: () => {
              setisLoading(false);
              setLoading(false);
              setisScanned(true);
            },
          },
        ]
      );
    } else if (
      ValidateQRCode(resp.data.result.employeeID) === true &&
      screenValType === "clockIn"
    ) {
      setisLoading(false);
      setLoading(false);

      navigation.navigate("AttendancePreview", {
        imgdata: {
          uri: compressedImage.uri,
        },
        type: screenValType,
        IDs: resp?.data?.result?.employeeID,
        currentemployeeIDs: resp?.data?.result?.employeeID,
        facilityConfig: resp?.data?.result?.facilityConfiguration,
      });
    } else if (
      ValidateQRCode(resp.data.result.employeeID) === true &&
      screenValType === "clockOut"
    ) {
      setisLoading(false);
      setLoading(false);

      navigation.navigate("AttendancePreview", {
        imgdata: data,
        type: screenValType,
        IDs: resp?.data?.result?.employeeID,
        currentemployeeIDs: resp?.data?.result?.employeeID,
        facilityConfig: resp?.data?.result?.facilityConfiguration,
      });
    } else if (
      ValidateQRCode(resp.data.result.employeeID) === false &&
      isSupervisor &&
      screenValType === "Other"
    ) {
      setisLoading(false);
      setLoading(false);
      setFaceBox(null);

      navigation.navigate("AttendancePreview", {
        imgdata: {
          uri: compressedImage.uri,
        },
        type: screenValType,
        IDs: resp?.data?.result?.employeeID,
        currentemployeeIDs: getId,
        facilityConfig: resp?.data?.result?.facilityConfiguration,
      });
    } else {
      Alert.alert(
        translation.AlertMessage.invalid_qrcode,
        translation.Attendance.scan_valid_qr_code,
        [
          {
            text: translation.Buttons_lable.Ok,
            onPress: () => {
              setisLoading(false);
              setLoading(false);
              setisScanned(true);
              setFaceBox(null);
            },
          },
        ]
      );
    }
  };

  const takePicture = async (e: any) => {
    try {
      // const e = scanval?.barcodes?.data;
      // console.log("HBBHHBHB", JSON.stringify(scanval), e.length, e.length > 0);
      setisScanned(false);
      // if (faceBox) {
      if (!isScanned && screenVal === "retake" && !isLoading) {
        setisLoading(true);
        screenVal = "";
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef?.current?.takePictureAsync(options);

        const compressedImage = await fileResizer(data.uri);

        // cameraRef.current = null;
        let value = e.data.replace("http://", "");
        const resp = await VerifyQR(value.toUpperCase(), 1, getId);
        console.log("VERIFY QRRR", resp);
        // if (faceBox && isAllowFaceDetect) {
        if (isAllowFaceDetect) {
          if (faceBox) {
            await onSuccessHnadler(resp, compressedImage, data);
          } else {
            Alert.alert(
              translation.AlertMessage.Alert,
              translation.AlertMessage.no_face,
              [
                {
                  text: translation.Buttons_lable.Ok,
                  onPress: () => {
                    setisLoading(false);
                    setLoading(false);
                    setisScanned(true);
                    setFaceBox(null);
                    setDetectFace(true);
                  },
                },
              ]
            );
          }
        } else {
          await onSuccessHnadler(resp, compressedImage, data);
        }
      }
    } catch (error) {
      setisLoading(false);
      setLoading(false);
      setisScanned(true);
      setFaceBox(null);
    }
  };

  const ValidateQRCode = (value) => {
    if (value === getId) return true;
    return false;
  };

  const flipCamera = () => {
    if (camType === RNCamera.Constants.Type.back) {
      setCam(RNCamera.Constants.Type.front);
    } else {
      setCam(RNCamera.Constants.Type.back);
    }
  };

  const onFacesDetectedHandler = ({ faces }: any) => {
    if (faces[0]) {
      setFaceBox({
        box: {
          width: faces[0].bounds.size.width,
          height: faces[0].bounds.size.height,
          x: faces[0].bounds.origin.x,
          y: faces[0].bounds.origin.y,
          yawAngle: faces[0].yawAngle,
          rollAngle: faces[0].rollAngle,
        },
        rightEyePosition: faces[0].rightEyePosition,
        leftEyePosition: faces[0].leftEyePosition,
        bottomMouthPosition: faces[0].leftEyePosition,
      });
    } else {
      setFaceBox(null);
    }
  };

  console.log("kkkk", isAllowFaceDetect);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.White }}>
        <NavigationHeader
          title={translation.Attendance.scan_qr_code}
          onPressCallBack={() => navigation.goBack()}
        />
        <View>
          {isFocused && (
            <RNCamera
              style={styles.preview}
              ref={cameraRef}
              type={camType}
              captureAudio={false}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              onBarCodeRead={takePicture}
              onFacesDetected={
                canDetectFaces
                  ? // && !faceBox
                    onFacesDetectedHandler
                  : () => {}
              }
              onCameraReady={() => {
                if (isAllowFaceDetect) {
                  setTimeout(() => {
                    setDetectFace(true);
                  }, 2000);
                }
              }}
            />
          )}

          {faceBox && isAllowFaceDetect ? (
            <>
              <View
                style={styles.bound({
                  width: faceBox.box.width,
                  height: faceBox.box.width,
                  x: faceBox.box.x,
                  y: faceBox.box.y,
                })}
              ></View>
            </>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomTitle}>{camText}</Text>
          <TouchableOpacity
            onPress={() => flipCamera()}
            style={styles.bottomView}
          >
            <View>
              <Image
                style={styles.bottomIcon}
                source={require("../../assets/icons/Flip.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );
};

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
  preview: {
    height: hp(620),
    borderRadius: hp(30),
    width: wp(375),
    justifyContent: "center",
  },
  bottomContainer: {
    backgroundColor: COLORS.White,
    height: hp(150),
    width: wp(375),
    position: "absolute",
    bottom: hp(0),
  },
  bound: ({ width, height, x, y }) => {
    return {
      position: "absolute",
      top: y,
      left: x,
      width: width,
      height: height,
      borderWidth: 3,
      borderColor: COLORS.Yellow,
      zIndex: 3000,
    };
  },
});

export default AttendanceScanner;
