import { getPreciseDistance } from "geolib";
import Geolocation from "react-native-geolocation-service";

type gpsConfigObj = {
  latitude: string;
  longitude: string;
  range: number;
  remarks: string;
};

interface IcheckUserPerimeterProps {
  gpsConfigArray: Array<gpsConfigObj>;
}

export const checkUserPerimeter = async ({
  gpsConfigArray,
}: IcheckUserPerimeterProps) => {
  let currLoc: any = {},
    isUserNearByRange = false;
  return await Geolocation.getCurrentPosition(
    //Will give you the current location
    async (position) => {
      // console.log('I m inside ');
      currLoc.latitude = position.coords.latitude;
      currLoc.longitude = position.coords.longitude;
      // console.log("PLPLP", currLoc, gpsConfigArray);
      await gpsConfigArray.forEach((configLoc, index) => {
        const pdis = getPreciseDistance(currLoc, {
          latitude: configLoc.latitude,
          longitude: configLoc.longitude,
        });
        console.log("PLPLP", currLoc, pdis, pdis >= configLoc.range);
        if (pdis >= configLoc.range) {
          console.log("CALLEDD");
          isUserNearByRange = true;
        }
      });
      return isUserNearByRange;
    },
    (error) => {
      console.log("ERRR", error);
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
