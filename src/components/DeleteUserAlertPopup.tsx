import { StyleSheet, Text, View, Modal, Dimensions } from "react-native";
import React, { useState } from "react";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { hp } from "../utils/responsive-helper";
import { Buttons } from "./Buttons";
import Lottie from "lottie-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { profileDeleteAPI } from "../utils/ProfileNetworkAPI";
import translation from "../assets/translations/translate";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
  onConfirmPress: () => void;
}

const DeleteUserAlertPopup = ({
  isVisible = false,
  onRequestClose = () => {},
  onConfirmPress = () => {},
}: IProps) => {
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );
  const [isSuccessAlert, setSuccessAlert] = useState<boolean>(false);

  const onDeleteConfimPress = async () => {
    await profileDeleteAPI({
      EmployeeNo: profileDetails.empNameId,
      Email: profileDetails.emailID,
    });
    setSuccessAlert(true);
  };

  const OnSuccessAlertUI = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie
          source={require("../assets/lottie-json/account-delete-succes.json")}
          autoPlay
          loop={false}
          style={{ height: hp(90), width: hp(90) }}
        />
        <Text style={styles.confirmText}>Account Deleted Successfully</Text>
        <Text style={[styles.confirmText, { paddingVertical: 0 }]}>
          Your Account will be logged out automatically
        </Text>
        <Buttons
          BTNstyle={{
            padding: 10,
            borderWidth: 0,
            borderRadius: 5,
            backgroundColor: COLORS.PurpleButton,
            width: "90%",
            alignItems: "center",
            marginTop: 20,
          }}
          text={"OK"}
          textStyle={{
            fontFamily: FONTS.Urbanist_Bold,
            fontSize: hp(15),
            color: COLORS.White,
            paddingVertical: 4,
          }}
          onPress={onConfirmPress}
        />
      </View>
    );
  };

  const DeleteAccountAlertUI = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.headerText}>{translation.Profile.del_acc}</Text>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: SCREEN_WIDTH - 30,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.confirmText}>
            {translation.Profile.delete_desc1}
          </Text>
          <Text style={styles.confirmText}>
            {translation.Profile.delete_desc2}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <Buttons
            text={translation.Profile.cancel}
            BTNstyle={styles.cancelButtonStyle}
            textStyle={styles.cancelButtonText}
            onPress={onRequestClose}
          />
          <Buttons
            text={translation.Profile.confirm}
            BTNstyle={styles.confimButtonStyle}
            textStyle={styles.confirmButtonText}
            onPress={onDeleteConfimPress}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalSubContainer}>
            {isSuccessAlert ? <OnSuccessAlertUI /> : <DeleteAccountAlertUI />}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeleteUserAlertPopup;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.Black_Overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubContainer: {
    backgroundColor: COLORS.White,
    borderRadius: 5,
    width: SCREEN_WIDTH - 20,
    paddingVertical: 10,
  },
  headerText: {
    fontFamily: FONTS.Urbanist_Bold,
    fontSize: hp(20),
    color: COLORS.BlackDark,
    fontWeight: "bold",
  },
  confirmText: {
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(16),
    color: COLORS.BlackDark,
    paddingVertical: 10,
    // textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  cancelButtonStyle: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.Gray,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },

  confimButtonStyle: {
    padding: 10,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: COLORS.PurpleButton,
    width: "40%",
    alignItems: "center",
  },
  confirmButtonText: {
    fontFamily: FONTS.Urbanist_Bold,
    fontSize: hp(15),
    color: COLORS.White,
    paddingVertical: 4,
  },
  cancelButtonText: {
    fontFamily: FONTS.Urbanist_Bold,
    fontSize: hp(15),
    color: COLORS.Black,
    paddingVertical: 4,
  },
});
