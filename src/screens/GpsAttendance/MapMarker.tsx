import { StyleSheet, Text, View, Image } from "react-native";
import React, { memo, useEffect } from "react";
import { Marker, Callout } from "react-native-maps";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { wp, hp } from "../../utils/responsive-helper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface IProps {
  markerRef: any;
  currentMarkerCordinates: any;
  pinLoc: any;
}

const MapMarker: React.FC<IProps> = ({
  markerRef,
  currentMarkerCordinates,
  pinLoc,
}) => {
  return (
    <>
      <Marker
        ref={markerRef}
        key={`gps_attendance_marker`}
        coordinate={currentMarkerCordinates}
        tracksViewChanges={false}
      >
        <Icon name="map-marker" color={COLORS.Red} size={45} />
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
      </Marker>
    </>
  );
};

export default memo(MapMarker);

const styles = StyleSheet.create({});
