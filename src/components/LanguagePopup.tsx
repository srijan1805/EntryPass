import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "../utils/responsive-helper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../constants/color";
import { FONTS } from "../constants/font";
import { Buttons } from "./Buttons";
import translation from "../assets/translations/translate";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LANGUAGE_DATA = [
  {
    id: 1,
    name: translation.English.English,
    code: "en",
  },
  {
    id: 2,
    name: translation.Chines.Chines,
    code: "en",
  },
  {
    id: 3,
    name: translation.Bahasa.Bahasa,
    code: "en",
  },
];

interface PopUpProps {
  isVisible: boolean;
  onProceedPress: () => void;
  onChangePress: (code: string) => void;
  onRequestClose: () => void;
  selectedLang: string;
  langData: Array<any>;
}

const LanguagePopup = ({
  isVisible = false,
  onProceedPress = () => {},
  onChangePress = (code: string) => {},
  onRequestClose = () => {},
  selectedLang = "en",
  langData = [],
}: PopUpProps) => {
  const [selectedCode, setSelectedCode] = useState<string>(selectedLang);

  return (
    <>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={onRequestClose}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.Black_Overlay,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Semibold,
                    fontSize: wp(18),
                    color: COLORS.Black,
                  }}
                >
                  Change Language
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  //   alignItems: "center",
                  marginVertical: 15,
                }}
              >
                {langData.map((langItem, langIndex) => {
                  console.log(
                    "KMKMMK",
                    selectedLang,
                    langItem.code,
                    selectedLang == langItem.code
                  );
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedCode(langItem.code);
                      }}
                    >
                      <View
                        style={[
                          selectedCode == langItem.code
                            ? {
                                backgroundColor: COLORS.Yellow,
                                borderRadius: wp(5),
                                color: COLORS.Black,
                                paddingHorizontal: wp(10),
                                paddingVertical: wp(10),
                                marginVertical: 8,
                              }
                            : {
                                justifyContent: "center",
                                marginVertical: 10,
                                marginHorizontal: 5,
                              },
                        ]}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={{
                              width: wp(23),
                              height: hp(23),
                            }}
                            source={
                              selectedCode == langItem.code
                                ? require("../assets/icons/Checked-Select.png")
                                : require("../assets/icons/Unchecked.png")
                            }
                          />
                          <Text
                            style={{
                              color: COLORS.DarkGrey,
                              fontSize: wp(18),
                              fontFamily: FONTS.Urbanist_Semibold,
                              fontWeight: "600",
                              textAlign: "center",
                              marginLeft: wp(15),
                            }}
                          >
                            {langItem.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: hp(5),
                }}
              >
                <Buttons
                  text={translation.Attendance.close}
                  onPress={onRequestClose}
                  BTNstyle={{
                    borderRadius: hp(10),
                    height: hp(45),
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
                  text={translation.Attendance.change}
                  onPress={() => onChangePress(selectedCode)}
                  BTNstyle={{
                    backgroundColor: COLORS.PurpleButton,
                    borderRadius: hp(10),
                    height: hp(45),
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
      </View>
    </>
  );
};

export default LanguagePopup;

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
