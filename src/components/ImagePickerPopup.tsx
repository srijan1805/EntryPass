import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { hp, wp } from "../utils/responsive-helper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { Buttons } from "./Buttons";
import translation from "../assets/translations/translate";
// import ImagePicker from "react-native-image-picker";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScreenProps {
  isVisible: boolean;
  onRequestClose: () => void;
  onSuccessCallBack: (sourceUri: string) => void;
}

const ImagePickerPopup = ({
  isVisible,
  onRequestClose = () => {},
  onSuccessCallBack = () => {},
}: ScreenProps) => {
  var ImagePicker = require("react-native-image-picker");
  const openGallery = async () => {
    onRequestClose();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    return await ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const sourceUri = response?.assets?.[0]?.uri;
        onSuccessCallBack(sourceUri);
        return sourceUri;
        // uploadImage(sourceUri);
        // console.log("Response = ", sourceUri);
        // const source = { uri: response.uri };
        // setState(response.assets);
      }
    });
  };

  const openCamera = async () => {
    onRequestClose();
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    return await ImagePicker.launchCamera(options, (response: any) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        // return response;
        // const source = { uri: response.uri };
        //   setState(response.assets);
        const sourceUri = response?.assets?.[0]?.uri;
        onSuccessCallBack(sourceUri);
        return sourceUri;
      }
    });
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {}]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Bold,
                  fontSize: hp(24),
                  color: COLORS.BlackDark,
                }}
              >
                {translation.Profile.upload_image}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                marginTop: hp(20),
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: hp(20),
                }}
                onPress={openCamera}
              >
                <FontAwesomeIcon
                  name="camera"
                  color={COLORS.Black}
                  size={hp(30)}
                />
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Medium,
                    fontSize: hp(22),
                    color: COLORS.DarkGrey,
                    marginHorizontal: hp(15),
                  }}
                >
                  {translation.Profile.camera}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: hp(20),
                  marginTop: hp(25),
                }}
                onPress={openGallery}
              >
                <FontAwesome5Icon
                  name="images"
                  color={COLORS.Black}
                  size={hp(30)}
                />
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Medium,
                    fontSize: hp(22),
                    color: COLORS.DarkGrey,
                    marginHorizontal: hp(15),
                  }}
                >
                  {translation.Profile.gallery}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.rowView]}>
              <Buttons
                text={translation.Buttons_lable.close}
                onPress={onRequestClose}
                BTNstyle={styles.buttonStyle}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ImagePickerPopup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.Black_Overlay,
  },
  modalView: {
    width: SCREEN_WIDTH - 20,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    borderRadius: hp(10),
    height: hp(48),
    width: wp(320),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(25),
    // marginBottom: hp(23) - 10,
  },
  buttonText: {
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.White,
    textAlign: "center",
    fontSize: hp(16),
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
