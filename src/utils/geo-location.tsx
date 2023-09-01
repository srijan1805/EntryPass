import { Platform } from "react-native";
import GeolocationService from "react-native-geolocation-service";
import Geolocation from "@react-native-community/geolocation";

export const GeoLocService =
  Platform.OS === "ios" ? Geolocation : GeolocationService;
