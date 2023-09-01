import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import AddressVerification from "../../components/AddressVerification";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { Buttons } from "../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { getLastVerifiedAddress } from "../../store/AddressHistory/AddressHistory";
import LoaderView from "../../components/Loader";
import moment from "moment";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
} from "../../store/User/UserDetails";
import { hp, wp } from "../../utils/responsive-helper";
import { setLoading } from "../../store/Employee/Employee";
import { timeZonecheck } from "../../store/User/UserDetails";

const { width, height } = Dimensions.get("window");

const AddressVerificationHomeScreen = () => {
  const navigation = useNavigation();
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);

  const [isSupervisor, setIsSupervisor] = useState(false);
  const [
    isAllowedEmployeeMobileForOthers,
    setisAllowedEmployeeMobileForOthers,
  ] = useState(false);

  const [isExpired, setExpiration] = useState(false);
  const [lastVerifiedLocation, setLastVerifiedLocation] = useState({
    id: 0,
    employeeId: 0,
    contactNo: null,
    blockAndStreetName: "",
    floorAndUnitNumber: "",
    postalCode: 0,
    numberOfOccupant: 0,
    numberOfBathrooms: 0,
    numberOfBedrooms: 0,
    verifiedDate: "",
    verifiedTime: "",
    completedBy: "",
  });

  useEffect(() => {
    try {
      setLoading(true);
      setisLoading(true);
      employeeretrieveData().then((tokenval) => {
        profileRetrieveData().then((tokenval) => {
          setIsSupervisor(tokenval.isSpuervisor);
          setisAllowedEmployeeMobileForOthers(
            tokenval.isAllowedEmployeeMobileForOthers
          );
        });

        dispatch(getLastVerifiedAddress(tokenval.employeeId))
          .then((data: any) => {
            setLoading(false);
            setisLoading(false);

            if (data.payload != null) {
              let locationData = data.payload;
              // let date = data.payload.verifiedDate;
              let newDate = moment
                .utc(data.payload.verifiedDate)
                .local()
                .format("DD-MM-YYYY hh:mm A");
              const utcVerifiedDate = moment(data.payload.verifiedDate)
                .utc()
                .format("YYYY-MM-DDTHH:mm[Z]");

              setLastVerifiedLocation({
                ...lastVerifiedLocation,
                id: locationData.id,
                employeeId: locationData.employeeId,
                contactNo: locationData.contactNo,
                blockAndStreetName:
                  locationData.blockAndStreetName === ""
                    ? "No address found"
                    : locationData.blockAndStreetName,
                floorAndUnitNumber:
                  locationData.floorAndUnitNumber === ""
                    ? ""
                    : locationData.floorAndUnitNumber,
                postalCode:
                  locationData.postalCode === 0 ? "" : locationData.postalCode,
                numberOfOccupant: locationData.numberOfOccupant,
                numberOfBathrooms: locationData.numberOfBathrooms,
                numberOfBedrooms: locationData.numberOfBedrooms,
                verifiedDate: moment(utcVerifiedDate)
                  .local()
                  .format("DD-MM-YYYY"),
                verifiedTime: moment(utcVerifiedDate).local().format("hh:mm A"),
                completedBy: locationData.completedBy,
              });

              setExpiration(true);
            } else {
              setLoading(false);
              setisLoading(false);
              setLastVerifiedLocation({});
              setExpiration(true);
              // lastVerifiedLocation == [];
            }
          })
          .catch((error) => {
            setLoading(false);
            setisLoading(false);
            if (
              error !== "undefined" &&
              error.toString().includes("Network Error")
            ) {
              alert(translation.AddressVerification.oops_network_err_msg);
            }
          });
      });
    } catch (ex) {
      setLoading(false);
      setisLoading(false);
      Alert.alert(translation.AddressVerification.pls_check_nw);
    }
  }, []);

  const fetchLatestLocation = () => {
    return (
      <View>
        <Text style={styles.title}>
          {translation.AddressVerification.LastVerifiedLocation}
        </Text>
        <View style={styles.locationContainer}>
          <Image
            style={styles.icons}
            source={require("../../assets/icons/Location.png")}
          />
          <Text style={styles.text}>
            {lastVerifiedLocation.blockAndStreetName +
              ", \n" +
              lastVerifiedLocation.floorAndUnitNumber +
              "," +
              lastVerifiedLocation.postalCode}
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Image
            style={styles.icons}
            source={require("../../assets/icons/Calendar.png")}
          />
          <Text style={styles.text}>
            {lastVerifiedLocation.verifiedDate +
              ", \n" +
              lastVerifiedLocation.verifiedTime}
          </Text>
        </View>
      </View>
    );
  };

  const noLocation = () => {
    return (
      <View>
        <Text style={styles.title}>
          {translation.AddressVerification.no_lst_verified_loc}
        </Text>
        <View style={styles.locationContainer}>
          <Text style={styles.text}>
            {translation.AddressVerification.could_not_find_last_address}
          </Text>
        </View>
      </View>
    );
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem("ResidenceImage");
      await AsyncStorage.removeItem("ImageType");
      await AsyncStorage.removeItem("ResidenceLocation");
      return "SUCCESS";
    } catch (error) {
      throw new Error(`CLEAR STORGE FAILED,${error}`);
    }
  };

  const onPressStart = async () => {
    try {
      await clearStorage();
      navigation.navigate("AddressVerification", {
        Supervisor: null,
        empID: null,
      });
    } catch (error) {
      console.log("ERRRORR", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <ScrollView style={styles.marginBottom}>
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="contain"
          source={require("../../assets/images/Address-Verify.png")}
        />
        {lastVerifiedLocation === null || lastVerifiedLocation.id == null
          ? noLocation()
          : fetchLatestLocation()}
        {isExpired ? (
          <Buttons
            onPress={onPressStart}
            text={translation.AddressVerification.start}
            BTNstyle={{ ...styles.buttonStyle }}
            textStyle={{ ...styles.buttonTxt }}
            ImgStyle={undefined}
            loader={undefined}
          />
        ) : (
          <Buttons
            onPress={() => {}}
            text={translation.AddressVerification.start}
            BTNstyle={{
              ...styles.buttonStyle,
              backgroundColor: COLORS.GrayLight,
            }}
            textStyle={{ ...styles.buttonTxt }}
            ImgStyle={undefined}
            loader={undefined}
            disabled={true}
          />
        )}

        {isSupervisor && isAllowedEmployeeMobileForOthers ? (
          <Buttons
            onPress={() => {
              navigation.navigate("EmployeeVerification", { Supervisor: true });
            }}
            text={translation.AddressVerification.VerificationForOthers}
            BTNstyle={{
              ...styles.SuperbuttonStyle,
              backgroundColor: COLORS.Yellow,
            }}
            textStyle={{ ...styles.buttonTxt, color: COLORS.Black }}
            ImgStyle={undefined}
            loader={undefined}
          />
        ) : (
          <View />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  imageBackground: {
    flex: 1,
    alignSelf: "center",
    width: wp(182),
    height: hp(116),
    marginTop: hp(45),
  },
  locationContainer: {
    margin: 8,
    padding: 5,
  },
  title: {
    fontSize: hp(22),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.DarkGrey,
    textAlign: "center",
    marginTop: hp(35),
  },
  text: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
    textAlign: "center",
  },
  icons: {
    alignSelf: "center",
    height: hp(24),
    width: wp(24),
    marginBottom: hp(8),
    resizeMode: "contain",
    tintColor: COLORS.Blue,
  },
  buttonStyle: {
    width: wp(326),
    height: hp(60),
    alignSelf: "center",
    backgroundColor: COLORS.Blue,
    marginTop: hp(60),
    borderRadius: wp(10),
    justifyContent: "center",
  },
  SuperbuttonStyle: {
    width: wp(326),
    height: hp(60),
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: COLORS.Blue,
    marginTop: hp(20),
    borderRadius: wp(10),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },
  marginBottom: {
    marginBottom: hp(10),
  },
});

export default AddressVerificationHomeScreen;
