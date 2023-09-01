import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { hp, wp } from "../utils/responsive-helper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { Buttons } from "./Buttons";
import translation from "../assets/translations/translate";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PopUpProps {
  navigation: any;
  isVisible: boolean;
  onProceedPress: () => void;
  onChangePress: () => void;
  onRequestClose: () => void;
  facilityName: string;
  facilityLogo: string;
}

const FacilityChangePopup = ({
  navigation,
  isVisible = false,
  onProceedPress = () => {},
  onChangePress = () => {},
  onRequestClose = () => {},
  facilityName = "",
  facilityLogo = "",
}: PopUpProps) => {
  const [imageError, setImageError] = useState(false);

  const imageErr = () => {
    setImageError(true);
  };
  return (
    <>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={onRequestClose}
        >
          <View style={styles.centeredView}>
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
                <Icon name="cancel" size={hp(24)} color={COLORS.GrayDark} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Bold,
                    fontSize: hp(22),
                    color: COLORS.Black,
                  }}
                >
                  {translation.Attendance.fac_confim}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Medium,
                  fontSize: hp(18),
                  color: COLORS.Red,
                  paddingTop: 10,
                }}
              >
                {translation.Attendance.fac_change_desc}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginVertical: 25,
                  alignItems: "center",
                }}
              >
                {(() => {
                  if (imageError) {
                    return (
                      <View style={styles.noLogo}>
                        <Text style={styles.noLogoText}>
                          {translation.Attendance.no_logo}
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <Image
                        style={styles.logoimageStyle}
                        source={{
                          uri: `${facilityLogo}`,
                        }}
                        onError={imageErr}
                      />
                    );
                  }
                })()}

                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Semibold,
                    color: COLORS.Black,
                    textAlign: "center",
                    marginHorizontal: 20,
                    fontSize: hp(18),
                  }}
                >
                  {facilityName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: hp(5),
                }}
              >
                <Buttons
                  text={translation.Attendance.procced}
                  onPress={onProceedPress}
                  BTNstyle={{
                    borderRadius: hp(10),
                    height: hp(45),
                    width: wp(90),
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
                  text={translation.Attendance.change}
                  onPress={onChangePress}
                  BTNstyle={{
                    backgroundColor: COLORS.PurpleButton,
                    borderRadius: hp(10),
                    height: hp(45),
                    width: wp(90),
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
      </View>
    </>
  );
};

export default FacilityChangePopup;

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
});
