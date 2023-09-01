import React from "react";
import { useState } from "react";
import { TouchableOpacity, Image, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { FONTS } from "../constants/font";
import { COLORS } from "../constants/color";

const CusInput = ({
  value,
  editable,
  onEndEditing,
  placeholder,
  onChangeText,
  onFocus,
  style,
  warn,
  secureTextEntry = false,
  right = false,
  wrong = false,
  Password = false,
}) => {
  const [secureTextEntryL, SetSecureTextEntry] = useState(secureTextEntry);

  return (
    <View>
      {Password && (
        <TouchableOpacity
          style={styles.rightView}
          onPress={() => SetSecureTextEntry(!secureTextEntryL)}
        >
          <Image
            source={
              !secureTextEntryL
                ? require("../assets/icons/eyeOfff.png")
                : require("../assets/icons/eyeOnnn.png")
            }
            style={styles.eyeImage}
          />
        </TouchableOpacity>
      )}

      <TextInput
        autoCapitalize="none"
        placeholderTextColor={COLORS.placeHolderColor}
        onEndEditing={onEndEditing}
        editable={editable}
        secureTextEntry={secureTextEntryL}
        onFocus={onFocus}
        value={value}
        returnKeyType="next"
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={wrong ? styles.wronInput : styles.defaultInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  defaultInput: {
    backgroundColor: "#F8F7F7",
    marginHorizontal: "7%",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    padding: 15,
    marginTop: "6%",
    fontFamily: FONTS.Montserrat,
    fontSize: 14,
  },
  wronInput: {
    backgroundColor: "#F8F7F7",
    marginHorizontal: "7%",
    borderRadius: 15,
    borderColor: "#E93223",
    borderWidth: 1,
    padding: 10,
    marginTop: "6%",
    fontFamily: FONTS.Lato,
  },
  rightView: { position: "absolute", right: "10%", top: "50%", zIndex: 100 },
  RightImage: { height: 20, width: 20, resizeMode: "stretch" },
  eyeImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: "#484848",
  },
  WarnImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
});
export default CusInput;
