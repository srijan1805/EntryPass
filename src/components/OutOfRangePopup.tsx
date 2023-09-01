import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import translation from "../assets/translations/translate";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { hp, wp } from "../utils/responsive-helper";
import { METRICS } from "../constants/dimensions";
import { Buttons } from "./Buttons";

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
}

const OutOfRangePopup = ({ isVisible, onRequestClose = () => {} }: IProps) => {
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
            <View style={styles.rowView}>
              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Semibold,
                  fontSize: hp(20),
                  color: COLORS.BlackDark,
                }}
              >
                {translation.AlertMessage.location_alert_title}
              </Text>
            </View>
            <View style={[styles.rowView, { marginVertical: hp(15) }]}>
              <Text
                style={{
                  fontFamily: FONTS.Urbanist,
                  fontSize: hp(18),
                  color: COLORS.BlackDark,
                  textAlign: "center",
                }}
              >
                {translation.AlertMessage.loc_alert_mesaage}
              </Text>
            </View>

            <View style={[styles.rowView]}>
              <Buttons
                text={translation.Buttons_lable.Ok}
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

export default OutOfRangePopup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.Black_Overlay,
  },
  modalView: {
    width: METRICS.screenWidth - 20,
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
    // marginTop: hp(25),
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
