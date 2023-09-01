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
  AppState,
  Linking,
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
import Geolocation, {
  getCurrentPosition,
  PositionError,
} from "react-native-geolocation-service";
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

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 60; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function GpsAttendance(props) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  //state
  const [isLoading, setisLoading] = useState(true);
  const [getAddress, setAddress] = useState("");
  const [enable, setEnabled] = useState(false);
  const [pinLoc, setPinLoc] = useState(translation.AlertMessage.fetch_loc);
  const [currentMarkerCordinates, setCurrentMarkerCordinates] = useState({
    latitude: 1.390182259215,
    longitude: 103.8462119286,
  });

  //ref
  const markerRef = useRef();
  const mapView = useRef(null);

  const employeeID = props.route.params.emploID;
  let validateCordinates = {};

  Geocoder.init(
    Platform.OS === "ios" ? Config.GeoCode_API_Ios : Config.GeoCode_API_Android
  );

  useEffect(() => {
    if (isFocused) {
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
    validateCordinates = { latitude, longitude };

    // let AStore = await AsyncStorage.getItem('ResidenceLocation');
    await AsyncStorage.setItem(
      "ResidenceLocation",
      JSON.stringify(validateCordinates)
    );
    // setisLoading(false);
  };

  const getOneTimeLocation = () => {
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

      let AStore = await AsyncStorage.getItem("ResidenceLocation");
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
          // provider={
          //   Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          // }
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            longitude: 0,
            latitude: 0,
            longitudeDelta: 0.004,
            latitudeDelta: 0.009,
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
          showsUserLocation
          followsUserLocation
          onMapLoaded={() => {
            console.log("MPA LOADEDDD??");
            setEnabled(true);
            setisLoading(false);
          }}
        >
          <View style={styles.marker}>
            <MapMarker
              markerRef={markerRef}
              currentMarkerCordinates={currentMarkerCordinates}
              pinLoc={pinLoc}
            />
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
                  {getAddress.length === 0
                    ? translation.AlertMessage.fetch_loc
                    : getAddress}
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
              disabled={!enable}
            />
          </View>
        </View>
      </SafeAreaView>
      <LoaderView loading={isLoading} />
    </>
  );
}
