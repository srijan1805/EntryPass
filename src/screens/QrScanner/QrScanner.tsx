import React, { useRef, useEffect, useState } from "react";
import { COLORS } from "../../constants/color";
import { RNCamera } from "react-native-camera";
import "react-native-gesture-handler";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
} from "react-native";
import {
  StackActions,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import { Buttons } from "../../components/Buttons";
import translation from "../../assets/translations/translate";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { loginAPIcall } from "../../utils/LoginAPI";
import { postVerifiedAddressAPI } from "../../utils/AddressNetworksAPI";
import {
  profileRetrieveData,
  otpStoreData,
  addressVerficationFacilityStoreData,
  addressVerficationFacilityRetrieveData,
  employeestoreData,
  employeeretrieveData,
} from "../../store/User/UserDetails";
import { hp, wp } from "../../utils/responsive-helper";
import LoaderView from "../../components/Loader";
import RNFetchBlob from "rn-fetch-blob";
import { FONTS } from "../../constants/font";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { uploadImage } from "../../utils/AuditAPI";
import NavigationHeader from "../../components/NavigationHeader";
import styles from "./styles";
import { GeoLocService } from "../../utils/geo-location";

const Scanner = (props) => {
  const navigation = useNavigation();
  let cameraRef = useRef(null);
  const [camType, setCam] = useState(RNCamera.Constants.Type.back);
  const [camText, setCamText] = useState(
    translation.LoginQrScan.Scan_your_employee_staff_card
  );
  const screenValType = props.route.params.screentype;
  const [isLoading, setisLoading] = useState(false);
  const [isScanned, setisScanned] = useState(false);
  const [LocStatus, setLocStatus] = useState(false);
  const [getID, setID] = useState(0);
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  let granted;

  useEffect(() => {
    if (screenValType === "loginscreen") {
      if (
        currentMarkerCordinates.latitude === 0 &&
        currentMarkerCordinates.longitude === 0
      ) {
        getOneTimeLocation();
      }
    }
    if (screenValType == "employeeScreen") {
      profileRetrieveData().then((response) => {
        setID(response.employeeId);
      });
      setLocStatus(true);
    }
  }, []);

  const requestLocationPermission = async () => {
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
          // setLocStatus(false);
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
          setLocStatus(false);
          Alert.alert(
            translation.AlertMessage.location_service,
            translation.AlertMessage.location_alert1,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => requestLocationPermission(),
              },
            ]
          );
        }
      } catch (err) {
        console.log(err);
        setLocStatus(false);
        Alert.alert(
          translation.AlertMessage.location_service,
          translation.AlertMessage.location_alert1,
          [
            {
              text: translation.Buttons_lable.Ok,
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      }
    }
  };

  const getOneTimeLocation = () => {
    setisLoading(true);
    setisScanned(true);
    const geoLocationMethod = GeoLocService;
    if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
    geoLocationMethod.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLocStatus(true);

        let initialRegion = {};
        initialRegion.latitude = position.coords.latitude;
        initialRegion.longitude = position.coords.longitude;
        initialRegion.latitudeDelta = 0.0922;
        initialRegion.longitudeDelta = 0.0421;

        setCurrentMarkerCordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setisLoading(false);
        setisScanned(false);
        // setLocStatus(false);
      },
      (error) => {
        setLocStatus(false);
        setisLoading(false);
        setisScanned(false);
        Alert.alert(
          translation.AlertMessage.location_service,
          translation.AlertMessage.location_alert1,
          [
            {
              text: translation.Buttons_lable.Ok,
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      },
      {
        enableHighAccuracy: true,
        accuracy: { android: "high", ios: "best" },
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  let ImageUri = "";
  const takePicture = async (e) => {
    if (isScanned === false) {
      setisScanned(true);
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      ImageUri = data.uri;

      let value = e.data.replace("http://", "");

      const splitedAarry = ImageUri.split("/");
      const FileName = splitedAarry[splitedAarry.length - 1];

      const realPath =
        Platform.OS === "ios" ? ImageUri.replace("file://", "") : ImageUri;

      let UploadData = [
        {
          name: "file",
          type: "image/png",
          filename: FileName,
          data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
        },
      ];
      if (LocStatus) {
        await uploadImage(UploadData)
          .then((resp) => {
            let downloadURI = JSON.parse(resp.data);
            console.log(downloadURI.result);
            qrcodeIDAPICall(
              value,
              currentMarkerCordinates.latitude,
              currentMarkerCordinates.longitude,
              downloadURI.result
            );
            setisScanned(true);
          })
          .catch((err) => {
            setisScanned(false);
            if (
              err !== "undefined" &&
              err.toString().includes("Network Error")
            ) {
              alert(translation.AddressVerification.oops_network_err_msg);
            }
          });
      } else {
        setLocStatus(false);
        Alert.alert(
          translation.AlertMessage.location_service,
          translation.AlertMessage.location_alert1,
          [
            {
              text: translation.Buttons_lable.Ok,
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      }
    } else {
      setisScanned(true);
    }
  };

  const flipCamera = () => {
    if (camType === RNCamera.Constants.Type.back) {
      setCam(RNCamera.Constants.Type.front);
      translation.LoginQrScan.Scan_your_employee_staff_card;
    } else {
      setCam(RNCamera.Constants.Type.back);
      translation.LoginQrScan.Scan_your_employee_staff_card;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.White }}>
      <LoaderView loading={isLoading} />

      <NavigationHeader
        title={translation.LoginQrScan.Scan_QR_Code}
        onPressCallBack={() => navigation.goBack()}
      />
      <View>
        {LocStatus && (
          <RNCamera
            style={styles.preview}
            ref={cameraRef}
            type={camType}
            onBarCodeRead={takePicture}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>{camText}</Text>
        <TouchableOpacity
          onPress={() => flipCamera()}
          style={styles.bottomView}
        >
          <Image
            source={require("../../assets/icons/Flip.png")}
            style={styles.bottomIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function qrcodeIDAPICall(tokenVal, lat, long, ImageName) {
    setisLoading(true);

    loginAPIcall
      .qRCodeApiPost(tokenVal, lat, long, ImageName)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          if (screenValType === "loginscreen") {
            setisScanned(true);
            let emplyeedata = {
              employeeId: tokenRes.data.result.employeeId,
              employeeName: tokenRes.data.result.employeeName,
              employeeQRCode: tokenRes.data.result.employeeQRCode,
              registrationType: "UserLogin",
              phoneNumber: tokenRes.data.result.phoneNumber,
            };

            employeestoreData(emplyeedata).then((tokenRes) => {
              employeeretrieveData().then((tokenval) => {
                verifyOtpTrigger(tokenval.employeeId);
              });
            });
          } else {
            setisScanned(true);
            let employeeData = {
              isFacilityVerfied: true,
              employeeId: tokenRes.data.result.employeeId,
              employeeName: tokenRes.data.result.employeeName,
              employeeQRCode: tokenRes.data.result.employeeQRCode,
            };

            loginAPIcall
              .VerifyEmpQR(employeeData.employeeQRCode.toUpperCase(), getID)
              .then((tokenRes) => {
                if (tokenRes.status === 200) {
                  let emplyeedataV = {
                    isFacilityVerfied: true,
                    facilityId: tokenRes.data.result.employeeID,
                  };

                  addressVerficationFacilityStoreData(emplyeedataV).then(() => {
                    addressVerficationFacilityRetrieveData().then((valG) => {});
                    setisLoading(false);
                    AsyncStorage.removeItem("ResidenceImage");
                    AsyncStorage.removeItem("ImageType");
                    navigation.navigate("AddressVerification", {
                      empID: tokenRes.data.result.employeeID,
                    });
                  });
                } else {
                  setisLoading(false);
                }
              })
              .catch((err) => {
                setisLoading(false);

                if (
                  err !== "undefined" &&
                  err.toString().includes("Network Error")
                ) {
                  alert(translation.EmployeeVerification.oops_network_err_msg);
                } else {
                  Alert.alert(
                    translation.AlertMessage.Alert,
                    translation.AlertMessage.enter_valid_id, //TODO Add translation
                    [{ text: translation.Buttons_lable.Ok, onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              });
          }
        } else {
          setisLoading(false);
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.no_info,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("500")) {
          Alert.alert(translation.AlertMessage.something_wrong);
        } else if (
          err !== "undefined" &&
          err.response.data.result.statusCode.toString().includes("403") &&
          err.response.data.result.errors
            .toString()
            .includes("Staff is Inactive")
        ) {
          Alert.alert(err.response.data.result.errors.toString());
        } else if (err !== "undefined" && err.toString().includes("404")) {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.enter_valid_id,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        } else if (
          err !== "undefined" &&
          err.toString().includes("403") &&
          err.response.data.result.errors
            .toString()
            .includes("User does not exist.")
        ) {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.no_info,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AddressVerification.oops_network_err_msg,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.no_info,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        }
      });
  }

  function onDeleteBTN() {
    setisScanned(false);
  }

  function verifyOtpTrigger(tokenVal) {
    const dataVal = {
      employeeId: tokenVal,
    };

    loginAPIcall
      .verifytiggerOtpApiPost(dataVal)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          let otpData = {
            employeeId: tokenVal,
            referenceId: tokenRes.data.result.referenceId,
            expiresAt: tokenRes.data.result.expiresAt,
            expiresAtDate: tokenRes.data.result.expiresAtDate,
            retryCount: tokenRes.data.result.retryCount,
            otpLength: tokenRes.data.result.otpLength,
          };

          otpStoreData(otpData).then(() => {
            setisLoading(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: "CodeVerification",
                    params: { Image: ImageUri },
                  },
                ],
              })
            );
          });
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("Network Error")) {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.network_alert,
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        }

        if (
          err !== "undefined" &&
          (err.toString().includes("403") || err.toString().includes("404"))
        ) {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.something_wrong1, //TODO Add translation
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            translation.AlertMessage.Alert,
            translation.AlertMessage.something_wrong1, //TODO Add translation
            [
              {
                text: translation.Buttons_lable.Ok,
                onPress: () => onDeleteBTN(),
              },
            ],
            { cancelable: false }
          );
        }
      });
  }
};

export default Scanner;
