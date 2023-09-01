import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import NavigationHeader from "../../components/NavigationHeader";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import {
  fetchReportingStaff,
  removeReportingStaff,
} from "../../utils/ReportingStaffAPI";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../../components/Loader";
import translation from "../../assets/translations/translate";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import ConfirmationPopup from "./ConfirmationPopup";

interface IStaffData {
  employeeID: string;
  empNameId: string;
  employeeName: string;
  active: boolean;
  designation: string;
}

interface IRemoveStaffBody {
  SupervisorId: string;
  employeeId: string;
}

const ReportingStaffScreen = (props: any) => {
  const navigation = useNavigation();
  const [staffData, setStaffData] = useState<Array<IStaffData>>(
    props.route.params.staffData
  );
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [isConfirmationPopup, setConfirmationPopup] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<IStaffData>({
    employeeID: "",
    empNameId: "",
    employeeName: "",
    active: true,
    designation: "",
  });

  const profileDetails = useSelector(
    (state: RootState) => state.profileState.profileDetails
  );

  useEffect(() => {
    // getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const responce = await fetchReportingStaff(
        profileDetails.employeeID.toString()
      );
      setStaffData(responce);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(`GET REPRTING STAFF FAILED,${error}`);
    }
  };

  const onRemovePress = async (item: IStaffData) => {
    try {
      setLoading(true);
      const data: IRemoveStaffBody = {
        SupervisorId: profileDetails.employeeID.toString(),
        employeeId: item.employeeID,
      };
      await removeReportingStaff(data);
      await getData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(`REMOVE REPORTING STAFF API FAILED, ${error}`);
    }
  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //         backgroundColor: COLORS.White,
  //         marginHorizontal: 20,
  //         borderRadius: 4,
  //         // padding: 12,
  //         marginBottom: 10,
  //         shadowColor: "#000",
  //         shadowOffset: {
  //           width: 0,
  //           height: 2,
  //         },
  //         shadowOpacity: 0.25,
  //         shadowRadius: 3.84,

  //         elevation: 5,
  //       }}
  //     >
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //           // alignItems: "center",
  //           width: "100%",
  //         }}
  //       >
  //         <View>
  //           <View
  //             style={{
  //               backgroundColor: "#5647F9",
  //               padding: hp(8),
  //               paddingHorizontal: hp(15),
  //               borderBottomRightRadius: 10,
  //               borderTopLeftRadius: 4,
  //               width: wp(120),
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 fontSize: hp(14),
  //                 color: COLORS.White,
  //                 fontFamily: FONTS.Urbanist_Medium,
  //                 fontWeight: "700",
  //               }}
  //             >
  //               UEMSS03758
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               flexDirection: "column",
  //               justifyContent: "flex-start",
  //               marginHorizontal: hp(12),
  //               marginVertical: hp(8),
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 fontSize: hp(16),
  //                 color: COLORS.Black,
  //                 fontFamily: FONTS.Urbanist_Medium,
  //                 fontWeight: "700",
  //               }}
  //             >
  //               Madhusudhanan Vyshak
  //             </Text>
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "flex-start",
  //                 marginVertical: hp(10),
  //                 // alignItems: "center",
  //               }}
  //             >
  //               <Ionicons
  //                 name="md-location-outline"
  //                 size={hp(16)}
  //                 color={"#07CDA9"}
  //               />
  //               <Text
  //                 style={{
  //                   fontFamily: FONTS.Urbanist_Medium,
  //                   fontSize: hp(14),
  //                   fontWeight: "700",
  //                   marginHorizontal: hp(8),
  //                   opacity: 0.6,
  //                 }}
  //               >
  //                 SM HQ
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //         <TouchableOpacity
  //           style={{
  //             flexDirection: "column",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             backgroundColor: "rgba(248, 121, 121, 0.15)",
  //             marginVertical: hp(10),
  //             paddingHorizontal: hp(20),
  //             borderRadius: 4,
  //             marginRight: hp(12),
  //           }}
  //           onPress={() => {
  //             setCurrentItem(item);
  //             setConfirmationPopup(true);
  //           }}
  //         >
  //           <MaterialCommunityIcons
  //             name="delete-outline"
  //             size={hp(30)}
  //             color={"#F87979"}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.White,
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.Urbanist,
                color: "#5647F9",
                fontSize: hp(16),
                fontWeight: "700",
              }}
            >
              {item.empNameId}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.Urbanist,
                color: COLORS.Black,
                fontSize: hp(14),
                fontWeight: "600",
                paddingVertical: 5,
              }}
            >
              {item.employeeName}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.Urbanist,
                color: COLORS.Gray,
                fontSize: hp(14),
                fontWeight: "700",
              }}
            >
              {item.designation}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#F87979",
              borderRadius: 32,
              justifyContent: "center",
              alignItems: "center",
              // marginHorizontal: 10,
              width: hp(100),
              height: hp(40),
            }}
            onPress={() => {
              setCurrentItem(item);
              setConfirmationPopup(true);
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.Urbanist,
                color: COLORS.White,
                fontSize: hp(14),
                fontWeight: "600",
              }}
            >
              {translation.Buttons_lable.delete}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: COLORS.GrayLight,
            marginVertical: 10,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <NavigationHeader
            title={translation.Reporting_Staff.Reporting_Staff}
            onPressCallBack={() => navigation.goBack()}
          />
          {staffData && staffData.length > 0 ? (
            <FlatList
              data={staffData}
              keyExtractor={(item, index) => item.empNameId.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ marginTop: 10 }}
            />
          ) : (
            <View style={styles.emptyDataContainer}>
              <Text style={styles.noDataText}>
                {translation.Reporting_Staff.No_Staff}
              </Text>
            </View>
          )}
        </View>
        <Loader loading={isLoading} />
        <ConfirmationPopup
          isVisible={isConfirmationPopup}
          onRequestClose={() => setConfirmationPopup(false)}
          onConfirmation={() => {
            setConfirmationPopup(false);
            onRemovePress(currentItem);
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default ReportingStaffScreen;
