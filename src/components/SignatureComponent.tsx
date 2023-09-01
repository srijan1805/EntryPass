import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import SignatureCapture from "react-native-signature-capture";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { Buttons } from "./Buttons";
import { hp, wp } from "../utils/responsive-helper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFetchBlob from "rn-fetch-blob";
import translation from "../assets/translations/translate";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScreenProps {
  isVisible: boolean;
  onRequestClose: () => void;
  empName: string;
  onSignatureSubmitPress: (staffName: string, ImageUri: any) => void;
}

let tempArr: any = [];
let dragged = false;

const SignatureComponent = ({
  isVisible = false,
  onRequestClose = () => {},
  empName = "",
  onSignatureSubmitPress = () => {},
}: ScreenProps) => {
  const ref = useRef(null);
  const [staffName, setStaffName] = useState<string>(empName);
  const [staffError, setStaffError] = useState<string>("");
  const [sigatureError, setSignatureError] = useState<string>("");

  const saveSign = () => {
    ref.current?.saveImage();
  };

  const resetSign = () => {
    ref?.current?.resetImage();
    tempArr.splice(0, tempArr.length);
  };

  const _onSaveEvent = (result) => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    // console.log("NJNJNJ", result);

    const ImageUri = result?.pathName;
    // const splitedAarry = ImageUri.split("/");
    // const FileName = splitedAarry[splitedAarry.length - 1];
    // const realPath = ImageUri.replace("file://", "");

    let data: any = {
      ImageUri: ImageUri,
    };
    if (tempArr.length === 0) {
      tempArr.push(data);
    }
    onSubmitPress();
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log("dragged");
    dragged = true;
  };

  const triggerSaveEvent = () => {
    ref?.current.saveImage();
  };

  const onSubmitPress = () => {
    if (staffName.length === 0) {
      setStaffError("Please Enter Staff Name");
    } else if (tempArr.length === 0 || dragged === false) {
      setSignatureError("Please Enter YourSignature");
    } else if (staffName.length > 0 && tempArr.length > 0) {
      onSignatureSubmitPress(staffName, tempArr[0].ImageUri);
      // onRequestClose();
    }
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
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "absolute",
                right: 10,
                top: 10,
              }}
              onPress={() => onRequestClose()}
            >
              <Icon name="cancel" size={hp(24)} color={COLORS.GrayDark} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: FONTS.Urbanist_Bold,
                fontSize: hp(20),
                textAlign: "center",
                color: COLORS.BlackDark,
              }}
            >
              {translation.Attendance.staff_ack}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.Urbanist,
                fontSize: hp(18),
                color: COLORS.GrayDark,
                marginVertical: 10,
              }}
            >
              {translation.Attendance.staff_name}
            </Text>
            <TextInput
              value={staffName}
              placeholder={translation.Attendance.staff_name}
              onChangeText={(text) => setStaffName(text)}
              style={{
                borderWidth: 0,
                borderRadius: 5,
                backgroundColor: COLORS.GreyAccent,
                color: COLORS.Black,
                fontFamily: FONTS.Urbanist,
                fontSize: hp(15),
                paddingHorizontal: 10,
                minHeight: hp(45),
              }}
              placeholderTextColor={COLORS.Black}
            />
            {staffError.length > 0 && (
              <Text
                style={{
                  fontFamily: FONTS.Urbanist,
                  color: COLORS.Red,
                  fontSize: hp(12),
                  marginTop: 5,
                }}
              >
                {staffError}
              </Text>
            )}
            <View
              style={{
                marginVertical: 20,
                height: hp(400),
                borderWidth: 0.5,
                backgroundColor: COLORS.GrayLight,
                borderColor: COLORS.GrayLight,
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={{
                    padding: 10,
                  }}
                  onPress={resetSign}
                >
                  <MaterialCommunityIcon
                    name="eraser"
                    size={hp(28)}
                    color={COLORS.Black}
                  />
                </TouchableOpacity>
              </View>
              <SignatureCapture
                style={styles.signature}
                ref={ref}
                onSaveEvent={_onSaveEvent}
                onDragEvent={_onDragEvent}
                saveImageFileInExtStorage={true}
                showNativeButtons={false}
                showTitleLabel={false}
                backgroundColor={COLORS.GrayLight}
                strokeColor={COLORS.Black}
                minStrokeWidth={4}
                maxStrokeWidth={4}
                viewMode={"portrait"}
                showBorder={false}
              />
            </View>
            {sigatureError.length > 0 && (
              <Text
                style={{
                  fontFamily: FONTS.Urbanist,
                  color: COLORS.Red,
                  fontSize: hp(12),
                  marginTop: -10,
                  marginBottom: 10,
                }}
              >
                {sigatureError}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Buttons
                text={translation.Attendance.cancel}
                onPress={() => onRequestClose()}
                BTNstyle={{
                  // backgroundColor: COLORS.LightBlue,
                  borderRadius: hp(10),
                  height: hp(48),
                  width: wp(150),
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                  borderWidth: 1,
                  borderColor: COLORS.Gray,
                }}
                textStyle={{
                  fontFamily: FONTS.Urbanist_Semibold,
                  color: COLORS.Black,
                  textAlign: "center",
                  fontSize: hp(16),
                }}
              />
              <Buttons
                text={translation.Attendance.submit}
                onPress={triggerSaveEvent}
                BTNstyle={{
                  backgroundColor: COLORS.PurpleButton,
                  borderRadius: hp(10),
                  height: hp(48),
                  width: wp(150),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                textStyle={{
                  fontFamily: FONTS.Urbanist_Semibold,
                  color: COLORS.White,
                  textAlign: "center",
                  fontSize: hp(16),
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SignatureComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1,
  },
});
