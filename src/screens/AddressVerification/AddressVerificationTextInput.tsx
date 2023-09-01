import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { COLORS } from "../../constants/color";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../constants/font";
import translation from "../../assets/translations/translate";
import {
  employeeretrieveData,
  profileStoreData,
  profileRetrieveData,
  addressVerficationFacilityRetrieveData,
} from "../../store/User/UserDetails";
import { hp, wp } from "../../utils/responsive-helper";
import { Buttons } from "../../components/Buttons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SelectDropdown from "react-native-select-dropdown";
import { addressResidentsGetAPI } from "../../utils/AddressNetworksAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
    justifyContent: "center",
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
  errorMsg: {
    color: COLORS.Red,
    marginLeft: wp(4),
    fontFamily: FONTS.Urbanist,
    fontSize: hp(12),
  },
  textinputHeading: {
    margin: hp(15),
    marginLeft: wp(24),
    height: hp(30),
    fontWeight: "700",
    fontSize: hp(22),
    textAlign: "left",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  textinput: {
    height: hp(30),
    fontWeight: "700",
    fontSize: hp(18),
    textAlign: "left",
    color: COLORS.Black,
    fontFamily: FONTS.Urbanist_Semibold,
    marginLeft: wp(24),
    marginTop: hp(25),
    // marginBottom: hp(17)
  },
  input: {
    marginTop: hp(10),
    height: hp(55),
    borderColor: COLORS.GrayLight,
    color: COLORS.Black,
    borderWidth: wp(1),
    borderRadius: wp(10),
    fontFamily: FONTS.Urbanist,
    paddingLeft: wp(7),
    marginLeft: wp(24),
    marginRight: wp(24),
    fontSize: hp(18),
  },
  inputtxt: {
    height: hp(55),
    borderColor: COLORS.GrayLight,
    color: COLORS.Black,
    borderWidth: wp(1),
    borderRadius: wp(10),
    flex: 1,
    paddingLeft: wp(7),
    marginLeft: wp(24),
    marginRight: wp(24),
    fontFamily: FONTS.Urbanist,
    fontSize: hp(18),
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: wp(10),
  },
  buttonBack1: {
    backgroundColor: COLORS.Blue,
    borderRadius: wp(10),
    width: wp(327),
    height: hp(54),
    marginLeft: wp(24),
    marginRight: wp(24),
    marginTop: hp(15),
    marginBottom: hp(20),
  },
  textBack1: {
    color: COLORS.White,
    alignSelf: "center",
    textAlignVertical: "center",
    marginTop: hp(16),
    marginBottom: hp(16),
    fontSize: hp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Bold,
  },
  dropdownText: {
    fontSize: hp(18),
    //fontWeight: '500',
    fontFamily: FONTS.Urbanist,
    textAlign: "left",
    // alignItems: 'flex-start',
  },
  dropdownTextDesign: {
    fontSize: hp(18),
    // fontWeight: '500',
    fontFamily: FONTS.Urbanist_Medium,
    textAlign: "left",
    color: COLORS.Grey2,
    width: wp(314),
    height: hp(50),
    padding: hp(15),
    paddingLeft: hp(5),
    marginLeft: hp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
  },
  dropdown: {
    width: wp(16),
    height: hp(16),
    marginLeft: wp(10),
    marginRight: wp(0),
    tintColor: COLORS.Black,
  },
  pickerButton: {
    marginTop: hp(2),
    marginLeft: hp(0),
    // marginRight: hp(5),
    width: wp(310),
    height: hp(48),
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
  },
});

export default function AddressVerificationTextInput({ route }) {
  const [contactNo, setcontactNo] = useState("");
  const [blockNoStreetName, setblockNoStreetName] = useState("");
  const [floorNo, setfloorNo] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const [occupant, setoccupant] = useState("");
  const [bedrooms, setbedrooms] = useState("");
  const [residencesval, setresidences] = useState("");
  const [error, setError] = useState({
    contactNo: false,
    blockNoStreetName: false,
    floorNo: false,
    unitNo: false,
    postalCode: false,
    occupant: false,
    bedrooms: false,
    residences: false,
    isNumber: false,
    maxValue: false,
    latitude: "string",
    longitude: "string",
  });
  const navigation = useNavigation();
  const { imagearraydata } = route.params;
  const { Location } = route.params;
  // const Coordinates = Location.latitude;
  // console.log('-----------', Coordinates);
  const text1 = useRef();
  const text2 = useRef();
  const text3 = useRef();
  const text4 = useRef();
  const text5 = useRef();
  const text6 = useRef();
  const text7 = useRef();
  const text8 = useRef();

  const EmployeePostalCode = useSelector(
    (state: RootState) => state.addressHistoryState.PostalCode
  );

  const [readval, setReasonval] = useState([]);
  const [readOccupantsval, setoccupantsval] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [selectedreadval, setSelectedReasonval] = useState(0);
  const [defaultResVal, setDefaultResVal] = useState("false");
  const [lang, setLang] = useState("en");
  const [occupantLimit, setOccupantLimit] = useState(0);
  const [routes] = React.useState([
    { key: "Verification", title: "Verification" },
    { key: "History", title: "History" },
  ]);
  useEffect(() => {
    async function listdata() {
      await getAddressResidents();
    }
    listdata();
  }, []);

  function showErrorMessages(isNumber = false) {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {!isNumber
            ? translation.AddressVerification.this_field_cannot_be_empty
            : translation.AddressVerification.this_fielsd_must_be_no}
        </Text>
      </View>
    );
  }

  function showErrorMessagesforRes(isNumber = false, msgs) {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {!isNumber
            ? defaultResVal === "true" || selectedreadval === 0
              ? "Please select the residences type"
              : translation.AddressVerification.this_field_cannot_be_empty
            : translation.AddressVerification.this_fielsd_must_be_no}
        </Text>
      </View>
    );
  }

  function showPostalErrorMessages(isNumber = false) {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {!isNumber
            ? translation.AddressVerification.enter_registered_postal_code
            : translation.AddressVerification.this_fielsd_must_be_no}
        </Text>
      </View>
    );
  }

  function showErrorMessagesOccupants() {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {selectedreadval === 0
            ? "Please select the residences type"
            : translation.AddressVerification.no_more_than15 + occupantLimit}
        </Text>
      </View>
    );
  }

  function showErrorMessagesContact() {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {translation.AddressVerification.contact_valid}
        </Text>
      </View>
    );
  }

  function getAddressResidents() {
    setReasonval([]);
    setoccupantsval([]);
    try {
      addressResidentsGetAPI()
        .then((tokenRes) => {
          let historyData = tokenRes.data.result;

          historyData &&
            historyData.map((item: any, index) => {
              setReasonval((readvals) => [
                ...readvals,
                `${
                  lang === "en"
                    ? item.residenceTypeEnglish
                    : item.residenceTypeChinees
                }`,
              ]);
              setoccupantsval((readvals) => [...readvals, `${item.occupants}`]);
            });
        })
        .catch((err: any) => {
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          } else {
            alert(err.toString());
          }
        });
    } catch (ex) {
      Alert.alert(translation.AddressVerification.oops_err_msg);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Image
              style={styles.backButton}
              source={require("../../assets/icons/BackArrow.png")}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {translation.AddressHistory.AddressVerification}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>
          {/* Fill  Below */}
          <Text style={styles.textinputHeading}>
            {translation.AddressVerification.fill_below_det}
          </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={translation.AddressVerification.ph_contact_no}
            placeholderTextColor={COLORS.GrayLight}
            autoCapitalize="none"
            value={contactNo}
            returnKeyType="next"
            ref={text1}
            onSubmitEditing={() => {
              text2.current.focus();
              // text2.current.focus();
            }}
            keyboardType={"number-pad"}
            maxLength={8}
            onChangeText={(contactNo: any) => {
              const re = /^[0-9\b]+$/;
              if (contactNo === "" || re.test(contactNo)) {
                setcontactNo(contactNo);
              }
            }}
            onBlur={() => {
              if (contactNo.length !== 8 && contactNo.length !== 0) {
                setError({ ...error, contactNo: true });
              } else {
                setError({ ...error, contactNo: false });
              }
              if (isNaN(Number(contactNo))) {
                setError({ ...error, isNumber: true });
              }
            }}
          />
          {/* {error.contactNo ? showErrorMessages(error.isNumber) : <View />} */}
          {error.contactNo ? showErrorMessagesContact() : <View />}

          {/* Residental Address*/}

          <Text style={styles.textinput}>
            {translation.AddressVerification.ResidentialAddress}
          </Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={translation.AddressVerification.ph_bn_sn}
            placeholderTextColor={COLORS.GrayLight}
            autoCapitalize="none"
            returnKeyType="next"
            ref={text2}
            onSubmitEditing={() => {
              text3.current.focus();
            }}
            value={blockNoStreetName}
            onChangeText={(blockNoStreetName: any) => {
              setblockNoStreetName(blockNoStreetName);
            }}
            onBlur={() => {
              if (
                blockNoStreetName.trim() === "" ||
                blockNoStreetName.trim() === null
              ) {
                setError({ ...error, blockNoStreetName: true });
              }
              if (blockNoStreetName.trim().length > 0) {
                setError({ ...error, blockNoStreetName: false });
              }
            }}
          />
          {error.blockNoStreetName ? showErrorMessages() : <View />}
          <View style={styles.row}>
            <TextInput
              style={[styles.inputtxt, { marginRight: wp(3) }]}
              underlineColorAndroid="transparent"
              placeholder={translation.AddressVerification.ph_fn}
              placeholderTextColor={COLORS.GrayLight}
              autoCapitalize="none"
              returnKeyType="next"
              ref={text3}
              onSubmitEditing={() => {
                text4.current.focus();
              }}
              maxLength={50}
              value={floorNo}
              onChangeText={(floorNo: any) => {
                setfloorNo(floorNo);
              }}
              onBlur={() => {
                if (floorNo.trim() === "" || floorNo.trim() === null) {
                  setError({ ...error, floorNo: true });
                }
                if (floorNo.trim().length > 0) {
                  setError({ ...error, floorNo: false });
                }
              }}
            />

            <TextInput
              style={[styles.inputtxt, { marginLeft: wp(3) }]}
              underlineColorAndroid="transparent"
              placeholder={translation.AddressVerification.ph_un}
              placeholderTextColor={COLORS.GrayLight}
              autoCapitalize="none"
              returnKeyType="next"
              ref={text4}
              onSubmitEditing={() => {
                text5.current.focus();
              }}
              maxLength={50}
              value={unitNo}
              onChangeText={(unitNo: any) => {
                setUnitNo(unitNo);
              }}
              onBlur={() => {
                if (unitNo.trim() === "" || unitNo.trim() === null) {
                  setError({ ...error, unitNo: true });
                }
                if (unitNo.trim().length > 0) {
                  setError({ ...error, unitNo: false });
                }
              }}
            />
          </View>
          {error.floorNo || error.unitNo ? showErrorMessages() : <View />}
          {/* {error.unitNo ? showErrorMessages() : <View />} */}
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={translation.AddressVerification.ph_postal_code}
            placeholderTextColor={COLORS.GrayLight}
            autoCapitalize="none"
            returnKeyType="next"
            ref={text5}
            onSubmitEditing={() => {
              //  text6.current.focus();
            }}
            value={postalCode}
            maxLength={6}
            keyboardType={"number-pad"}
            onChangeText={(postalCode: any) => {
              const re = /^[0-9\b]+$/;
              if (postalCode === "" || re.test(postalCode)) {
                setpostalCode(postalCode);
              }
              if (selectedreadval === 0) {
                setDefaultResVal("true");
              }
            }}
            onBlur={() => {
              if (postalCode.trim() === "" || postalCode.trim() === null) {
                setError({ ...error, postalCode: true });
              }
              if (postalCode.trim().length > 0) {
                setError({ ...error, postalCode: false });
              }
              if (isNaN(Number(postalCode))) {
                setError({ ...error, isNumber: true });
              }
              if (postalCode !== EmployeePostalCode) {
                setError({ ...error, postalCode: true });
              }
            }}
          />
          {error.postalCode ? (
            showPostalErrorMessages(error.isNumber)
          ) : (
            <View />
          )}
          {/* Unit details */}
          <Text style={styles.textinput}>
            {translation.AddressVerification.unit_det}
          </Text>
          <View style={[styles.input, { paddingLeft: wp(0) }]}>
            {readval.length === 0 ? (
              <Text style={styles.dropdownTextDesign}>
                {"No resident found"}
              </Text>
            ) : (
              <SelectDropdown
                data={readval}
                defaultButtonText={
                  readval.length === 0
                    ? "No reason found"
                    : translation.AddressVerification.ph_no_of_res
                }
                renderDropdownIcon={() =>
                  readval.length === 0 ? (
                    <></>
                  ) : (
                    <Image
                      style={styles.dropdown}
                      source={require("../../assets/icons/Dropdown.png")}
                    />
                  )
                }
                buttonStyle={styles.pickerButton}
                buttonTextStyle={{
                  fontFamily: FONTS.Urbanist,
                  fontSize: hp(18),
                  textAlign: "left",
                  marginLeft: wp(0),
                  paddingLeft: wp(0),
                  color: isOptionSelected
                    ? COLORS.Black
                    : COLORS.placeHolderColor,
                }}
                rowTextStyle={{ fontFamily: FONTS.Urbanist }}
                dropdownStyle={{ borderRadius: wp(14) }}
                onSelect={(selectedItem, index) => {
                  if (readval.length === 0) {
                    setDefaultResVal("true");

                    // setLoading(false);
                    // setisLoading(false);
                  } else {
                    if (selectedreadval === 0) {
                      setDefaultResVal("true");
                    } else {
                      setDefaultResVal("false");
                    }
                    setresidences(selectedItem);

                    setIsOptionSelected(true);
                    setSelectedReasonval(Number(index) + 1);
                    setOccupantLimit(readOccupantsval[index]);
                  }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            )}
          </View>

          {error.residences ||
          (selectedreadval === 0 && defaultResVal === "true") ? (
            showErrorMessagesforRes(error.isNumber, "residences")
          ) : (
            <View />
          )}
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={translation.AddressVerification.ph_no_of_occupant}
            placeholderTextColor={COLORS.GrayLight}
            autoCapitalize="none"
            returnKeyType="next"
            ref={text7}
            onSubmitEditing={() => {
              text8.current.focus();
            }}
            keyboardType={"number-pad"}
            value={occupant}
            maxLength={2}
            onChangeText={(occupant: any) => {
              const re = /^[0-9\b]+$/;
              if (occupant === "" || re.test(occupant)) {
                setoccupant(occupant);
              }
            }}
            onBlur={() => {
              if (occupant.trim() === "" || occupant.trim() === null) {
                setError({ ...error, occupant: true });
              }
              if (occupant.trim().length > 0) {
                setError({ ...error, occupant: false });
              }
              if (isNaN(Number(occupant))) {
                setError({ ...error, isNumber: true, occupant: false });
              }
              if (
                Number(occupant) > occupantLimit &&
                Number(occupant) !== Number(occupantLimit)
              ) {
                setError({ ...error, maxValue: true, occupant: false });
              }
              if (
                Number(occupant) < occupantLimit &&
                Number(occupant) > 0 &&
                Number(occupant) !== Number(occupantLimit)
              ) {
                setError({ ...error, maxValue: false, occupant: false });
              }
            }}
          />
          {console.log(error)}
          {error.occupant || error.isNumber ? (
            showErrorMessages(error.isNumber)
          ) : (
            <View />
          )}
          {error.maxValue &&
          occupant.trim().length > 0 &&
          Number(occupant) !== Number(occupantLimit) ? (
            showErrorMessagesOccupants()
          ) : (
            <View />
          )}
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={translation.AddressVerification.ph_no_of_bedrs}
            placeholderTextColor={COLORS.GrayLight}
            autoCapitalize="none"
            returnKeyType="next"
            ref={text8}
            onSubmitEditing={() => {
              //  text9.current.focus();
            }}
            keyboardType={"numeric"}
            value={bedrooms}
            maxLength={1}
            onChangeText={(bedrooms: any) => {
              const re = /^[0-9\b]+$/;
              if (bedrooms === "" || re.test(bedrooms)) {
                setbedrooms(bedrooms);
              }
            }}
            onBlur={() => {
              if (bedrooms.trim() === "" || bedrooms.trim() === null) {
                setError({ ...error, bedrooms: true });
              }
              if (bedrooms.trim().length > 0) {
                setError({ ...error, bedrooms: false });
              }
              if (isNaN(Number(bedrooms))) {
                setError({ ...error, isNumber: true });
              }
            }}
          />
          {error.bedrooms ? showErrorMessages(error.isNumber) : <View />}
          <Buttons
            text={translation.AddressVerification.Submit}
            onPress={() => {
              addressverifyAPICall();
            }}
            BTNstyle={styles.buttonBack1}
            textStyle={styles.textBack1}
            ImgStyle={undefined}
            loader={undefined}
          />
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );

  function addressverifyAPICall() {
    if (contactNo.length !== 8 && contactNo.length !== 0) {
      setError({ ...error, contactNo: true });
    } else if (
      blockNoStreetName.trim() === "" ||
      blockNoStreetName.trim() === null
    ) {
      setError({ ...error, blockNoStreetName: true });
    } else if (floorNo.trim() === "" || floorNo.trim() === null) {
      setError({ ...error, floorNo: true });
    } else if (unitNo.trim() === "" || unitNo.trim() === null) {
      setError({ ...error, unitNo: true });
    } else if (postalCode.trim() === "" || postalCode.trim() === null) {
      setError({ ...error, postalCode: true });
    } else if (occupant.trim() === "" || occupant.trim() === null) {
      setError({ ...error, occupant: true });
    } else if (bedrooms.trim() === "" || bedrooms.trim() === null) {
      setError({ ...error, bedrooms: true });
    } else if (selectedreadval === 0) {
      setDefaultResVal("true");
    } else if (
      Number(occupant) > occupantLimit &&
      Number(occupant) !== Number(occupantLimit)
    ) {
      setError({ ...error, maxValue: true });
    } else if (postalCode !== EmployeePostalCode) {
      setError({ ...error, postalCode: true });
    } else {
      let addressdataArray = {};
      addressVerficationFacilityRetrieveData().then((sideDetail) => {
        profileRetrieveData().then((tokenval) => {
          if (
            sideDetail.facilityId != null &&
            sideDetail.isFacilityVerfied === true
          ) {
            addressdataArray = {
              addressImages: imagearraydata,
              // employeeID: tokenval.employeeId,
              blockNoStreetName: blockNoStreetName,
              floorNoUnitNo: floorNo.toString() + "-" + unitNo.toString(),
              postalCode: Number(postalCode),
              occupant: Number(occupant),
              bedrooms: Number(bedrooms),
              //  bathrooms: Number(bathrooms),
              contactNo: contactNo,
              latitude: String(Location.latitude),
              longitude: String(Location.longitude),
              isSupervisor: tokenval.isSpuervisor,
              staffVerification: true,
              staffEmployeeID: sideDetail.facilityId,
              residenceTypeId: Number(selectedreadval),
            };
          } else {
            addressdataArray = {
              addressImages: imagearraydata,
              // employeeID: tokenval.employeeId,
              blockNoStreetName: blockNoStreetName,
              floorNoUnitNo: floorNo.toString() + " , " + unitNo.toString(),
              postalCode: Number(postalCode),
              occupant: Number(occupant),
              bedrooms: Number(bedrooms),
              // bathrooms: Number(bathrooms),
              contactNo: contactNo,
              latitude: String(Location.latitude),
              longitude: String(Location.longitude),
              isSupervisor: tokenval.isSpuervisor,
              staffVerification: false,
              staffEmployeeID: tokenval.employeeId,
              residenceTypeId: Number(selectedreadval),
            };
          }

          navigation.navigate("AddressHistory", {
            employeeId: tokenval.employeeId,
            employeeName: tokenval.employeeName,
            historyId: 0,
            addressArrayData: addressdataArray,
            addresshistrorytype: "textInput",
            residentVal: residencesval,
          });
        });
      });
    }
  }
}
