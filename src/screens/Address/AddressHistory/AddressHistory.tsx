import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/color";
import { FONTS } from "../../../constants/font";
import translation from "../../../assets/translations/translate";
import { Buttons } from "../../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  getHistory,
  setLoading,
} from "../../../store/AddressHistory/AddressHistory";
import { hp, wp } from "../../../utils/responsive-helper";
import moment from "moment";
import { getProfileDetails } from "../../../store/Profile/Profile";
import LoaderView from "../../../components/Loader";
import NavigationHeader from "../../../components/NavigationHeader";
import styles from "./styles";

function AddressHistory({ route }) {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: RootState) => state.addressHistoryState.loading
  );
  const [lang, setLang] = useState("en");

  const navigation = useNavigation();

  const {
    employeeId,
    historyId,
    addressArrayData,
    addresshistrorytype,
    employeeName,
    residentVal,
  } = route.params;

  const [history, setAddress] = useState({
    id: 0,
    employeeId: 0,
    contactNo: null,
    blockAndStreetName: "",
    floorAndUnitNumber: "",
    postalCode: 0,
    numberOfOccupant: 0,
    // numberOfBathrooms: 0,
    numberOfBedrooms: 0,
    verifiedDate: "",
    approvedStatus: false,
    approvedBy: "",
    residentValType: "",
  });
  const [staffName, setStaffName] = useState("");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (addresshistrorytype === "textInput") {
      setisLoading(true);
      dispatch(getProfileDetails(addressArrayData.staffEmployeeID))
        .then((data) => {
          let name = data.payload.employeeName;
          setStaffName(name);

          let newDate = moment
            .utc(new Date())
            .local()
            .format("DD-MM-YYYY hh:mm A");
          setAddress({
            ...history,
            // id: addressArrayData.id,
            employeeId: addressArrayData.employeeID,
            contactNo: addressArrayData.contactNo,
            blockAndStreetName: addressArrayData.blockNoStreetName,
            floorAndUnitNumber: addressArrayData.floorNoUnitNo,
            postalCode: addressArrayData.postalCode,
            numberOfOccupant: addressArrayData.occupant,
            //numberOfBathrooms: addressArrayData.bathrooms,
            numberOfBedrooms: addressArrayData.bedrooms,
            verifiedDate: newDate,
            approvedBy: "",
            residentValType: "",
          });
          setisLoading(false);
        })
        .catch((err) => {
          setisLoading(false);
          console.log(err);
        });
    } else {
      setisLoading(true);

      dispatch(getHistory({ employeeId, historyId }))
        .then((data: any) => {
          let historyData = data.payload;
          const utcNewDate = moment(historyData.verifiedDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm[Z]");
          let newDate = moment(utcNewDate).local().format("DD-MM-YYYY hh:mm A");

          setAddress({
            ...history,
            id: historyData.id,
            employeeId: historyData.employeeId,
            contactNo: historyData.contactNo,
            blockAndStreetName: historyData.blockAndStreetName,
            floorAndUnitNumber: historyData.floorAndUnitNumber,
            postalCode: historyData.postalCode,
            numberOfOccupant: historyData.numberOfOccupant,
            // numberOfBathrooms: historyData.numberOfBathrooms,
            numberOfBedrooms: historyData.numberOfBedrooms,
            verifiedDate: newDate,
            approvedBy: historyData.completedBy,
            residentValType:
              lang === "en"
                ? historyData.residenceTypeEnglish
                : historyData.residenceTypeChinees,
          });
          setisLoading(false);
        })
        .catch((err: any) => {
          setisLoading(false);
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <NavigationHeader
        title={translation.AddressHistory.AddressVerification}
        onPressCallBack={() => navigation.goBack()}
      />
      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.viewContainer}>
          {addresshistrorytype === "textInput" ? (
            <View />
          ) : (
            <View style={styles.verificationHistoryRow}>
              <Text style={styles.verificationHistory}>
                {translation.AddressHistory.Verification_History}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.verificationCard,
              {
                backgroundColor:
                  history.approvedBy !== null ? COLORS.Green : COLORS.Red,
              },
            ]}
          >
            <View style={styles.verificationHistoryRow}>
              <Image
                style={styles.icons}
                source={
                  history.approvedBy !== null
                    ? require("../../../assets/icons/Checked.png")
                    : require("../../../assets/icons/Pending.png")
                }
              />
              <Text style={styles.verificationCardLabel}>
                {translation.AddressHistory.Inspected_By}:{" "}
              </Text>
              <Text
                style={[
                  styles.verificationCardData,
                  { flexWrap: "wrap", width: wp(150) },
                ]}
              >
                {employeeName === "" ? history.approvedBy : employeeName}
              </Text>
            </View>

            {addresshistrorytype === "textInput" &&
            employeeName.localeCompare(staffName) !== 0 ? (
              <View style={styles.verificationHistoryRowEmployee}>
                <Image
                  style={styles.icons}
                  source={require("../../../assets/icons/Profile.png")}
                />
                <Text style={styles.verificationCardLabel}>
                  {translation.AddressHistory.EmployeeName}:{" "}
                </Text>
                <Text
                  style={[
                    styles.verificationCardData,
                    { flexWrap: "wrap", width: wp(150) },
                  ]}
                >
                  {staffName}
                </Text>
              </View>
            ) : (
              <View />
            )}

            <View style={styles.verificationHistoryRow}>
              <Image
                style={styles.icons}
                source={require("../../../assets/icons/Calendar.png")}
              />
              <Text style={styles.verificationCardLabel}>
                {translation.AddressHistory.Date_And_Time}:{" "}
              </Text>
              <Text
                style={[
                  styles.verificationCardData,
                  { width: wp(170), flexWrap: "wrap" },
                ]}
              >
                {history.verifiedDate}
              </Text>
            </View>
          </View>

          <View style={styles.addressCard}>
            <View style={{ flexDirection: "column" }}>
              {dataRow("Contact_No", history.contactNo)}
              <View style={styles.contactNumber} />
              <Text style={styles.addressTitle}>
                {translation.AddressHistory.Residential_Address}
              </Text>
              {dataRow("Block_No_And_Street_Name", history.blockAndStreetName)}
              {dataRow("Floor_And_Unit_Number", history.floorAndUnitNumber)}
              {dataRow("Postal_Code", history.postalCode)}
              <View
                style={{
                  borderBottomColor: COLORS.LightGrey,
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                }}
              />
              <Text style={styles.addressTitle}>
                {translation.AddressHistory.Unit_Details}
              </Text>
              {dataRow(
                "Residential_Type",
                addresshistrorytype === "textInput"
                  ? residentVal
                  : history.residentValType
              )}
              {dataRow(
                "No_Of_Occupant_In_Whole_Unit",
                history.numberOfOccupant
              )}
              {dataRow("No_Of_Bedrooms", history.numberOfBedrooms)}
            </View>
          </View>
          {addresshistrorytype === "textInput" ? (
            <View style={styles.buttonsRow}>
              <Buttons
                text={translation.AddressVerification.Back}
                onPress={() => {
                  navigation.goBack();
                }}
                BTNstyle={styles.buttonBack0}
                textStyle={styles.textBack0}
                ImgStyle={undefined}
                loader={undefined}
              />

              <Buttons
                text={translation.AddressVerification.Proceed}
                onPress={() => {
                  navigation.navigate("AddressVerificationConfirmScreen", {
                    addressData: addressArrayData,
                    employeeIds: employeeId,
                  });
                }}
                BTNstyle={styles.buttonProceed}
                textStyle={styles.textProceed}
                ImgStyle={undefined}
                loader={undefined}
              />
            </View>
          ) : (
            <Buttons
              text={translation.AddressVerification.Back}
              onPress={() => {
                navigation.goBack();
              }}
              BTNstyle={styles.buttonBack1}
              textStyle={styles.textBack1}
              ImgStyle={undefined}
              loader={undefined}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function dataRow(title, content) {
  return (
    <View style={styles.address}>
      <Text style={[styles.addressContent, { width: wp(150) }]}>
        {translation.AddressHistory[`${title}`]}
      </Text>
      <Text style={styles.addressContentRight}>{content}</Text>
    </View>
  );
}

export default AddressHistory;
