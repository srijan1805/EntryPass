import React, { Props, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Alert,
  AsyncStorage,
  BackHandler,
} from "react-native";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
  retriveUserDefaultFacility,
} from "../../store/User/UserDetails";
import { loginAPIcall } from "../../utils/LoginAPI";
import { useDispatch } from "react-redux";
import {
  setLoading,
  getHistory,
  getEmplyeeAddress,
} from "../../store/AddressHistory/AddressHistory";
import { format } from "date-fns";
import moment from "moment";
import SuccessAnimation from "../../components/SuccessAnimation";

const { width, height } = Dimensions.get("window");

const AddressVerificationSucessScreen = (props) => {
  const navigation = useNavigation();
  const scanTypeVal = props.route.params.adressresponse;
  const addressValue = props.route.params.useraddress;
  const [isLoading, setisLoading] = useState(false);
  const addressId = props.route.params.addressId;
  const empID = props.route.params.emplId;
  const dispatch = useDispatch();

  const [history, setAddress] = useState({
    id: 0,
    employeeId: 0,
    approvedBy: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(setLoading(true));
    profileRetrieveData().then((tokenval) => {
      dispatch(getEmplyeeAddress({ empID, addressId }))
        .then((data: any) => {
          let historyData = data.payload;

          setAddress({
            ...history,
            id: historyData.id,
            employeeId: historyData.employeeId,
            approvedBy: historyData.completedBy,

            dueDate: moment
              .utc(new Date(historyData.dueDate))
              .local()
              .format("DD MMMM YYYY hh:mm A"),
          });

          dispatch(setLoading(false));
        })
        .catch((err: any) => {
          dispatch(setLoading(false));
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    });
    const backAction = () => {
      profileDetials();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (scanTypeVal) {
        profileDetials();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "MyDrawer",
              },
            ],
          })
        );
      }
    }, 2300);
  }, []);

  function textchangeval() {
    if (scanTypeVal === true) {
      return translation.AddressVerification.address_verify_success;
    } else {
      return translation.AddressVerification.address_verify_failed;
    }
  }

  function locationchangeval() {
    if (scanTypeVal === true) {
      return addressValue;
    } else {
      return translation.AddressVerification.reg_add_not_match_msg;
    }
  }

  function buttonImageval() {
    if (scanTypeVal === true) {
      return COLORS.Yellow;
    } else {
      return COLORS.Red;
    }
  }

  function buttonInternalImageval() {
    if (scanTypeVal === true) {
      return require("../../assets/images/tick.png");
    } else {
      return require("../../assets/images/close.png");
    }
  }

  return (
    <>
      <SuccessAnimation />
    </>
  );

  function profileDetials() {
    setisLoading(true);
    employeeretrieveData().then((tokenValr) => {
      let employeedIDVAl = tokenValr.employeeId;

      loginAPIcall
        .profileDetailGetAPI(employeedIDVAl)
        .then((tokenRes) => {
          retriveUserDefaultFacility().then((facResp) => {
            if (tokenRes.status === 200) {
              let profiledata = {
                employeeId: tokenRes.data.result.employeeID,
                empNameId: tokenRes.data.result.empNameId,
                employeeName: tokenRes.data.result.employeeName,
                contactNumber: tokenRes.data.result.contactNumber,
                emailID: tokenRes.data.result.emailID,
                qrPassCode: tokenRes.data.result.qrPassCode,
                facility: tokenRes.data.result.facility,
                facilityId: facResp?.facilityId,
                facilityLogo: facResp?.facilityLogo,
                doj: tokenRes.data.result.doj,
                role: tokenRes.data.result.role,
                isSpuervisor: tokenRes.data.result.isSpuervisor,
                hasNotification: tokenRes.data.result.hasNotification,
                supervisorName: tokenRes.data.result.supervisorName,
                isSupervisorVerfied: tokenRes.data.result.isSupervisorVerfied,
                isAddressPending: tokenRes.data.result.isAddressPending,
                shiftStartTime: tokenRes.data.result.shiftStartTime,
                shiftEndTime: tokenRes.data.result.shiftEndTime,
                clockIn: tokenRes.data.result.clockIn,
                clockOut: tokenRes.data.result.clockOut,
                isArtTestPending: tokenRes.data.result.isArtTestPending,
                isAllowedEmployeeMobileForOthers:
                  tokenRes.data.result.isAllowedEmployeeMobileForOthers,
                postalCode: tokenRes.data.result.postalCode,
                isAlowToWorkForOtherFailities:
                  tokenRes.data.result.isAlowToWorkForOtherFailities,
              };

              profileStoreData(profiledata).then((tokenRes) => {
                AsyncStorage.removeItem("ResidenceImage");
                AsyncStorage.removeItem("ImageType");

                setisLoading(false);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [
                      {
                        name: "MyDrawer",
                      },
                    ],
                  })
                );
              });
            } else {
              setisLoading(false);
            }
          });
        })
        .catch((err) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    });
  }
};

const styles = StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: COLORS.White,
    alignItems: "center",
    flexDirection: "column",
  },
  imagebackgroundStyle: {
    height: wp(187),
    width: wp(187),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(50),
    resizeMode: "contain",
  },
  imageStyle: {
    height: wp(37),
    width: wp(56),
    //marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },

  textSytle: {
    marginTop: hp(42),
    fontSize: hp(28),
    textAlign: "center",
    color: COLORS.Black,
    marginLeft: wp(20),
    marginRight: wp(20),
    fontFamily: FONTS.Urbanist_Bold,
  },
  secondtextSytle: {
    marginTop: wp(24),
    fontWeight: "normal",
    fontSize: wp(18),
    textAlign: "center",
    color: COLORS.Black,
    width: wp(319),
    fontFamily: FONTS.Urbanist,
  },
  viewthirdStyle: {
    width: wp(327),
    height: hp(115),
    borderRadius: wp(16),
    marginTop: wp(50),
    borderWidth: wp(2),
    borderColor: COLORS.LightGrey,
    backgroundColor: COLORS.White,
    flexDirection: "column",
    alignItems: "center",
  },

  failityTextTitle: {
    marginTop: hp(15),
    color: COLORS.Blue,
    fontSize: wp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Semibold,
    textAlign: "center",
  },

  failityTextStyle: {
    marginTop: hp(11),
    width: wp(225),
    color: COLORS.DarkGrey,
    fontSize: wp(18),
    fontWeight: "400",
    fontFamily: FONTS.Urbanist,
    textAlign: "center",
  },

  text: {
    color: COLORS.White,
    fontSize: wp(18),
  },
  icons: {
    top: wp(20),
    alignSelf: "center",
    height: wp(22),
    width: wp(22),
    resizeMode: "contain",
    tintColor: COLORS.Blue,
    marginTop: hp(40),
  },
  buttonBack1: {
    backgroundColor: COLORS.Blue,
    borderRadius: wp(10),
    marginHorizontal: wp(25),
    width: wp(326),
    height: hp(54),
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: hp(40),
  },
  textBack1: {
    color: COLORS.White,
    alignSelf: "center",
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Bold,
  },
});

export default AddressVerificationSucessScreen;
