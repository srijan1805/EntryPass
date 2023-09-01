import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import SuccessAnimation from "../../components/SuccessAnimation";
import { useNavigation, CommonActions } from "@react-navigation/native";

const VaccinationSuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: "MyDrawer",
            },
          ],
        })
      );
    }, 2300);
  }, []);

  return (
    <>
      <SuccessAnimation />
    </>
  );
};

export default VaccinationSuccessScreen;

const styles = StyleSheet.create({});
