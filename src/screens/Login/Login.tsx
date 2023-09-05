import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from "react-native";
import {
  useNavigation,
  CommonActions,
  useIsFocused,
} from "@react-navigation/native";
import { GoogleSignin, statusCodes } from "react-native-google-signin";
import AzureAuth from "react-native-azure-auth";
import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import { socialNetworksAPI } from "../../utils";
import {
  googleLoginApi,
  loginAPIcall,
  microsoftOfficeLoginApi,
} from "../../utils/LoginAPI";
import Girl from "../../assets/images/Girl.svg";
import GoogleLogo from "../../assets/images/GoogleLogo.svg";
import MicrosoftLogo from "../../assets/images/MicrosoftLogo.svg";
import AppleLogo from "../../assets/images/AppleLogo.svg";
import Scan from "../../assets/images/Scan.svg";
import {
  employeestoreData,
  employeeretrieveData,
  loginStoreData,
  otpStoreData,
  otpRetrieveData,
} from "../../store/User/UserDetails";
import { wp, hp } from "../../utils/responsive-helper";
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
} from "@invertase/react-native-apple-authentication";
import messaging from "@react-native-firebase/messaging";
import { RootState } from "../../store";
const { width, height } = Dimensions.get("window");
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeId, setEmployeeId } from "../../store/User/User";
import LoaderView from "../../components/Loader";
import PopUpAlert from "../../components/PopupAlert";
import { Config } from "./../../utils/Config";
import {
  setEmployeeName,
  setNonUserDetails,
} from "../../store/User/DisabledUser";
import Geolocation, {
  getCurrentPosition,
  PositionError,
} from "react-native-geolocation-service";
import {
  PERMISSIONS,
  request,
  RESULTS,
  requestMultiple,
} from "react-native-permissions";
import { loginDetailsProps } from "../../utils/interface-helpers/common-interface";
import { getVersion } from "react-native-device-info";
import styles from "./styles";
import { GeoLocService } from "../../utils/geo-location";

//import Config from 'react-native-config';
const Google_Web_CLIENT_ID = Config.Google_Web_CLIENT_ID;
const Google_IOS_CLIENT_ID = Config.Google_IOS_CLIENT_ID;
const Microsoft_Web_CLIENT_ID = Config.Microsoft_Web_CLIENT_ID;
const Microsoft_Android_RedirectURL = Config.Microsoft_Android_RedirectURL;
const Microsoft_IOS_RedirectURL = Config.Microsoft_IOS_RedirectURL;
const Microsoft_scope = Config.Microsoft_scope;

const Login = ({ navigation, ...props }) => {
  // const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [ispopup, setisPopUp] = useState(false);
  const [LocStatus, setLocStatus] = useState(false);
  const [isSocialPopup, setIsSocialPopUp] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  let granted;

  // logindetails
  const [loginDetails, setLoginDetails] = useState<loginDetailsProps>({
    tokenVal: "",
    lat: "",
    long: "",
    loginType: 0,
    navigation: {},
    phoneNumber: "",
  });

  const ScanQr = () => {
    if (LocStatus) {
      navigation.navigate("QrScanner", { screentype: "loginscreen" });
    } else {
      Alert.alert(
        translation.AlertMessage.location_service,
        translation.AlertMessage.location_alert,
        [
          {
            text: translation.Buttons_lable.Ok,
            onPress: () => requestLocationPermission(),
          },
        ]
      );
    }
  };

  const tooglemodel = () => {
    setisPopUp(false);
  };

  useEffect(() => {
    setIsSocialPopUp(false);
    requestLocationPermission();
    registerAppWithFCM();
    requestUserPermission();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoginDetails({
        tokenVal: "",
        lat: "",
        long: "",
        loginType: 0,
        navigation: {},
        phoneNumber: "",
      });
      setUserName("");
    }
  }, [isFocused]);

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        granted = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ]);
        if (granted["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
          setLocStatus(true);
          getOneTimeLocation();
        } else {
          setLocStatus(false);
        }
      } else if (Platform.OS === "ios") {
        granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (granted === RESULTS.GRANTED) {
          getOneTimeLocation();
          setLocStatus(true);
        } else {
          setLocStatus(false);
          Alert.alert(translation.AddressVerification.enable_loc_permission);
        }
      }
    } catch (err) {
      setLocStatus(false);
      Alert.alert(translation.AddressVerification.enable_loc_permission);
    }
  };

  const getOneTimeLocation = () => {
    setisLoading(true);
    const geoLocationMethod = GeoLocService;
    if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
    geoLocationMethod.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLocStatus(true);
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
      }
    );
  };

  async function onAppleButtonPress() {
    if (LocStatus) {
      getOneTimeLocation();
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        //requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
      console.log(
        "UserStore::appleSignIn - user result is:",
        JSON.stringify(appleAuthRequestResponse, null, 2)
      );
      // get current authentication state for user
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        // user is authenticated
        const tempData = {
          email: "",
          name: "",
          userID: "",
          type: "",
          token: "",
          appId: "",
          mobilenumber: "",
          authcode: "",
        };

        appleAuthRequestResponse.email !== null
          ? (tempData.email = appleAuthRequestResponse.email)
          : (tempData.email = "");

        appleAuthRequestResponse.fullName.givenName !== null
          ? (tempData.name = appleAuthRequestResponse.fullName.givenName)
          : (tempData.name = "");

        tempData.userID = appleAuthRequestResponse.user;

        tempData.type = "apple";
        tempData.token = appleAuthRequestResponse.identityToken;
        tempData.appId = "APPLEID";
        tempData.mobilenumber = "";
        tempData.authcode = appleAuthRequestResponse.authorizationCode;

        setisLoading(true);
        setUserName(tempData.name === "" ? tempData.email : tempData.name);
        appleAPICALL(
          tempData,
          currentMarkerCordinates.latitude,
          currentMarkerCordinates.longitude
        );
      } else {
        Alert.alert(
          translation.AlertMessage.location_service,
          translation.AlertMessage.location_alert,
          [
            {
              text: translation.Buttons_lable.Ok,
              onPress: () => requestLocationPermission(),
            },
          ]
        );
      }
    } else {
      setisLoading(false);
      Alert.alert(translation.Login.failed_try_again);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{flexGrow: 1, paddingBottom: 16}}>
            <View style={styles.topLogoContainer}>
              <Image
                source={require("../../assets/icons/logo.png")}
                style={styles.topLogo}
              />
              <Text style={styles.topLogoText}>
                {translation.Login.SmartPass}
              </Text>
            </View>
            <KeyboardAvoidingView style={{flex: 1}}>
              <View style={styles.girlLogo}>
                <Girl width={226} height={161} />
              </View>
              <View style={styles.welcomeText}>
                <Text style={styles.welcome}>
                  {translation.Login.Hey_Welcome}
                </Text>
              </View>
              <View style={styles.empContainer}>
                <View style={styles.textField}>
                  <TextInput
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.placeHolderColor}
                    returnKeyType="next"
                    onEndEditing={() => {
                      setUserId(userId.trim().replace(/\s+/g, " "));
                    }}
                    editable
                    secureTextEntry={false}
                    value={userId}
                    placeholder={translation.Login.id}
                    onChangeText={(userId: any) => {
                      setUserId(userId);
                    }}
                    style={styles.inputField}
                  />
                </View>
                <TouchableOpacity onPress={() => ScanQr()}>
                  <View style={{ marginLeft: wp(22) }}>
                    <Scan width={60} height={35} />
                  </View>
                </TouchableOpacity>
              </View>
              <Buttons
                onPress={() => {
                  if (LocStatus) {
                    setisLoading(true);
                    getOneTimeLocation();
                    if (userId.trim().length !== 0 && LocStatus) {
                      setisLoading(true);
                      loginIDAPICall(
                        userId,
                        currentMarkerCordinates.latitude,
                        currentMarkerCordinates.longitude
                      );
                    } else {
                      setisLoading(false);
                      Alert.alert(translation.Login.pls_enter_corr_id);
                    }
                  } else {
                    Alert.alert(
                      translation.AlertMessage.location_service,
                      translation.AlertMessage.location_alert,
                      [
                        {
                          text: translation.Buttons_lable.Ok,
                          onPress: () => requestLocationPermission(),
                        },
                      ]
                    );
                  }
                }}
                text={translation.Login.Signin}
                BTNstyle={{ ...styles.buttonStyle }}
                textStyle={{ ...styles.buttonTxt }}
              />
              {/* <Text style={styles.or}>{translation.Login.or}</Text> */}
              {/* <TouchableOpacity
                style={{ marginTop: hp(0) }}
                onPress={async () => {
                  // console.log('url =----->', url);
                  if (LocStatus) {
                    getOneTimeLocation();
                    try {
                      /// **********Google Services***********************************

                      // GoogleSignin.configure();
                      GoogleSignin.configure({
                        webClientId: Google_Web_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
                        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                        // hostedDomain: '', // specifies a hosted domain restriction
                        // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
                        // accountName: '', // [Android] specifies an account name on the device that should be used
                        iosClientId: Google_IOS_CLIENT_ID, // [iOS] if
                      });

                      await GoogleSignin.hasPlayServices({
                        // Check if device has Google Play Services installed
                        // Always resolves to true on iOS
                        showPlayServicesUpdateDialog: true,
                      });

                      const userInfo = await GoogleSignin.signIn();
                      // cd setState({ userInfo: userInfo, loggedIn: true });
                      console.log("User Info --> ", userInfo);

                      setisLoading(true);
                      setUserName(userInfo.user.name);
                      await googleAPICall(
                        userInfo.serverAuthCode,
                        currentMarkerCordinates.latitude,
                        currentMarkerCordinates.longitude
                      );
                    } catch (error) {
                      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        setisLoading(false);
                        Alert.alert(translation.Login.need_per_proceed);
                        await GoogleSignin.signOut();
                      } else if (error.code === statusCodes.IN_PROGRESS) {
                        setisLoading(false);
                        Alert.alert(translation.Login.signing_in);
                      } else if (
                        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                      ) {
                        setisLoading(false);
                        Alert.alert(translation.Login.play_serv_not_available);
                      } else {
                        setisLoading(false);
                        Alert.alert(error.message);
                        await GoogleSignin.signOut();
                      }
                    }
                  } else {
                    Alert.alert(
                      translation.AlertMessage.location_service,
                      translation.AlertMessage.location_alert,
                      [
                        {
                          text: translation.Buttons_lable.Ok,
                          onPress: () => requestLocationPermission(),
                        },
                      ]
                    );
                  }
                }}
              >
                <View>
                  <View style={styles.socialSignin}>
                    <View style={styles.logoStyle}>
                      <GoogleLogo width={25} height={25} />
                    </View>
                    <Text style={styles.socialSigninText}>
                      {translation.Login.GoogleSignin}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                onPress={async () => {
                  if (LocStatus) {
                    getOneTimeLocation();
                    try {
                      const CLIENT_ID = Microsoft_Web_CLIENT_ID; // replace the string with YOUR

                      const azureAuth = new AzureAuth({
                        clientId: CLIENT_ID,
                        tenant: "common",
                        redirectUri:
                          Platform.OS === "ios"
                            ? Microsoft_IOS_RedirectURL
                            : Microsoft_Android_RedirectURL,
                      });

                      let tokens = await azureAuth.webAuth.authorize({
                        scope: Microsoft_scope,
                        prompt: "select_account",
                      });

                      let info = await azureAuth.auth.msGraphRequest({
                        token: tokens.accessToken,
                        path: "/me",
                      });

                      setUserName(tokens.userName);
                      setisLoading(true);
                      microsoftAPICALL(
                        tokens.userId,
                        currentMarkerCordinates.latitude,
                        currentMarkerCordinates.longitude
                      );
                    } catch (err) {
                      setisLoading(false);
                      Alert.alert(translation.Login.need_per_proceed);
                    }
                  } else {
                    Alert.alert(
                      translation.AlertMessage.location_service,
                      translation.AlertMessage.location_alert,
                      [
                        {
                          text: translation.Buttons_lable.Ok,
                          onPress: () => requestLocationPermission(),
                        },
                      ]
                    );
                  }
                }}
              >
                <View style={styles.socialSignin}>
                  <View style={styles.logoStyle}>
                    <MicrosoftLogo width={25} height={25} />
                  </View>

                  <Text style={styles.socialSigninText} numberOfLines={2}>
                    {translation.Login.MicrosoftSignin}
                  </Text>
                </View>
              </TouchableOpacity> */}

              {Platform.OS === "ios" ? (
                <TouchableOpacity onPress={() => onAppleButtonPress()}>
                  <View style={[styles.socialSignin, { overflow: "hidden" }]}>
                    <View style={styles.logoStyle}>
                      <AppleLogo width={25} height={25} />
                    </View>
                    <Text style={styles.socialSigninText}>
                      {translation.Login.AppleSignin}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </KeyboardAvoidingView>

            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, { marginTop: 5 }]}>
                {`${translation.Login.version} 1.0`}
              </Text>
            </View>
          </ScrollView>
          <PopUpAlert loading={ispopup} tooglemodel={tooglemodel} />

          {(() => {
            if (isSocialPopup) {
              dispatch(setEmployeeName(userName));
              dispatch(setNonUserDetails(loginDetails));
              navigation.navigate("DisabledDrawer");
              setIsSocialPopUp(false);
            }
          })()}
        </View>
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );

  async function googleAPICall(tokenVal, lat, long) {
    try {
      await googleLoginApi(tokenVal, lat, long, navigation);
    } catch (err) {
      setLoginDetails({
        tokenVal,
        lat,
        long,
        loginType: 3,
        navigation,
        phoneNumber: "",
      });
      setisLoading(false);
      setIsSocialPopUp(true);
      GoogleSignin.signOut();
      if (err !== "undefined" && err.toString().includes("500")) {
        Alert.alert(translation.AlertMessage.something_wrong);
      } else if (err !== "undefined" && err.toString().includes("404")) {
        alert(translation.Attendance.pls_try_again);
      } else if (
        err !== "undefined" &&
        err.toString().includes("Network Error")
      ) {
        alert(translation.AddressVerification.oops_network_err_msg);
      } else if (
        err !== "undefined" &&
        err?.response?.data?.result?.statusCode.toString().includes("403") &&
        err?.response?.data?.result?.errors
          .toString()
          .includes("Staff is Inactive")
      ) {
        Alert.alert(err?.response?.data?.result?.errors?.toString());
      } else if (err !== "undefined" && err.toString().includes("403")) {
        setIsSocialPopUp(true);
      } else {
        alert(translation.Login.plz_contact_admin);
      }
    }
  }

  async function microsoftAPICALL(tokenVal, lat, long) {
    try {
      return await microsoftOfficeLoginApi(tokenVal, lat, long, navigation);
    } catch (err: any) {
      setLoginDetails({
        tokenVal,
        lat,
        long,
        loginType: 3,
        navigation,
        phoneNumber: "",
      });

      setIsSocialPopUp(true);
      setisLoading(false);
      if (err !== "undefined" && err.toString().includes("500")) {
        // Alert.alert("Looks like there is an error.Please try again.");
        setIsSocialPopUp(true);
      } else if (err !== "undefined" && err.toString().includes("404")) {
        Alert.alert(translation.Login.forget_acc);
        // setisPopUp(true);
      } else if (
        err !== "undefined" &&
        err.toString().includes("Network Error")
      ) {
        alert(translation.AddressVerification.oops_network_err_msg);
      } else if (
        err !== "undefined" &&
        err?.response?.data?.result?.statusCode?.toString().includes("403") &&
        err?.response?.data?.result?.errors
          ?.toString()
          .includes("Staff is Inactive")
      ) {
        Alert.alert(err?.response?.data?.result?.errors.toString());
      } else if (err !== "undefined" && err.toString().includes("403")) {
        setIsSocialPopUp(true);
      } else {
        alert(translation.Login.plz_contact_admin);
      }
    }
  }

  function appleAPICALL(appleDetails, lat, long) {
    const appleData = {
      idToken: appleDetails.token,
      authCode: appleDetails.authcode,
    };

    socialNetworksAPI
      .appleApiGet(appleData, lat, long)
      .then((tokenRes) => {
        if (tokenRes.status === 200) {
          setisLoading(false);

          let emplyeedata = {
            employeeId: tokenRes.data.result.employeeId,
            employeeName: tokenRes.data.result.employeeName,
            employeeQRCode: tokenRes.data.result.employeeQRCode,
            registrationType: "Apple",
            phoneNumber: "",
          };

          employeestoreData(emplyeedata).then(() => {
            employeeretrieveData().then(() => {
              let registrationCompleted = {
                IsregistrationCompleted: false,
              };
              loginStoreData(registrationCompleted).then(() => {});
              setIsSocialPopUp(false);
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: "Registration",
                      params: {
                        scanType: "facility",
                        scancompete: false,
                        stepIndicatorval: 1,
                      },
                    },
                  ],
                })
              );
            });
          });
        } else {
          setIsSocialPopUp(true);
          setisLoading(false);
        }
      })
      .catch((err) => {
        setisLoading(false);
        setLoginDetails({
          tokenVal: appleDetails.token,
          lat,
          long,
          loginType: 3,
          navigation,
          phoneNumber: "",
        });
        setIsSocialPopUp(true);
        if (err !== "undefined" && err.toString().includes("500")) {
          Alert.alert(translation.AlertMessage.something_wrong);
        } else if (err !== "undefined" && err.toString().includes("404")) {
          alert(translation.Attendance.pls_try_again);
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else if (
          err !== "undefined" &&
          err.response.data.result.statusCode.toString().includes("403") &&
          err.response.data.result.errors
            .toString()
            .includes("Staff is Inactive")
        ) {
          Alert.alert(err.response.data.result.errors.toString());
        } else if (err !== "undefined" && err.toString().includes("403")) {
          setIsSocialPopUp(true);
        } else {
          alert(translation.Login.plz_contact_admin);
        }
      });
  }

  function loginIDAPICall(tokenVal, lat, long) {
    setisLoading(true);

    setLoginDetails({
      tokenVal,
      lat,
      long,
      loginType: 0,
      navigation,
      phoneNumber: "",
    });

    loginAPIcall
      .loginIdApiPost(tokenVal.toUpperCase(), lat, long)
      .then(async (tokenRes) => {
        setisLoading(true);

        if (tokenRes.status === 200) {
          let emplyeedata = {
            employeeId: tokenRes.data.result.employeeId,
            employeeName: tokenRes.data.result.employeeName,
            employeeQRCode: tokenRes.data.result.employeeQRCode,
            registrationType: "UserLogin",
            phoneNumber: tokenRes.data.result.phoneNumber,
          };

          employeestoreData(emplyeedata).then(() => {
            employeeretrieveData().then((tokenval) => {
              if (!tokenRes.data.result.phoneNumber) {
                setUserName(tokenRes.data.result.employeeQRCode);
                setisLoading(false);
                setIsSocialPopUp(true);
              } else {
                verifyOtpTrigger(tokenval.employeeId);
              }
              //setisLoading(false);
            });
          });
        } else {
          setisLoading(false);
          setisPopUp(true);
        }
      })
      .catch((err) => {
        setisLoading(false);
        if (err !== "undefined" && err.toString().includes("500")) {
          Alert.alert(translation.AlertMessage.something_wrong);
        } else if (err !== "undefined" && err.toString().includes("404")) {
          Alert.alert(translation.AlertMessage.enter_valid_id);
        } else if (
          err !== "undefined" &&
          err.response.data.result.statusCode.toString().includes("403") &&
          err.response.data.result.errors
            .toString()
            .includes("Staff is Inactive")
        ) {
          Alert.alert(err.response.data.result.errors.toString());
        } else if (
          err !== "undefined" &&
          err.toString().includes("Network Error")
        ) {
          alert(translation.AddressVerification.oops_network_err_msg);
        } else {
          setisPopUp(true);
        }
      });
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
            navigation.navigate("CodeVerification", { Image: null });
            //otpRetrieveData().then(() => {});
          });
        }
      })
      .catch((err) => {
        setisLoading(false);
        setIsSocialPopUp(true);
      });
  }
};

export default Login;
