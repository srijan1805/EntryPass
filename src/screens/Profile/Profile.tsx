import React, { useState, Component, useRef, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import translation from "../../assets/translations/translate";
import {
  useNavigation,
  CommonActions,
  useIsFocused,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Buttons } from "../../components/Buttons";
import {
  checkShiftRemainder,
  getProfileDetails,
  logout,
} from "../../store/Profile/Profile";
import {
  profileRetrieveData,
  employeeretrieveData,
  googlesignOut,
  microsoftLogout,
  appleLogout,
  clearingLogoutData,
} from "../../store/User/UserDetails";
import LoaderView from "../../components/Loader";
import {
  enableShiftRemainderAPI,
  getProfileDetailsAPI,
  postLogoutAPI,
  profileDeleteAPI,
  uploadProfileImageAPI,
} from "../../utils/ProfileNetworkAPI";
import { hp, wp } from "../../utils/responsive-helper";
import { StylesContext } from "@material-ui/styles";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { color } from "react-native-reanimated";
import { tokenRetrieveData } from "../../store/User/UserDetails";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import DeleteUserAlertPopup from "../../components/DeleteUserAlertPopup";
import { appLogout } from "../../utils/AppLogout";
import { fileResizer } from "../../utils/file-resizer/fileResizer";
import RNFetchBlob from "rn-fetch-blob";
import { uploadAttendanceImage } from "../../utils/AttendenceQrAPI";
import { Config } from "./../../utils/Config";
import { fetchReportingStaff } from "../../utils/ReportingStaffAPI";
import ImagePickerPopup from "../../components/ImagePickerPopup";
import styles from "./styles";
import { MainNavigationHeader } from "../../components/NavigationHeader";

const BaseURL = Config.BASE_URL;

interface INotifyData {
  active: boolean;
  notification: string;
  notificationId: string | number;
}

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );
  const isShiftRemainderEnabled = useSelector(
    (state: RootState) => state.profileState.isShiftRemainderEnabled
  );

  const [isLoading, setisLoading] = useState(false);
  const [isVerifiedBySupervisor, setIsVerifiedBySuper] = useState(false);

  const [notifRemainder, setNotifRemainder] = useState(isShiftRemainderEnabled);
  const [notificationData, setNotificationData] = useState<Array<INotifyData>>(
    []
  );
  const [reportingStaffData, setReportingStaffData] = useState([]);

  const [isDeleteUserAlert, setDeleteUserAlert] = useState<boolean>(false);
  const [regFac, setRegFac] = useState<string>("");
  const [isImagePickerPopup, setImagePickerPopup] = useState<boolean>(false);

  useEffect(() => {
    setisLoading(true);
    profileRetrieveData().then((tokenval) => {
     
      setIsVerifiedBySuper(tokenval.isSupervisorVerfied);
      setRegFac(tokenval.facility);
      dispatch(getProfileDetails(tokenval.employeeId))
        .then(async (data: any) => {
          setisLoading(false);
        })
        .catch((error) => {
          console.log("Error");
          if (
            error !== "undefined" &&
            error.toString().includes("Network Error")
          ) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    });
  }, []);

  useEffect(() => {
    dispatch(checkShiftRemainder(`${profileDetails.employeeID}`))
      .then(async (res: any) => {
        setNotifRemainder(res.payload[0]?.active);
        setNotificationData(res.payload);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const getReportingStaff = async () => {
      setisLoading(true);
      const responce = await fetchReportingStaff(
        profileDetails.employeeID.toString()
      );
      setReportingStaffData(responce);
      setisLoading(false);
    };

    getReportingStaff();
  }, [isFocused]);

  const onCheckBoxPress = async (val: boolean) => {
    try {
      setisLoading(true);
      let data = {
        EmployeeId: `${profileDetails.employeeID}`,
        NotificationId: notificationData[0].notificationId,
        Active: val,
      };
      await enableShiftRemainderAPI(data, `${profileDetails.employeeID}`);
      setNotifRemainder(val);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      throw new Error(`ENABLE SHIFT REMAINDER API FAILED, ${error}`);
    }
  };

  const onLogout = async () => {
    try {
      setDeleteUserAlert(false);
      setisLoading(true);
      await appLogout(profileDetails.employeeID.toString(), navigation);
    } catch (error) {
      setisLoading(false);
    }
  };

  const onSuccessCallBack = (uri: any) => {
    setImagePickerPopup(false);
    uploadImage(uri);
  };

  const uploadImage = async (uri: any) => {
    try {
      setisLoading(true);
      const compressedImage = await fileResizer(uri);
      const splitedAarry = compressedImage.uri.split("/");
      const FileName = splitedAarry[splitedAarry.length - 1];
      const realPath =
        Platform.OS === "ios"
          ? compressedImage.uri.replace("file://", "")
          : compressedImage.uri;

      const azuredata = [
        {
          name: "file",
          type: "image/png",
          filename: FileName,
          data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
        },
      ];

      const azureUploadResp = await uploadAttendanceImage(azuredata);
      const uploadImagedata = {
        ImageUrl: `${Config.AzureBlob_Image_Url}${
          JSON.parse(azureUploadResp.data).result
        }`,
      };
      const resp = await uploadProfileImageAPI(
        profileDetails.employeeID.toString(),
        uploadImagedata
      );
      await dispatch(getProfileDetails(profileDetails.employeeID));
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      throw new Error(`UPLOAD IMAGE FAILED, ${error}`);
    }
  };

  const hasProfileImage = profileDetails.imageUrl
    ? { height: hp(75), width: hp(75), borderRadius: hp(75) / 2 }
    : { height: hp(35), width: hp(35) };

  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <MainNavigationHeader navigation={navigation} isDisabled={false} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: hp(20),
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.Black,
                  opacity: 1,
                  height: hp(75),
                  width: hp(75),
                  borderRadius: hp(75) / 2,
                  shadowColor: COLORS.Black,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={() => setImagePickerPopup(true)}>
                  <ImageBackground
                    source={
                      profileDetails.imageUrl
                        ? {
                            uri: profileDetails.imageUrl,
                          }
                        : require("../../assets/icons/add-photo.png")
                    }
                    style={{
                      ...hasProfileImage,
                    }}
                    borderRadius={profileDetails.imageUrl ? hp(75) / 2 : 0}
                    resizeMode="cover"
                  >
                    {profileDetails.imageUrl ? (
                      <View
                        style={{
                          height: hp(75),
                          width: hp(75),
                          borderRadius: hp(75) / 2,
                          backgroundColor: COLORS.Black,
                          opacity: 0.6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../../assets/icons/add-photo.png")}
                          style={{
                            height: hp(35),
                            width: hp(35),
                            resizeMode: "cover",
                          }}
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.Urbanist_Bold,
                  fontSize: hp(18),
                  color: COLORS.Black,
                }}
              >
                {profileDetails.employeeName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "75%",
                marginBottom: hp(16),
                backgroundColor: COLORS.White,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Bold,
                    fontSize: hp(14),
                    paddingVertical: 5,
                    color: COLORS.BlackDark,
                  }}
                >
                  {profileDetails.empNameId}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Medium,
                    fontSize: hp(14),
                    color: COLORS.Gray,
                  }}
                >
                  {translation.Profile.employee_no.slice(
                    0,
                    translation.Profile.employee_no.length - 1
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() =>
                  navigation.navigate("ReportingStaffScreen", {
                    staffData: reportingStaffData,
                  })
                }
              >
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Bold,
                    fontSize: hp(14),
                    paddingVertical: 5,
                    color: COLORS.BlackDark,
                  }}
                >
                  {reportingStaffData.length}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.Urbanist_Medium,
                    fontSize: hp(14),
                    color: COLORS.Gray,
                  }}
                >
                  {translation.Reporting_Staff.Reporting_Staff}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View>
            <View style={styles.containerRow}>
              <Text style={styles.textLeft}>
                {translation.Profile.actual_fac}
              </Text>
              <View style={styles.textContainer}>
                {profileDetails.facility === null ? (
                  <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                    {translation.Profile.actual_fac}
                  </Text>
                ) : (
                  <Text style={styles.text}>{profileDetails.facility}</Text>
                )}
              </View>
            </View>
            <View style={styles.containerRow}>
              <Text style={styles.textLeft}>{translation.Profile.reg_fac}</Text>
              <View style={styles.textContainer}>
                {profileDetails.facility === null ? (
                  <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                    {translation.Profile.facility}
                  </Text>
                ) : (
                  <Text style={styles.text}>{regFac}</Text>
                )}
              </View>
            </View>
            <Buttons
              onPress={onLogout}
              text={translation.Profile.change_facility}
              BTNstyle={styles.buttonStyle}
              textStyle={styles.buttonTxt}
              ImgStyle={undefined}
              loader={undefined}
            />
          </View>
          <View style={styles.divider} />
          <View>
            <View
              style={[
                styles.containerRow,
                { flexDirection: "row", justifyContent: "flex-start" },
              ]}
            >
              <Text style={styles.textLeft}>
                {translation.Profile.supervisor}
              </Text>
              <View
                style={[
                  styles.textContainer,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                {profileDetails.supervisorName === null ? (
                  <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                    {translation.Profile.supervisor_Name}
                  </Text>
                ) : (
                  <Text style={styles.text}>
                    {profileDetails.supervisorName}
                  </Text>
                )}
                <Image
                  source={
                    isVerifiedBySupervisor
                      ? require("../../assets/icons/Checked-Green.png")
                      : require("../../assets/icons/PendingProfile.png")
                  }
                  style={styles.pending}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                disabled={isVerifiedBySupervisor}
                style={[
                  styles.buttonStyle,
                  {
                    backgroundColor: isVerifiedBySupervisor
                      ? COLORS.LightYellow
                      : COLORS.Yellow,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("ScanQRcodesupervisor", {
                    scanType: "supervisor",
                  })
                }
              >
                <Text
                  style={[
                    styles.buttonTxt,
                    {
                      color: isVerifiedBySupervisor
                        ? COLORS.Gray
                        : COLORS.Black,
                    },
                  ]}
                >
                  {translation.Profile.update}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.containerRow}>
            <Text style={styles.textLeft}>{translation.Profile.join_date}</Text>
            <View style={styles.textContainer}>
              {profileDetails.doj === null ? (
                <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                  {translation.Profile.join_date}
                </Text>
              ) : (
                <Text style={styles.text}>{profileDetails.doj}</Text>
              )}
            </View>
          </View>

          <View style={styles.containerRow}>
            <Text style={styles.textLeft}>{translation.Profile.job_role}</Text>
            <View style={styles.textContainer}>
              {profileDetails.role === null ? (
                <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                  {translation.Profile.job_role}
                </Text>
              ) : (
                <Text style={styles.text}>{profileDetails.role}</Text>
              )}
            </View>
          </View>

          <View style={styles.containerRow}>
            <Text style={styles.textLeft}>{translation.Profile.email}</Text>
            <View style={styles.textContainer}>
              {profileDetails.emailID === "" ? (
                <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                  {translation.Profile.email}
                </Text>
              ) : (
                <Text style={styles.text}>{profileDetails.emailID}</Text>
              )}
            </View>
          </View>

          <View style={styles.containerRow}>
            <Text style={styles.textLeft}>{translation.Profile.phone}</Text>
            <View style={styles.textContainer}>
              {profileDetails.contactNumber === "" ? (
                <Text style={[styles.text, { color: COLORS.LightGrey }]}>
                  {translation.Profile.phone}
                </Text>
              ) : (
                <Text style={styles.text}>{profileDetails.contactNumber}</Text>
              )}
            </View>
          </View>

          {notificationData.length > 0 && (
            <View style={{ marginLeft: wp(24), marginVertical: wp(24) }}>
              <Text
                style={{
                  fontSize: wp(18),
                  color: COLORS.DarkGrey,
                  fontFamily: FONTS.Urbanist_Bold,
                }}
              >
                {translation.Profile.notif}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: wp(327),
                }}
              >
                <Text
                  style={{
                    fontSize: wp(16),
                    color: COLORS.DarkGrey,
                    fontFamily: FONTS.Urbanist,
                    marginVertical: 10,
                  }}
                >
                  {notificationData?.[0]?.notification ?? ""}
                </Text>
                <TouchableOpacity
                  onPress={() => onCheckBoxPress(!notifRemainder)}
                >
                  <MaterialCommunityIcons
                    name={
                      notifRemainder
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    color={notifRemainder ? COLORS.Blue : COLORS.Black}
                    size={wp(24)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <TouchableOpacity onPress={onLogout}>
            <View style={styles.logoutBtn}>
              <View style={[{ flexDirection: "row", padding: wp(5) }]}>
                <Image
                  style={styles.logoutIcons}
                  source={require("../../assets/icons/Logout-White.png")}
                />
                <Text style={[styles.logoutText, { marginLeft: wp(9.5) }]}>
                  {translation.Profile.logout}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteUserAlert(true)}
            style={{ marginTop: 10 }}
          >
            <View style={[styles.logoutBtn, { backgroundColor: COLORS.Red }]}>
              <View style={[{ flexDirection: "row", padding: wp(5) }]}>
                <AntDesignIcon
                  name="deleteuser"
                  size={22}
                  color={COLORS.White}
                />
                <Text style={[styles.logoutText, { marginLeft: wp(9.5) }]}>
                  {translation.Profile.del_acc}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
      <DeleteUserAlertPopup
        isVisible={isDeleteUserAlert}
        onRequestClose={() => setDeleteUserAlert(false)}
        onConfirmPress={() => onLogout()}
      />
      <ImagePickerPopup
        isVisible={isImagePickerPopup}
        onRequestClose={() => setImagePickerPopup(false)}
        onSuccessCallBack={onSuccessCallBack}
      />
      <LoaderView loading={isLoading} />
    </>
  );
}
