import React, { useState, useEffect, useRef } from "react";
import {
  View,
  useWindowDimensions,
  Platform,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableHighlight,
  PermissionsAndroid,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import MapView, {
  Marker,
  AnimatedRegion,
  Callout,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import Geolocation, {
  getCurrentPosition,
  PositionError,
} from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import AddressVerificationComponent from "../../components/AddressVerification";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import { color } from "react-native-reanimated";
import { profilepage_styles } from "../../utils/Styles";
import { current } from "@reduxjs/toolkit";

import { wp, hp } from "../../utils/responsive-helper";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import LoaderView from "../../components/Loader";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { getProfileDetailsAPI } from "../../utils/ProfileNetworkAPI";
import { getEmployeePostalCode } from "../../store/AddressHistory/AddressHistory";
import { useDispatch } from "react-redux";
import { Config } from "./../../utils/Config";
import { getPreciseDistance } from "geolib";
import NavigationHeader from "../../components/NavigationHeader";

const { width, height } = Dimensions.get("window");

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: hp(0),
    left: hp(0),
    right: hp(0),
    bottom: hp(0),
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  mapStyle: {
    //position: 'absolute',
    top: hp(0),
    left: hp(0),
    right: hp(0),
    bottom: hp(0),
    width: wp(375),
    height: hp(500),
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
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  bottomContainer: {
    height: hp(250),
    backgroundColor: COLORS.White,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    width: wp(375),
  },
  marker: {
    position: "absolute",
    top: Platform.OS === "ios" ? Dimensions.get("screen").height / 2 : hp(310),
    left: Platform.OS === "ios" ? Dimensions.get("screen").width / 2 : wp(165),
  },
});

export default function AddressVerification(props) {
  //setI18nConfig('ch', false);
  const mapView = useRef(null);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const [LocStatus, setLocStatus] = useState(false);
  const [getAddress, setAddress] = useState("");
  const [getPoastal, setPoastal] = useState("");
  const [getempPostal, setempPostal] = useState("");
  const [enable, setEnabled] = useState(true);
  const [mapProvider, setMapProvider] = useState(PROVIDER_DEFAULT);
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 1.390182259215,
    longitude: 103.8462119286,
  });
  const employeeID = props.route.params.empID;
  let granted;
  let validateCordinates = {};

  const closeDialog = () => {
    console.log("close ");
    navigation.goBack();
  };
  Geocoder.init(
    Platform.OS === "ios" ? Config.GeoCode_API_Ios : Config.GeoCode_API_Android
  );

  useEffect(() => {
    setAddress("Please wait fetching location...");
    if (Platform.OS === "ios") {
    }
    const interval = setInterval(() => {
      setisLoading(true);
    }, 200);
    clearInterval(interval);
    // setVerification(isVerification);
    //
    if (employeeID !== null) {
      getProfileDetailsAPI(employeeID).then((response) => {
        dispatch(getEmployeePostalCode(response.result.postalCode));
        setempPostal(response.result.postalCode);
        console.log(response.result.postalCode);
      });
    } else {
      profileRetrieveData().then((tokenval) => {
        dispatch(getEmployeePostalCode(tokenval.postalCode));
        setempPostal(tokenval.postalCode);
        console.log(tokenval.postalCode);
      });
    }
    requestLocationPermission();
    return () => {
      //Geolocation.clearWatch(watchID);
    };
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
          console.log("after calling getgjgj", granted);
          getOneTimeLocation();
          //subscribeLocationLocation();
        } else {
          //setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const storeLocation = async (latitude, longitude) => {
    validateCordinates = { latitude, longitude };
    console.log(validateCordinates);

    // let AStore = await AsyncStorage.getItem('ResidenceLocation');
    await AsyncStorage.setItem(
      "ResidenceLocation",
      JSON.stringify(validateCordinates)
    );
    setisLoading(false);
  };

  const getOneTimeLocation = () => {
    setisLoading(true);
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        // console.log('I m inside ');
        let initialRegion = {};
        initialRegion.latitude = position.coords.latitude;
        initialRegion.longitude = position.coords.longitude;
        initialRegion.latitudeDelta = 0.0922;
        initialRegion.longitudeDelta = 0.0421;

        setCurrentMarkerCordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        storeLocation(position.coords.latitude, position.coords.longitude);

        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then((json) => {
            var addressComponent = json.results[0].formatted_address;
            var PoastalComponent = json.results[0].address_components;
            setAddress(addressComponent);
            setPoastal(PoastalComponent[PoastalComponent.length - 1].long_name);
          })
          .catch((error) => console.log("geocofehbjhvjh---------", error));

        setisLoading(true);
        mapView.current !== null &&
          mapView.current.animateToRegion(initialRegion, 2000);
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

  const getNewLocation = async (e) => {
    setCurrentMarkerCordinates({
      latitude: e.latitude,
      longitude: e.longitude,
    });

    let AStore = await AsyncStorage.getItem("ResidenceLocation");
    const newLoc = JSON.parse(AStore);

    const pdis = getPreciseDistance(newLoc, e);

    if (pdis < 100) {
      setEnabled(true);
      Geocoder.from(e.latitude, e.longitude)
        .then((json) => {
          var addressComponent = json.results[0].formatted_address;
          var PoastalComponent = json.results[0].address_components;
          setAddress(addressComponent);
          setPoastal(PoastalComponent[PoastalComponent.length - 1].long_name);
        })
        .catch((error) => console.log("geocode---------", error));
    } else {
      setEnabled(false);
      setAddress(translation.AlertMessage.out_of_range);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <LoaderView loading={isLoading} />

      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => navigation.goBack()}
      />
      <MapView
        ref={mapView}
        style={styles.mapStyle}
        // provider={
        //   Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        // }
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 1.390182259215,
          longitude: 103.8462119286,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0421,
        }}
        zoomEnabled={true}
        zoomTapEnabled={true}
        // minZoomLevel={Platform.OS === "ios" ? 8 : 18}
        minZoomLevel={18}
        maxZoomLevel={20}
        onRegionChangeComplete={(e) => {
          getNewLocation(e);
        }}
        customMapStyle={[]}
        mapType="standard"
        onMapLoaded={() => {
          setEnabled(true);
        }}
      ></MapView>
      <View style={styles.marker}>
        <Marker
          coordinate={currentMarkerCordinates}
          onSelect={(e) => console.log(e)}
        >
          <Image
            source={require("../../assets/icons/Location1.png")}
            style={{
              height: wp(45),
              width: wp(45),
              tintColor: COLORS.Red,
            }}
            resizeMode="contain"
          />
        </Marker>
      </View>
      <View style={styles.bottomContainer}>
        <View>
          <View
            style={[
              profilepage_styles.locationContainer,
              { marginLeft: wp(30), marginRight: wp(10), marginTop: hp(15) },
            ]}
          >
            <Image
              style={profilepage_styles.profileImage}
              source={require("../../assets/icons/Location.png")}
            />
            <View style={profilepage_styles.profileTitleRow}>
              <Text
                numberOfLines={5}
                ellipsizeMode="tail"
                style={profilepage_styles.locationDetails}
              >
                {getAddress}
              </Text>
            </View>
          </View>
          <Buttons
            onPress={() => {
              if (LocStatus) {
                if (getPoastal === getempPostal) {
                  navigation.navigate("CaptureResidenceImage");
                } else if (getempPostal == null) {
                  Alert.alert(
                    translation.AlertMessage.location_alert_title,
                    translation.AlertMessage.no_previous_record
                  );
                } else {
                  Alert.alert(
                    translation.AlertMessage.location_alert_title,
                    translation.AlertMessage.outside_of_location
                  );
                }
              } else {
                Alert.alert(
                  translation.AlertMessage.location_service,
                  translation.AlertMessage.location_alert1,
                  [
                    {
                      text: translation.Buttons_lable.Cancel,
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: translation.Buttons_lable.Ok,
                      onPress: () => requestLocationPermission(),
                    },
                  ]
                );
              }
            }}
            text={translation.AddressVerification.continue}
            BTNstyle={{
              ...profilepage_styles.contButtonStyle,
              marginTop: hp(-5),
              backgroundColor: enable ? COLORS.Blue : COLORS.LightBlue,
            }}
            textStyle={profilepage_styles.contButtonTxt}
            ImgStyle={undefined}
            loader={undefined}
            disabled={!enable}
          />
          <Text style={profilepage_styles.instructions}>
            {translation.AddressVerification.wrong_location}
            <Text
              style={{ color: "blue", textDecorationLine: "underline" }}
              onPress={() => closeDialog()}
            >
              {translation.AddressVerification.try_again}
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
