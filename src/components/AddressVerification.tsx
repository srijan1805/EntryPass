import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import translation from "../assets/translations/translate";
import { COLORS } from "../constants/color";
import { useNavigation } from "@react-navigation/native";
//const { width, height } = Dimensions.get('window');
import { wp, hp } from "../utils/responsive-helper";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function AddressVerificationComponent({ isVerification }) {
  const [verification, setVerification] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    setVerification(isVerification);
  }, []);

  return (
    <View style={styles.tabs}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("AddressVerificationHomeScreen");
        }}
      >
        <View
          style={[
            styles.tabIcon,
            {
              borderColor: verification ? COLORS.Blue : COLORS.LightGrey,
              backgroundColor: verification ? COLORS.Blue : Colors.lighter,
            },
          ]}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: verification ? COLORS.White : COLORS.DarkGrey,
              },
            ]}
          >
            {translation.AddressHistory.Verification}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("AddressHistoryList");
        }}
      >
        <View
          style={[
            styles.tabIcon,
            {
              borderColor: !verification ? COLORS.Blue : COLORS.LightGrey,
              backgroundColor: !verification ? COLORS.Blue : Colors.lighter,
            },
          ]}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: !verification ? COLORS.White : COLORS.DarkGrey,
              },
            ]}
          >
            {translation.AddressHistory.History}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    height: hp(50),
    width: wp(327),
    marginLeft: hp(24),
    //marginHorizontal: wp(width * 0.02),
    marginVertical: hp(5),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    // backgroundColor: COLORS.Gray,
    borderRadius: wp(10),
  },
  tabIcon: {
    padding: wp(5),
    width: "50%",
    alignItems: "center",
    //paddingHorizontal: wp(width * 0.15),
    // borderWidth: 1,

    borderRadius: wp(10),
  },
  tabLabel: {
    fontSize: hp(18),
    fontWeight: "600",
    textAlignVertical: "center",
    marginVertical: wp(3),
  },
});
