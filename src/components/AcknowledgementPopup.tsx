import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { hp, wp } from "../utils/responsive-helper";
import Icon from "react-native-vector-icons/AntDesign";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { Buttons } from "./Buttons";
import translation from "../assets/translations/translate";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScreenProps {
  isVisible: boolean;
  onRequestClose: () => void;
  onSignaturePadPress: () => void;
  timerDetail: {
    clockInTime: string;
    clockOutTime: string;
  };
  onQrScannerPress: () => void;
  onUpdateLaterPress: () => void;
}

const AcknowledgementPopup = ({
  isVisible,
  onRequestClose = () => {},
  onSignaturePadPress = () => {},
  timerDetail = {
    clockInTime: "",
    clockOutTime: "",
  },
  onQrScannerPress = () => {},
  onUpdateLaterPress = () => {},
}: ScreenProps) => {
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
        style={{
          flex: 1,
          backgroundColor: COLORS.Black_Overlay,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.centeredView,
            { backgroundColor: COLORS.Black_Overlay },
          ]}
        >
          <View style={styles.modalView}>
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
              <Icon name="close" size={hp(26)} color={COLORS.GrayDark} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Bold,
                  fontSize: hp(21),
                  color: COLORS.Black,
                }}
              >
                {translation.Attendance.attendance_ack}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <Image
                source={require("../assets/images/ackBg.png")}
                style={{ resizeMode: "cover", width: wp(170), height: hp(170) }}
              />
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              {timerDetail.clockInTime && (
                <View
                  style={{
                    backgroundColor: COLORS.GreyAccent,
                    width: "113%",
                    alignItems: "center",
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.Urbanist_Medium,
                      color: COLORS.GrayDark,
                      fontSize: hp(18),
                    }}
                  >
                    {translation.Attendance.caps_clockin}
                    <Text
                      style={{
                        fontFamily: FONTS.Urbanist_Bold,
                        color: COLORS.Blue,
                        fontSize: hp(18),
                      }}
                    >
                      {timerDetail.clockInTime}
                    </Text>
                  </Text>
                </View>
              )}

              {timerDetail.clockOutTime != "" && (
                <View
                  style={{
                    backgroundColor: COLORS.GreyAccent,
                    width: "113%",
                    alignItems: "center",
                    paddingVertical: 5,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.Urbanist_Medium,
                      color: COLORS.GrayDark,
                      fontSize: hp(18),
                    }}
                  >
                    {translation.Attendance.caps_clockout}
                    <Text
                      style={{
                        fontFamily: FONTS.Urbanist_Bold,
                        color: COLORS.Blue,
                        fontSize: hp(18),
                      }}
                    >
                      {timerDetail.clockOutTime}
                    </Text>
                  </Text>
                </View>
              )}
            </View>

            <Buttons
              onPress={onQrScannerPress}
              text={translation.Attendance.scan_qrcode}
              BTNstyle={{
                ...styles.buttonStyle,
                backgroundColor: COLORS.White,
              }}
              textStyle={{ ...styles.retakebuttonTxt }}
              ImgStyle={undefined}
              loader={undefined}
              source={require("../assets/images/scan.png")}
              ImgStyle={{
                height: hp(30),
                width: wp(30),
                justifyContent: "center",
              }}
            />

            <Buttons
              onPress={onSignaturePadPress}
              text={translation.Attendance.signature}
              BTNstyle={{
                ...styles.buttonStyle,
                backgroundColor: COLORS.Blue,
              }}
              textStyle={{ ...styles.retakebuttonTxt, color: COLORS.White }}
              ImgStyle={{
                height: hp(30),
                width: wp(30),
                justifyContent: "center",
              }}
              loader={undefined}
              source={require("../assets/images/digital-signature.png")}
            />
            <Buttons
              onPress={onUpdateLaterPress}
              text={translation.Attendance.skip}
              BTNstyle={{
                ...styles.buttonStyle,
                backgroundColor: COLORS.White,
              }}
              textStyle={{ ...styles.retakebuttonTxt }}
              ImgStyle={{
                height: hp(30),
                width: wp(30),
                justifyContent: "center",
              }}
              loader={undefined}
              source={require("../assets/images/system-update.png")}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AcknowledgementPopup;

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  logoimageStyle: {
    height: wp(60),
    width: wp(60),
    marginLeft: wp(10),
    backgroundColor: COLORS.White,
    alignSelf: "center",
    resizeMode: "contain",
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: hp(10),
    width: wp(326),
    height: hp(55),
    borderRadius: wp(8),
    borderColor: COLORS.LightBlue,
    borderWidth: hp(1),
    backgroundColor: COLORS.Blue,
  },
  buttonTxt: {
    fontSize: hp(16),
    alignItems: "center",
    // textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },
  retakebuttonTxt: {
    fontSize: hp(16),
    alignItems: "center",
    textAlign: "left",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
    marginHorizontal: 10,
    // width: wp(1),
  },
});
