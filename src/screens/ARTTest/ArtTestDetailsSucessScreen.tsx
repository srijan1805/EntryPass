import React, { useState } from "react";
import { View, Image, Text, StyleSheet, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { Buttons } from "../../components/Buttons";
import { hp, wp } from "../../utils/responsive-helper";
import LoaderView from "../../components/Loader";
import { useDispatch } from "react-redux";
import {
  employeeretrieveData,
  profileStoreData,
  retriveUserDefaultFacility,
} from "../../store/User/UserDetails";
import { loginAPIcall } from "../../utils";
import { useEffect } from "react";
import SuccessAnimation from "../../components/SuccessAnimation";

const ArtTestDetailsSucessScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      profileDetials();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    setTimeout(() => {
      profileDetials();
    }, 2300);
  }, []);

  return (
    // <View style={styles.viewcontainer}>
    //   <LoaderView loading={isLoading} />
    //   <View
    //     style={[
    //       styles.imagebackgroundStyle,
    //       { backgroundColor: COLORS.Yellow },
    //     ]}
    //   >
    //     <Image
    //       style={styles.imageStyle}
    //       source={require("../../assets/images/tick.png")}
    //     />
    //   </View>
    //   <Text style={styles.textSytle}>
    //     {translate("ArtTest.test_report_successful", false)}
    //   </Text>

    //   <Buttons
    //     text={translate("ArtTest.backtohome", false)}
    //     onPress={() => {
    //       profileDetials();
    //     }}
    //     BTNstyle={styles.buttonBack1}
    //     textStyle={styles.textBack1}
    //     ImgStyle={undefined}
    //     loader={undefined}
    //   />
    // </View>

    <>
      <SuccessAnimation />
    </>
  );

  function profileDetials() {
    setisLoading(true);
    employeeretrieveData().then((tokenValr) => {
      let employeedIDVAl = tokenValr.employeeId;

      loginAPIcall
        .profileDetailGetAPI(employeedIDVAl)
        .then((tokenRes) => {
          retriveUserDefaultFacility().then((facResp) => {
            if (tokenRes.status === 200) {
              let profiledata = {
                employeeId: tokenRes.data.result.employeeID,
                empNameId: tokenRes.data.result.empNameId,
                employeeName: tokenRes.data.result.employeeName,
                contactNumber: tokenRes.data.result.contactNumber,
                emailID: tokenRes.data.result.emailID,
                qrPassCode: tokenRes.data.result.qrPassCode,
                facility: tokenRes.data.result.facility,
                facilityId: facResp?.facilityId,
                facilityLogo: facResp?.facilityLogo,
                doj: tokenRes.data.result.doj,
                role: tokenRes.data.result.role,
                isSpuervisor: tokenRes.data.result.isSpuervisor,
                hasNotification: tokenRes.data.result.hasNotification,
                supervisorName: tokenRes.data.result.supervisorName,
                isSupervisorVerfied: tokenRes.data.result.isSupervisorVerfied,
                isAddressPending: tokenRes.data.result.isAddressPending,
                shiftStartTime: tokenRes.data.result.shiftStartTime,
                shiftEndTime: tokenRes.data.result.shiftEndTime,
                clockIn: tokenRes.data.result.clockIn,
                clockOut: tokenRes.data.result.clockOut,
                isArtTestPending: tokenRes.data.result.isArtTestPending,
                isAllowedEmployeeMobileForOthers:
                  tokenRes.data.result.isAllowedEmployeeMobileForOthers,
                postalCode: tokenRes.data.result.postalCode,
                isAlowToWorkForOtherFailities:
                  tokenRes.data.result.isAlowToWorkForOtherFailities,
              };

              profileStoreData(profiledata).then((tokenRes) => {
                AsyncStorage.removeItem("ResidenceImage");
                AsyncStorage.removeItem("ImageType");
                setisLoading(false);
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
              });
            } else {
              setisLoading(false);
            }
          });
        })
        .catch((err) => {
          setisLoading(false);
        });
    });
  }
};

const styles = StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: COLORS.White,
    alignItems: "center",
    flexDirection: "column",
  },
  imagebackgroundStyle: {
    height: wp(186),
    width: wp(186),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
    resizeMode: "contain",
    borderRadius: wp(186),
  },
  imageStyle: {
    height: hp(37),
    width: wp(56),
    //marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },

  textSytle: {
    marginTop: hp(42),
    fontSize: wp(28),
    textAlign: "center",
    color: COLORS.Black,
    marginLeft: wp(20),
    marginRight: wp(20),
    fontFamily: FONTS.Urbanist_Bold,
  },

  buttonBack1: {
    backgroundColor: COLORS.Blue,
    borderRadius: wp(10),
    marginHorizontal: wp(25),
    width: wp(326),
    height: hp(54),
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: hp(40),
  },
  textBack1: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Bold,
  },
});

export default ArtTestDetailsSucessScreen;
