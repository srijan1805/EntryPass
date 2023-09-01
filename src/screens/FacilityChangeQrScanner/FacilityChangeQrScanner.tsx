import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { RNCamera } from "react-native-camera";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { COLORS } from "../../constants/color";
import { hp, wp } from "../../utils/responsive-helper";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
  loginStoreData,
  retriveUserDefaultFacility,
} from "../../store/User/UserDetails";
import LoaderView from "../../components/Loader";
import { scannerAPIcall } from "../../utils";
import NavigationHeader from "../../components/NavigationHeader";
interface ScreenProps {
  route: any;
}

interface Defaultfac {
  facilityId?: number;
  facilityName?: string;
}

const FacilityChangeQrScanner = ({ route }: ScreenProps) => {
  let cameraRef = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isScanned, setisScanned] = useState<boolean>(false);
  const [defaultFac, setDefaultFac] = useState<Defaultfac>({});

  const params = route?.params;

  useEffect(() => {
    const getDefaultFac = async () => {
      const defaultFacRes = await retriveUserDefaultFacility();
      setDefaultFac(defaultFacRes);
    };

    getDefaultFac();

    // navigation.addListener("focus", () => {
    //   setisScanned(true);
    // });
    navigation.addListener("blur", () => {
      setisScanned(false);
    });

    return () => {
      // navigation.removeListener("focus", () => {
      //   setisScanned(true);
      // });
      navigation.removeListener("blur", () => {
        setisScanned(false);
      });
    };
  }, []);

  const onBarCodeRead = async (e: any) => {
    try {
      const check = e.data.substring(0, 4);
      let val = e.data.trim().replace("http://", "");
      if (!isLoading && !isScanned) {
        setisLoading(true);
        setisScanned(true);
        const empRes = await employeeretrieveData();
        const profileData = await profileRetrieveData();
        const qrCodeRes = await scannerAPIcall.facilityqRCodeApiGET(
          empRes.employeeId,
          val
        );

        if (qrCodeRes.status === 200 && qrCodeRes.data.result) {
          if (profileData.facilityId === qrCodeRes.data?.result?.facilityId) {
            Alert.alert(
              translation.AlertMessage.same_fac,
              translation.AlertMessage.same_fac_msg
            );
            setTimeout(() => {
              setisLoading(false);
              setisScanned(false);
            }, 1000);
          } else {
            let tempData = profileData;
            tempData.facilityId = qrCodeRes?.data?.result?.facilityId;
            tempData.facility = qrCodeRes?.data?.result?.facilityName;
            await profileStoreData(tempData);
            navigation.navigate("SuccessFacilityScreen", {
              facilitycomplete: true,
              scanType: "facility",
              name: qrCodeRes.data.result.facilityName,
              logo: qrCodeRes.data.result.facilityLogo,
              facilityId: qrCodeRes.data.result.facilityId,
              facilityName: qrCodeRes.data.result.facilityName,
              employeeId: tempData?.employeeId,
            });
            setTimeout(() => {
              setisLoading(false);
              setisScanned(false);
            }, 1000);
          }
          setTimeout(() => {
            setisLoading(false);
            setisScanned(false);
          }, 1000);
        }
      }
    } catch (error) {
      setisLoading(false);
      setisScanned(false);
      throw new Error(`ON BARCODE READ FAILED,${error}`);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.White }}>
        <NavigationHeader
          title={translation.Attendance.scan_qr_code}
          onPressCallBack={() => navigation.goBack()}
        />
        <View>
          {/* {isScanned ? ( */}
          <RNCamera
            style={styles.preview}
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={onBarCodeRead}
            detectedImageInEvent={true}
          />
          {/* ) : (
            <View />
          )} */}
        </View>
      </SafeAreaView>
      {isLoading && <LoaderView loading={isLoading} />}
    </>
  );
};

export default FacilityChangeQrScanner;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: hp(24),
    marginTop: hp(26),
    marginBottom: hp(26),
    alignItems: "center",
    height: hp(40),
  },
  back: {
    backgroundColor: COLORS.LightGrey,
    width: wp(44),
    height: wp(44),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: wp(25),
    height: wp(25),
    tintColor: COLORS.DarkGrey,
  },
  headerTitle: {
    fontSize: hp(24),
    marginLeft: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    alignItems: "center",
  },
  preview: {
    height: hp(630),
    borderRadius: hp(30),
    width: wp(375),
    justifyContent: "center",
  },
  bottomContainer: {
    backgroundColor: COLORS.White,
    height: hp(150),
    width: wp(375),
    position: "absolute",
    bottom: hp(0),
  },
  bottomIcon: {
    height: wp(42),
    width: wp(42),
    borderRadius: wp(10),
    alignSelf: "center",
  },
  bottomView: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: COLORS.LightGrey,
    width: wp(65),
    height: wp(65),
    borderRadius: wp(50),
  },
  bottomTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
    textAlignVertical: "center",
    alignSelf: "center",
    margin: wp(10),
    height: hp(30),
  },
});
