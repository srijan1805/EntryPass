import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { employeeRoute, DownloadImage } from "../../utils/urls";
import { Buttons } from "../../components/Buttons";
import { FONTS } from "../../constants/font";
import { COLORS } from "../../constants/color";
import translation from "../../assets/translations/translate";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeleteresidenceImage } from "../../utils/AddressImageUploadAPI";
import * as Progress from "react-native-progress";
import { wp, hp } from "../../utils/responsive-helper";
import {
  employeestoreData,
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
} from "../../store/User/UserDetails";
import LoaderView from "../../components/Loader";
import { Config } from "./../../utils/Config";
import { color } from "react-native-reanimated";
import NavigationHeader from "../../components/NavigationHeader";

//import Config from 'react-native-config';
const BaseURL = Config.BASE_URL;

const CaptureResidenceImage = ({ isVerification, route }) => {
  //setI18nConfig('ch', false);
  const [verification, setVerification] = useState(true);
  const navigation = useNavigation();
  const [getImages, setimages] = useState("");
  const [getImageType, setimageType] = useState("");
  const [getCount, setcount] = useState(0);
  const [getBtnState, setBtnState] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [ValidateCordinates, setValidateCordinates] = useState({});

  let splitedAarry = [];
  let ImageTypeArray = [];
  let DATA = [];
  let ImageArrayDATA = [];

  const createAlert = (title, uri, id) => {
    if (title !== undefined && uri !== undefined) {
      Alert.alert(
        translation.AddressVerification.del_img,
        translation.AddressVerification.r_u_sure_del,
        [
          {
            text: translation.AddressVerification.Cancel,
            onPress: () => console.log("Cancel Pressed"),
          },
          {
            text: translation.AddressVerification.Yes,
            onPress: () => getItemData(title, uri, id),
          },
        ]
      );
    }
  };
  const getItemData = async (title, uri, id) => {
    setisLoading(true);
    try {
      if (splitedAarry.length > 0 && title !== undefined && uri !== undefined) {
        AsyncStorage.getItem("ResidenceImage")
          .then(async (resp) => {
            let UriArray = uri.split("=");
            let ImageName = UriArray[UriArray.length - 1];
            let ImageArray = resp.split(",");
            let finalarray = [];
            ImageArray.map((item) => {
              if (item !== ImageName) {
                finalarray.push(item);
              }
            });

            AsyncStorage.getItem("ImageType").then(async (resp) => {
              let Location = resp.split(",");
              let finalTypeArray = [];
              Location.splice(id, 1);
              Location.map((item) => {
                finalTypeArray.push(item);
              });

              await AsyncStorage.setItem("ImageType", finalTypeArray.join(","));
            });
            setcount(finalarray.length);
            await AsyncStorage.setItem("ResidenceImage", finalarray.join(","));
            setisLoading(false);
          })
          .catch((err) => {
            setisLoading(false);
            if (
              err !== "undefined" &&
              err.toString().includes("Network Error")
            ) {
              alert(translation.AddressVerification.oops_network_err_msg);
            } else {
              alert(err.toString());
            }
          });
      }
    } catch (err) {
      setisLoading(false);
      if (err !== "undefined" && err.toString().includes("Network Error")) {
        alert(translation.AddressVerification.oops_network_err_msg);
      } else {
        alert(err.toString());
      }
    }
  };

  useEffect(() => {
    profileRetrieveData().then((tokenval) => {
      setUserId(tokenval.employeeId);
      setVerification(isVerification);
      setcount(splitedAarry.length);
    });

    if (splitedAarry.length >= 4) {
      setBtnState(true);
    } else {
      setBtnState(false);
    }

    AsyncStorage.getItem("ResidenceLocation")
      .then((resp) => {
        setValidateCordinates(JSON.parse(resp));
      })
      .catch((err) => {
        console.log(err);
      });
    ///////////////////Image Store/////////////////////////
    AsyncStorage.getItem("ResidenceImage")
      .then((resp) => {
        setimages(resp);
      })
      .catch((err) => {
        console.log("error--->", err);
      });
    // AsyncStorage.removeItem('ResidenceImage');
    ////////////////////////////////////////////////////////

    /////////////////ImageType Store////////////////////////
    AsyncStorage.getItem("ImageType")
      .then((resp) => {
        setimageType(resp);
        // console.log('---imageType----', resp);
      })
      .catch((err) => {
        console.log("error--->", err);
      });
    // AsyncStorage.removeItem('ImageType');
    ////////////////////////////////////////////////////////
  });

  /////////////////Image Array//////////////////////////////
  if (getImages !== null) {
    splitedAarry = getImages.split(",");
    // console.log('----ImageArray---------', splitedAarry.length);
  }
  //////////////////////////////////////////////////////////

  ///////////////////ImageType Array///////////////////////
  if (getImageType !== null) {
    ImageTypeArray = getImageType.split(",");
    // console.log('----ImageType-----------', ImageTypeArray);
  }
  //////////////////////////////////////////////////////////

  for (let i = 0; i < splitedAarry.length; i++) {
    DATA.push({
      id: i,
      title: ImageTypeArray[i],
      uri: BaseURL + "Image/Download?fileName=" + splitedAarry[i],
    });
    ImageArrayDATA.push({
      type: ImageTypeArray[i],
      fileName: splitedAarry[i],
    });
  }

  const renderItem = ({ item }) => <Item title={item.title} uri={item.uri} />;

  const openCamera = () => {
    if (splitedAarry.length < 6) {
      navigation.navigate("AddressVerificationImageCapture");
    } else {
      alert(translation.AddressVerification.success_upload_img);
    }
  };
  const submit = () => {
    if (splitedAarry.length >= 4) {
      console.log("------cap----imagearray", ImageArrayDATA);

      navigation.navigate("AddressVerificationTextInput", {
        imagearraydata: ImageArrayDATA,
        Location: ValidateCordinates,
      });
    } else {
      alert(translation.AddressVerification.pls_upload_4_img);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => navigation.goBack()}
      />
      {/* <ScrollView style={styles.scrollView}> */}
      <View>
        <Text style={styles.cameraHeaderText}>
          {translation.AddressVerification.Capture_Residence_Image}
        </Text>
        <TouchableWithoutFeedback onPress={() => openCamera()}>
          <View style={styles.CameraContainer}>
            <Image
              source={require("../../assets/icons/Camera.png")}
              style={styles.cameraIcon}
            />
            <Text style={styles.cameraText}>
              {translation.AddressVerification.Click_to_capture_image}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.flatList}>
        <FlatList
          horizontal={true}
          data={DATA}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.uri }} style={styles.img} />
              <Text style={styles.title}>{item.title}</Text>
              <TouchableWithoutFeedback
                onPress={() => createAlert(item.title, item.uri, item.id)}
              >
                <Image
                  source={require("../../assets/images/close.png")}
                  style={styles.close}
                />
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View
        style={[
          styles.buttomContainer,
          { marginTop: DATA.length > 0 ? hp(5) : hp(180) },
        ]}
      >
        <View style={styles.textUpload}>
          <Text
            style={[
              styles.titleUpload,
              { color: DATA.length === 0 ? COLORS.White : COLORS.Red },
            ]}
          >
            {translation.AddressVerification.cap_4_img}
          </Text>
        </View>
        <View style={styles.textContainer}>
          {/* <Text style={styles.cameraText}>Progress</Text> */}
          <Text style={styles.progressText}>
            {translation.AddressVerification.Images}({getCount}/6)
          </Text>
        </View>
        <Buttons
          onPress={() => submit()}
          text={translation.AddressVerification.Submit}
          BTNstyle={{
            ...styles.buttonStyle,
            backgroundColor: getBtnState ? COLORS.Blue : COLORS.LightGrey,
          }}
          textStyle={{ ...styles.buttonTxt }}
          ImgStyle={undefined}
          loader={undefined}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    marginLeft: hp(24),
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
    marginTop: hp(34),
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
  cameraIcon: { height: hp(50), width: wp(57) },
  cameraText: {
    color: COLORS.DarkGrey,
    fontWeight: "400",
    fontSize: hp(16),
    fontFamily: FONTS.Urbanist,
  },
  textContainer: {
    // flexDirection: 'row',
    alignContent: "stretch",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginLeft: wp(24),
    marginRight: wp(24),
    // marginTop: hp(18),
    marginBottom: hp(4),
  },
  progressText: {
    color: COLORS.DarkGrey,
    fontWeight: "400",
    fontSize: wp(16),
    fontFamily: FONTS.Urbanist_Semibold,
    alignSelf: "flex-end",
  },
  progress: {
    alignContent: "center",
    alignSelf: "center",
  },
  buttonStyle: {
    // padding: 15,
    marginLeft: wp(24),
    marginRight: wp(24),
    marginBottom: hp(41),
    width: wp(326),
    height: hp(55),
    alignSelf: "center",
    borderRadius: wp(8),
    alignContent: "center",
    justifyContent: "center",
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Bold,
  },

  buttomContainer: {
    position: "relative",
    alignItems: "stretch",
    marginTop: hp(35),
  },
  item: {
    backgroundColor: COLORS.White,
    marginTop: hp(18),
    marginHorizontal: wp(8),
    // marginLeft: wp(24),
    height: hp(186),
    width: wp(180),
    borderRadius: wp(10),
    // marginRight: wp(24),
  },
  title: {
    color: COLORS.Black,
    fontSize: hp(12),
    textAlign: "center",
    position: "absolute",
    backgroundColor: COLORS.White,
    marginTop: hp(14),
    marginLeft: wp(12),
    padding: wp(4),
    borderRadius: wp(4),
    fontFamily: FONTS.Urbanist,
  },
  titleUpload: {
    color: COLORS.Red,
    fontSize: hp(18),
    textAlign: "center",
    fontFamily: FONTS.Urbanist,
  },
  img: {
    height: hp(186),
    width: wp(180),
    borderRadius: wp(10),
    marginRight: wp(24),
  },
  textUpload: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // marginTop: hp(10),
    marginBottom: hp(20),
    fontSize: hp(18),
    marginLeft: wp(72),
    marginRight: hp(72),
  },
  close: {
    position: "absolute",
    // backgroundColor: COLORS.White,
    marginTop: hp(16),
    borderRadius: wp(4),
    // alignSelf: 'flex-end',
    marginLeft: wp(153),
    tintColor: COLORS.White,
    marginRight: wp(100),
    height: hp(15),
    width: wp(15),
  },
  flatList: {
    marginLeft: wp(24),
    marginRight: wp(24),
  },
  scrollView: {
    // marginTop: hp(-40),
  },
});

export default CaptureResidenceImage;
