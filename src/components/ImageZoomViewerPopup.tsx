import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../constants/color";
import { hp, wp } from "../utils/responsive-helper";
import { FONTS } from "../constants/font";
import { Buttons } from "./Buttons";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import FastImage from "react-native-fast-image";
import ImageZoom from "react-native-image-pan-zoom";
import translation from "../assets/translations/translate";

interface ScreenProps {
  isImageViewer: boolean;
  closeZoomViewer: () => void;
  images: string;
}

const ImageZoomViewerPopup = ({
  isImageViewer,
  closeZoomViewer = () => {},
  images = "",
}: ScreenProps) => {
  const [isImageLoading, setImageLoading] = useState<boolean>(true);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <GestureRecognizer
          onSwipe={(direction, state) => {}}
          onSwipeUp={(state) => closeZoomViewer()}
          onSwipeDown={(state) => closeZoomViewer()}
          config={config}
          style={{
            flex: 1,
            backgroundColor: COLORS.White,
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={closeZoomViewer}
            style={styles.modalContainer}
          >
            <View style={styles.modalSubContainer}>
              <View style={styles.subView}>
                <ImageZoom
                  cropWidth={wp(350)}
                  cropHeight={hp(550)}
                  imageWidth={wp(350)}
                  imageHeight={hp(550)}
                >
                  <FastImage
                    style={styles.imageStyle}
                    source={{
                      uri: `${images}`,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadEnd={() => setImageLoading(false)}
                  />
                </ImageZoom>
                {isImageLoading && (
                  <ActivityIndicator
                    animating={isImageLoading}
                    style={styles.indicatorStyle}
                  />
                )}
                <View style={styles.rowView}>
                  <Buttons
                    text={translation.Attendance.close}
                    onPress={closeZoomViewer}
                    BTNstyle={styles.buttonStyle}
                    textStyle={styles.buttonText}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </GestureRecognizer>
      </SafeAreaView>
    </>
  );
};

export default ImageZoomViewerPopup;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.Black_Overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubContainer: {
    flex: 1,
    backgroundColor: COLORS.Black_Overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  subView: {
    backgroundColor: COLORS.White,
    padding: 10,
    borderRadius: 5,
  },
  imageStyle: {
    height: hp(550),
    width: wp(350),
  },
  indicatorStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.Black,
    paddingHorizontal: 20,
    paddingTop: 40,
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
  buttonStyle: {
    backgroundColor: COLORS.PurpleButton,
    borderRadius: hp(10),
    height: hp(48),
    width: wp(350),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(23),
    marginBottom: hp(23) - 10,
  },
  buttonText: {
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.White,
    textAlign: "center",
    fontSize: hp(16),
  },
});
