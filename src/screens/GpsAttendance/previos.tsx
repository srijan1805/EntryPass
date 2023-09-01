import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
  Image,
  Text,
  Dimensions,
  Alert,
  Linking,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, {
  Marker,
  AnimatedRegion,
  Callout,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import Geocoder from "react-native-geocoding";
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
import { wp, hp } from "../../utils/responsive-helper";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import LoaderView from "../../components/Loader";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { getProfileDetailsAPI } from "../../utils/ProfileNetworkAPI";
import { getEmployeePostalCode } from "../../store/AddressHistory/AddressHistory";
import { useDispatch } from "react-redux";
import { Config } from "./../../utils/Config";
import { getPreciseDistance } from "geolib";
import { captureRef } from "react-native-view-shot";
import { fileResizer } from "../../utils/file-resizer/fileResizer";
import { useIsFocused } from "@react-navigation/native";
import { styles, mapStyle } from "./styles";
import NavigationHeader from "../../components/NavigationHeader";
import { GeoLocService } from "../../utils/geo-location";
import MapMarker from "./MapMarker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 60; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function GpsAttendance(props) {
  const employeeID = props.route.params.emploID;


  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  //state
  const [isLoading, setisLoading] = useState(false);
  const [getAddress, setAddress] = useState("");
  const [enable, setEnabled] = useState(false);
  const [pinLoc, setPinLoc] = useState(translation.AlertMessage.fetch_loc);
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 1.390182259215,
    longitude: 103.8462119286,
  });
  // const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState(null);

  //ref
  const markerRef = useRef();
  const mapView = useRef(null);

  useEffect(() => {
    if (isFocused) {
      setAddress("");
      setCurrentMarkerCordinates(null);
      setPinLoc(translation.AlertMessage.fetch_loc);
      setisLoading(true);
      setAddress(translation.AlertMessage.fetch_loc);
      if (employeeID !== null) {
        getProfileDetailsAPI(employeeID).then((response) => {
          dispatch(getEmployeePostalCode(response.result.postalCode));
        });
      } else {
        profileRetrieveData().then((tokenval) => {
          dispatch(getEmployeePostalCode(tokenval.postalCode));
        });
      }
      requestLocationPermission();
    }
  }, [isFocused]);

  useEffect(() => {
    const listener = AppState.addEventListener("change", async (status) => {
      if (status === "active") {
        await requestLocationPermission();
      }
    });

    return () => {
      listener.remove;
    };
  }, []);

  useEffect(() => {
    markerRef?.current?.showCallout();
  }, [getAddress, pinLoc]);

  const LOCPermissionAlert = () => {
    Alert.alert(
      translation.AlertMessage.Alert,
      translation.AddressVerification.enable_loc_permission,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => Linking.openSettings() },
      ]
    );
  };

  const requestLocationPermission = async () => {
    let granted: any;
    if (Platform.OS === "ios") {
      granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (granted === RESULTS.GRANTED) {
        return getOneTimeLocation();
      } else {
        return LOCPermissionAlert();
      }
    } else {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return getOneTimeLocation();
      } else {
        return LOCPermissionAlert();
      }
    }
  };

  const storeLocation = async (latitude, longitude) => {
    const validateCordinates = { latitude, longitude };
    await AsyncStorage.setItem(
      "ResidenceLocation",
      JSON.stringify(validateCordinates)
    );
  };

  const getOneTimeLocation = () => {
    setisLoading(true);
    const geoLocationMethod = GeoLocService;
    if (Platform.OS === "ios") geoLocationMethod.requestAuthorization();
    geoLocationMethod.getCurrentPosition(
      //Will give you the current location
      (position) => {
        console.log("I m inside ", position);
        let initialRegion: any = {};
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
            const addressComponent = json.results[0].formatted_address;
            setAddress(addressComponent);
            setPinLoc(addressComponent);
          })
          .catch((error) => {});
        setEnabled(true);
        setTimeout(() => {
          setisLoading(false);
        }, 1500);
        mapView.current !== null
          ? mapView.current.animateToRegion(initialRegion, 2000)
          : null;
        return;
      },
      (error) => {
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

  const getNewLocation = useCallback(
    async (e: any) => {
      setCurrentMarkerCordinates({
        latitude: e.latitude,
        longitude: e.longitude,
      });

      let AStore: any = await AsyncStorage.getItem("ResidenceLocation");
      const newLoc = JSON.parse(AStore);

      const pdis = getPreciseDistance(newLoc, e);

      const geoCodeResp = await Geocoder.from(e.latitude, e.longitude);
      var addressComponent = geoCodeResp.results[0].formatted_address;
      var PoastalComponent = geoCodeResp.results[0].address_components;
      setPinLoc(addressComponent);
      if (pdis < 100) {
        setEnabled(true);
        setAddress(addressComponent);
      } else {
        setEnabled(false);
        setAddress(translation.AlertMessage.out_of_range);
      }
      markerRef?.current?.showCallout();
      return;
    },
    [isFocused, getAddress, pinLoc]
  );

  const onContinuePress = async () => {
    if (getAddress.length > 0) {
      const uri = await captureRef(mapView, {
        format: "png",
        quality: 1,
      });
      const compressedImage = await fileResizer(uri);
      navigation.navigate("AttendancePreview", {
        isGpsAttendance: true,
        imgdata: {
          uri: Platform.OS === "ios" ? uri : compressedImage.uri,
        },
        gpsAddress: getAddress,
        type: props.route.params.type,
        IDs: employeeID,
        currentemployeeIDs: employeeID,
        facilityConfig: {
          isValidate: false,
          latitude: null,
          longitude: null,
        },
        gpsCoordinates: currentMarkerCordinates,
      });
    } else {
      Alert.alert("Location not found");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationHeader
          title={translation.Attendance.gps_attendance}
          onPressCallBack={() => navigation.goBack()}
        />

        <MapView
          ref={mapView}
          style={styles.mapStyle}
          loadingEnabled={true}
          // provider={
          //   Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          // }
          provider={PROVIDER_GOOGLE}
          // initialRegion={{
          //   longitude: 0,
          //   latitude: 0,
          //   longitudeDelta: 0.004,
          //   latitudeDelta: 0.009,
          // }}
          zoomEnabled={true}
          zoomTapEnabled={true}
          // minZoomLevel={Platform.OS === "ios" ? 8 : 18}
          minZoomLevel={18}
          maxZoomLevel={20}
          onRegionChangeComplete={(e) => {
            getNewLocation(e);
          }}
          customMapStyle={[]}
          showsUserLocation
          followsUserLocation
          userInterfaceStyle="light"
          onMapReady={() => {
            console.log("MAP IS LOADEDD");
          }}
        >
          <View style={styles.marker}>
            <MapMarker
              markerRef={markerRef}
              currentMarkerCordinates={currentMarkerCordinates}
              pinLoc={pinLoc}
            />

            {/* <Marker
              ref={markerRef}
              key={`gps_attendance_marker`}
              coordinate={currentMarkerCordinates}
              // tracksViewChanges={false}
            >
              <MaterialCommunityIconsx
                name="map-marker"
                color={COLORS.Red}
                size={45}
              />
              <Callout
                style={{
                  borderRadius: 5,
                  backgroundColor: COLORS.White,
                  width: wp(250),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Medium,
                    fontSize: hp(16),
                    color: COLORS.Black,
                  }}
                  numberOfLines={2}
                >
                  {pinLoc}
                </Text>
              </Callout>
            </Marker> */}
          </View>
        </MapView>

        <View style={styles.bottomContainer}>
          <View>
            <View
              style={[
                profilepage_styles.locationContainer,
                {
                  marginLeft: wp(30),
                  marginRight: wp(10),
                  marginTop: hp(40),
                },
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
              onPress={onContinuePress}
              text={translation.AddressVerification.continue}
              BTNstyle={{
                ...profilepage_styles.contButtonStyle,
                marginTop: hp(-5),
                backgroundColor: enable ? COLORS.Blue : COLORS.LightBlue,
              }}
              textStyle={profilepage_styles.contButtonTxt}
              ImgStyle={undefined}
              loader={undefined}
              disabled={!enable && currentMarkerCordinates !== null}
            />
          </View>
        </View>
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );
}
