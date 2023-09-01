import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radioGroupList } from "./radioGroupList.js";
import {
  TypeList,
  uploadResidenceImage1,
} from "../../utils/AddressImageUploadAPI";
import { UploadImage } from "../../utils/urls";
import RadioGroup from "react-native-custom-radio-group";
import RNFetchBlob from "rn-fetch-blob";
const { width, height } = Dimensions.get("window");
import { wp, hp } from "../../utils/responsive-helper";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  employeestoreData,
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
} from "../../store/User/UserDetails";
import AddressVerificationComponent from "../../components/AddressVerification";
import { getType } from "@reduxjs/toolkit";
import LoaderView from "../../components/Loader";
import { getDistance, getPreciseDistance } from "geolib";
import Geolocation, {
  getCurrentPosition,
  PositionError,
} from "react-native-geolocation-service";
import { PERMISSIONS, RESULTS } from "react-native-permissions";
import NavigationHeader from "../../components/NavigationHeader";

const UploadResidenceImage = ({ isVerification, route }) => {
  const [verification, setVerification] = useState(true);
  const [getDisable, setDiable] = useState(false);
  const navigation = useNavigation();
  const [getImgLoc, setImgLoc] = useState("");
  const [getImageType, setImageType] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [LocStatus, setLocStatus] = useState(false);
  const [getLocDiff, setLocDiff] = useState(0);
  const [getTypeList, setTypeList] = useState("");
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [getRadioList, setRadioList] = useState([]);
  const [ValidateCordinates, setValidateCordinates] = useState({});
  let granted;
  let pdis;
  let RList = [];
  let finalTypeArray = [];

  useEffect(() => {
    profileRetrieveData().then((tokenval) => {
      setUserId(tokenval.employeeId);
    });
    setVerification(isVerification);

    TypeList()
      .then((resp) => {
        setisLoading(true);
        console.log(JSON.stringify(resp.data.result));
        let Rdata = resp.data.result;
        Rdata.map((item) => {
          setisLoading(true);
          RList.push({
            label: item.imageTypeEnglish,
            value: item.imageTypeEnglish,
          });
          console.log("---------", RList);
          ImageTypeList();
        });
      })
      .catch((err) => {
        console.log(err);
      });

    try {
      getOneTimeLocation();
    } catch {
      alert(translation.AddressVerification.check_device_loc);
    }

    AsyncStorage.getItem("ResidenceLocation")
      .then((resp) => {
        setisLoading(true);
        setValidateCordinates(JSON.parse(resp));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function remove_duplicates(a, b) {
    setisLoading(true);
    for (var i = 0, len = a.length; i < len; i++) {
      for (var j = 0, len2 = b.length; j < len2; j++) {
        if (a[i].label === b[j].label) {
          b.splice(j, 1);
          len2 = b.length;
        }
      }
    }

    setisLoading(false);
  }

  const ImageTypeList = async () => {
    setisLoading(true);
    AsyncStorage.getItem("ImageType").then(async (resp) => {
      if (resp !== null) {
        let Location = resp.split(",");
        console.log("Location---->", Location);
        RList.map(async (loc) => {
          Location.map((item) => {
            if (loc.value === item) {
              finalTypeArray.push(loc);
            }
          });
        });
        remove_duplicates(finalTypeArray, RList);
        setRadioList(RList);
        setisLoading(false);
      } else {
        setRadioList(RList);
        setisLoading(false);
      }
    });
  };

  const requestLocationPermission = async () => {
    setDiable(false);
    if (Platform.OS === "ios") {
      //  getOneTimeLocation();
      //subscribeLocationLocation();
      try {
        granted = await request(
          Platform.select({
            // android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })
        );

        if (granted === RESULTS.GRANTED) {
          setLocStatus(true);
          //subscribeLocationLocation();
        } else {
          Alert.alert(translation.AddressVerification.enable_loc_permission);
        }
      } catch (err) {
        console.warn(err);
        Alert.alert(translation.AddressVerification.enable_loc_permission);
      }
      getOneTimeLocation();
    } else {
      try {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          setLocStatus(true);

          getOneTimeLocation();
          //subscribeLocationLocation();
        } else {
          //setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
        setDiable(false);
      }
    }
  };

  const getOneTimeLocation = () => {
    setisLoading(true);
    setLocStatus(true);
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        console.log("I m inside ");
        let initialRegion = {};
        initialRegion.latitude = position.coords.latitude;
        initialRegion.longitude = position.coords.longitude;
        initialRegion.latitudeDelta = 0.0922;
        initialRegion.longitudeDelta = 0.0421;
        console.log("lat " + position.coords.latitude);
        console.log("lon " + position.coords.longitude);
        // currentMarkerCordinates.latitude=position.coords.latitude;
        // currentMarkerCordinates.longitude=position.coords.longitude;
        //alert("current lat and log :(" + position.coords.latitude + "," + position.coords.longitude + ")");

        setCurrentMarkerCordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setisLoading(false);
      },
      (error) => {
        setLocStatus(false);
        setisLoading(false);
      },
      {
        enableHighAccuracy: true,
        accuracy: { android: "high", ios: "best" },
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 5,
      }
    );
  };

  const calculatePreciseDistance = () => {
    console.log(ValidateCordinates, " ", currentMarkerCordinates);
    pdis = getPreciseDistance(ValidateCordinates, currentMarkerCordinates);

    // alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };

  const uri = route.params.imgdata.uri;
  // console.log('uri--->', uri);
  const splitedAarry = uri.split("/");
  const FileName = splitedAarry[splitedAarry.length - 1];

  const realPath = Platform.OS === "ios" ? uri.replace("file://", "") : uri;

  let data = [
    {
      name: "file",
      type: "image/png",
      filename: FileName,
      data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
    },
  ];

  const openCamera = () => {
    navigation.navigate("AddressVerificationImageCapture");
  };

  const GetValue = (value) => {
    setImageType(value);
  };

  //console.log('----Imagetyp-----', getImageType);

  const UploadImageview = async () => {
    setDiable(true);

    calculatePreciseDistance();
    try {
      if (LocStatus) {
        if (getImageType != "") {
          if (pdis < 100) {
            setisLoading(true);
            await uploadResidenceImage1(data, userId, encodeURI(getImageType))
              .then(async (resp) => {
                setisLoading(false);

                let dataresponse = resp.data;

                let downloaruri = JSON.parse(dataresponse);

                ///////////////////////////////////Image Store/////////////////////////////////////////////////////////////
                let AStore = await AsyncStorage.getItem("ResidenceImage");
                // console.log('Astore', AStore);
                if (AStore) {
                  await AsyncStorage.setItem(
                    "ResidenceImage",
                    AStore + "," + downloaruri.result.fileName
                  );
                } else {
                  await AsyncStorage.setItem(
                    "ResidenceImage",
                    downloaruri.result.fileName
                  );
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                /////////////////////////////////////ImageType Store/////////////////////////////////////////////////////////
                let TypeStore = await AsyncStorage.getItem("ImageType");

                if (TypeStore) {
                  AsyncStorage.setItem(
                    "ImageType",
                    TypeStore + "," + getImageType
                  );
                } else {
                  AsyncStorage.setItem("ImageType", getImageType);
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                navigation.navigate("CaptureResidenceImage", {
                  imgName: downloaruri.result,
                });
              })
              .catch((err) => {
                setisLoading(false);
                setDiable(false);
                console.log("error--->", err);
                if (
                  (err !== "undefined" &&
                    err.toString().includes("Network Error")) ||
                  err.toString().includes("No address associated with hostname")
                ) {
                  alert(translation.AddressVerification.oops_network_err_msg);
                }
              });
          } else {
            Alert.alert(
              translation.AlertMessage.Alert,
              translation.AlertMessage.out_of_residency_limit,
              [
                {
                  text: translation.Buttons_lable.Ok,
                  onPress: () => openCamera(),
                },
              ]
            );
          }
        } else {
          alert(translation.AddressVerification.pls_sel_img_loc);
          setDiable(false);
          setisLoading(false);
        }
      } else {
        Alert.alert(
          translation.AlertMessage.Alert,
          translation.AlertMessage.location_alert1,
          [
            {
              text: translation.Buttons_lable.Cancel,
              onPress: () => setDiable(false),
              style: "cancel",
            },
            {
              text: translation.Buttons_lable.Ok,
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      }
    } catch (ex) {
      setDiable(false);
      setisLoading(false); //oops_err_msg
      Alert.alert(translation.AddressVerification.oops_err_msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />

      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => navigation.goBack()}
      />
      <Text style={styles.cameraHeaderText}>
        {translation.AddressVerification.Capture_Residence_Image}
      </Text>
      <TouchableWithoutFeedback>
        <View style={styles.CameraContainer}>
          <Image
            source={{ uri: route.params.imgdata.uri }}
            style={styles.ImageStyle}
          />
        </View>
      </TouchableWithoutFeedback>
      <View>
        <Text style={styles.RadioHeaderText}>
          {translation.AddressVerification.SelectLocation}
        </Text>
        {getRadioList.length > 0 ? (
          <RadioGroup
            containerStyle={styles.RadioContainer}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonContainerActiveStyle={styles.ActiveContainerStyle}
            buttonTextActiveStyle={styles.ActiveText}
            buttonContainerInactiveStyle={styles.InActiveContainerStyle}
            buttonTextInactiveStyle={styles.InActiveText}
            radioGroupList={getRadioList}
            // initialValue={'1'}
            onChange={(value) => GetValue(value)}
          />
        ) : (
          <View style={{ marginRight: wp(24) }}>
            <Text style={[styles.RadioHeaderText, { fontSize: hp(14) }]}>
              {
                "You have used all location tags, please continue with verification"
              }
              {/*TODO add translation*/}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttomContainer}>
        <Buttons
          disabled={getDisable}
          onPress={() => openCamera()}
          text={translation.AddressVerification.Back}
          BTNstyle={{ ...styles.buttonStyleBack }}
          textStyle={{ ...styles.buttonbackTxt }}
          ImgStyle={undefined}
          loader={undefined}
        />

        <Buttons
          disabled={getDisable}
          onPress={() => UploadImageview()}
          text={translation.AddressVerification.Continue}
          BTNstyle={{ ...styles.buttonStyleContinue }}
          textStyle={{ ...styles.buttonTxt }}
          ImgStyle={undefined}
          loader={undefined}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
    height: height,
  },
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
  CameraContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: wp(1),
    backgroundColor: COLORS.GreyAccent,
    borderColor: COLORS.GreyAccent,
    borderRadius: wp(8),
    marginLeft: wp(24),
    marginRight: wp(24),
    marginTop: hp(28),
    padding: 0,
    height: hp(189),
  },
  cameraHeaderText: {
    color: COLORS.DarkGrey,
    fontSize: hp(18),
    marginLeft: wp(24),
    marginTop: hp(16),
    fontFamily: FONTS.Urbanist_Semibold,
  },
  cameraText: {
    color: COLORS.DarkGrey,
    fontWeight: "400",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
  },
  buttonStyleContinue: {
    marginLeft: wp(15),
    marginRight: wp(24),
    width: wp(157),
    height: hp(55),
    justifyContent: "center",
    // alignSelf: 'flex-end',
    backgroundColor: COLORS.Blue,
    borderRadius: wp(8),
  },
  buttonStyleBack: {
    marginLeft: wp(23),
    marginRight: wp(15),
    width: wp(157),
    height: hp(55),
    justifyContent: "center",
    // alignSelf: 'flex-start',
    backgroundColor: COLORS.White,
    borderColor: COLORS.Blue,
    borderWidth: wp(1),
    borderRadius: wp(8),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },
  buttonbackTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },

  buttomContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    position: "absolute",
    bottom: hp(30),
    marginTop: hp(116),
    marginLeft: wp(24),
    marginRight: wp(24),
  },
  ImageStyle: {
    height: hp(189),
    width: wp(327),
    borderRadius: wp(8),
  },
  RadioHeaderText: {
    color: COLORS.DarkGrey,
    fontSize: hp(18),
    marginLeft: wp(24),
    marginTop: hp(16),
    marginBottom: hp(16),
    fontFamily: FONTS.Urbanist_Semibold,
  },
  RadioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: hp(60),
    marginLeft: wp(16),
    marginRight: wp(24),
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  buttonContainerStyle: {
    width: "auto",
    flexWrap: "wrap",
    height: hp(29),
    alignItems: "center",
    marginLeft: wp(8),
    // marginRight: wp(10),
    marginTop: hp(6),
    paddingTop: 0,
    paddingBottom: 0,
  },
  ActiveContainerStyle: {
    backgroundColor: COLORS.Yellow,
    borderColor: COLORS.Yellow,
  },
  ActiveText: {
    color: COLORS.Black,
    fontSize: hp(12),
    fontFamily: FONTS.Urbanist_Bold,
  },
  InActiveContainerStyle: {
    backgroundColor: COLORS.GrayLight,
    borderColor: COLORS.GrayLight,
  },
  InActiveText: {
    color: COLORS.Black,
    fontSize: hp(12),
    fontFamily: FONTS.Urbanist,
  },
});

export default UploadResidenceImage;
