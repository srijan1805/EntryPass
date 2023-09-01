import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import { RNCamera } from "react-native-camera";
import { wp, hp } from "../../utils/responsive-helper";
import NavigationHeader from "../../components/NavigationHeader";
const { width, height } = Dimensions.get("window");

const CaptureImage = ({ navigation }) => {
  let cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      navigation.navigate("UploadResidenceImage", { imgdata: data });
    }
  };

  return (
    <SafeAreaView style={styles.scannerStyle}>
      <NavigationHeader
        title={translation.AddressVerification.Capture_Image}
        onPressCallBack={() => navigation.goBack()}
      />
      <RNCamera
        style={styles.preview}
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
      >
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => takePicture()}
            style={styles.capture}
          >
            <Image
              source={require("../../assets/icons/Camera.png")}
              style={styles.captureIcon}
            />
          </TouchableOpacity>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scannerStyle: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  capture: {
    backgroundColor: COLORS.LightGrey,
    borderRadius: hp(80),
    padding: hp(15),
    alignSelf: "center",
    height: wp(70),
    width: wp(70),
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    position: "relative",
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
  captureIcon: {
    height: wp(43),
    width: wp(43),
  },
  bottomContainer: {
    backgroundColor: COLORS.White,
    alignSelf: "center",
    bottom: hp(0),
    height: hp(130),
    width: wp(375),
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CaptureImage;
