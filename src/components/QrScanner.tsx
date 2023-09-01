import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { RNCamera } from "react-native-camera";
import { hp, wp } from "../utils/responsive-helper";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import translation from "../assets/translations/translate";
import { fileResizer } from "../utils/file-resizer/fileResizer";
import { VerifyQR } from "../utils/AttendenceQrAPI";
import LoaderView from "./Loader";
import NavigationHeader from "./NavigationHeader";

interface ScreenProps {
  isFocused: boolean;
  onRequestClose: () => void;
  employeeId: string | number;
  onSuccessQrScanner: (staffName: string, imageUri: any) => void;
}

const QrScanner = ({
  isFocused = false,
  onRequestClose = () => {},
  employeeId = "",
  onSuccessQrScanner = () => {},
}: ScreenProps) => {
  const [camType, setCam] = useState(RNCamera.Constants.Type.front);
  const [isScanned, setisScanned] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const cameraRef = useRef();

  useEffect(() => {
    if (isFocused) {
      setisLoading(false);
      setisScanned(true);
    }
  }, [isFocused]);

  const flipCamera = () => {
    if (camType === RNCamera.Constants.Type.back) {
      setCam(RNCamera.Constants.Type.front);
    } else {
      setCam(RNCamera.Constants.Type.back);
    }
  };

  const onBarCodeRecieve = async (e) => {
    try {
      setisScanned(false);
      if (!isScanned && !isLoading) {
        setisLoading(true);
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef?.current?.takePictureAsync(options);
        const compressedImage = await fileResizer(data.uri);
        // cameraRef.current = null;
        let value = e.data.replace("http://", "");
        const resp = await VerifyQR(value.toUpperCase(), 1, employeeId);
        if (!resp.data.result) {
          Alert.alert(
            "Invalid QRcode",
            translation.Attendance.scan_valid_qr_code,
            [
              {
                text: "OK",
                onPress: () => {
                  setisLoading(false);
                  setisScanned(true);
                },
              },
            ]
          );
        } else {
          setisLoading(false);
          // setisScanned(true);
          onSuccessQrScanner(
            "",
            Platform.OS === "ios" ? data.uri : compressedImage.uri
          );
        }
      }
    } catch (error) {
      Alert.alert("Invalid QRcode", translation.Attendance.scan_valid_qr_code, [
        {
          text: "OK",
          onPress: () => {
            setisLoading(false);
            setisScanned(true);
          },
        },
      ]);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <NavigationHeader
            title={translation.Attendance.scan_qr_code}
            onPressCallBack={onRequestClose}
          />
          {isFocused && (
            <RNCamera
              style={styles.preview}
              ref={cameraRef}
              type={camType}
              onBarCodeRead={onBarCodeRecieve}
              captureAudio={false}
            />
          )}
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={flipCamera} style={styles.bottomView}>
              <View>
                <Image
                  style={styles.bottomIcon}
                  source={require("../assets/icons/Flip.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <LoaderView loading={isLoading} />
      </SafeAreaView>
    </>
  );
};

export default QrScanner;

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
    alignItems: "center",
    marginTop: hp(30),
  },
  bottomContainer: {
    backgroundColor: COLORS.White,
    height: hp(140),
    width: wp(375),
    position: "absolute",
    bottom: hp(0),
  },

  preview: {
    // flex: 1,
    height: "100%",
    width: "100%",
    // height: hp(600),
    // width: wp(375),
    justifyContent: "center",
  },
});
