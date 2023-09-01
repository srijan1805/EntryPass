import { StyleSheet, Text, View, Modal, Dimensions } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { hp, wp } from "../utils/responsive-helper";
import { Buttons } from "./Buttons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScreenProps {
  isVisible: boolean;
  onRequestClose: () => void;
  updateNow: () => void;
}

const SupervisorVerificationPopup = ({
  isVisible = false,
  onRequestClose = () => {},
  updateNow = () => {},
}: ScreenProps) => {
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
                // flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                // marginVertical: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Bold,
                  fontSize: hp(20),
                  color: COLORS.Black,
                }}
              >
                Update Required!
              </Text>

              <Lottie
                source={require("../assets/lottie-json/process-pending.json")}
                autoPlay
                loop={true}
                style={{ height: hp(100), width: hp(100) }}
              />

              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Medium,
                  fontSize: hp(18),
                  color: COLORS.Black,
                  textAlign: "center",
                  paddingBottom: 18,
                }}
              >
                Please update the supervisor verification
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Buttons
                text={"Remind me later"}
                BTNstyle={{
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
                onPress={onRequestClose}
              />
              <Buttons
                text={"Update Now"}
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
                onPress={updateNow}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SupervisorVerificationPopup;

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
});
