import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/color";
import { FONTS } from "../../../constants/font";
import translation from "../../../assets/translations/translate";
import { hp, wp } from "../../../utils/responsive-helper";
import { profileRetrieveData } from "../../../store/User/UserDetails";
import LoaderView from "../../../components/Loader";
import SelectDropdown from "react-native-select-dropdown";
import {
  getAddressHistory,
  setLoading,
} from "../../../store/AddressHistory/AddressHistory";

const { width, height } = Dimensions.get("window");

function AddressHistoryList() {
  const dispatch = useDispatch();
  // TODO: Set employee id in login
  const loading = useSelector(
    (state: RootState) => state.addressHistoryState.loading
  );
  const [addressHistories, setAddressHistories] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [year, setYear] = useState([]);
  const [employeeIdval, setemployeeIdval] = useState(0);
  let histories = [];
  const navigation = useNavigation();
  useEffect(() => {
    profileRetrieveData().then((tokenval) => {
      setemployeeIdval(tokenval.employeeId);

      dispatch(getAddressHistory(tokenval.employeeId))
        .then((data: any) => {
          let historyData = data.payload;
          setAddressHistories(historyData);
          historyData &&
            historyData.map((item: any, index) => {
              year.push(item.verifiedDate.toString().substring(0, 4));
              setYear([...new Set(year)]);
              setSelectedYear(year[0]);
            });
        })
        .catch((err: any) => {
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    });
  }, []);

  try {
    histories = addressHistories.filter(
      (address: any) =>
        address.verifiedDate.toString().substring(0, 4) === selectedYear
    );
  } catch (err) {
    if (err !== "undefined" && err.toString().includes("Network Error")) {
      alert(translation.AddressVerification.oops_err_msg);
    } else {
      alert(err.toString());
    }
  }

  const addressHistory = histories.map((item: any, index) => (
    <View style={styles.card} key={index}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.cardItem}>
          <View style={styles.addressRow}>
            <Text style={styles.addressRowLabel}>
              {translation.AddressHistory.Floor_And_Unit_Number}
            </Text>
            <Text style={styles.addressRowData}>{item.floorAndUnitNumber}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressRowLabel}>
              {translation.AddressHistory.Postal_Code}
            </Text>
            <Text style={styles.addressRowData}>{item.postalCode}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressRowLabel}>
              {translation.AddressHistory.Verified_Date}
            </Text>
            <Text style={styles.addressRowData}>
              {item.verifiedDate.toString().substring(0, 10)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            navigation.navigate("AddressHistory", {
              employeeId: employeeIdval,
              employeeName: "",
              historyId: item.id,
              addressArrayData: [],
              addresshistrorytype: "historyList",
            });
          }}
        >
          <Image
            style={styles.rightArrow}
            source={require("../../../assets/icons/RightArrow.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  ));
  return (
    <SafeAreaView style={styles.container}>
      {addressHistories.length > 0 ? (
        <>
          <View>
            <View style={styles.verificationHistoryRow}>
              <Text style={styles.verificationHistory}>
                {translation.AddressHistory.Verification_History}
              </Text>
              <View style={styles.picker}>
                <SelectDropdown
                  data={year}
                  defaultButtonText={selectedYear}
                  renderDropdownIcon={() => (
                    <Image
                      style={styles.dropdown}
                      source={require("../../../assets/icons/Dropdown.png")}
                    />
                  )}
                  buttonTextStyle={{
                    fontSize: hp(16),
                    fontFamily: FONTS.Urbanist,
                  }}
                  buttonStyle={styles.pickerButton}
                  dropdownStyle={{ width: wp(97), borderRadius: wp(22) }}
                  rowTextStyle={{
                    color: COLORS.Black,
                    fontSize: hp(16),
                    fontFamily: FONTS.Urbanist,
                  }}
                  onSelect={(selectedItem, index) => {
                    setSelectedYear(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>
            </View>
            {/* ADDRESS HISTORY DATA */}
          </View>
          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ marginTop: hp(10), marginBottom: hp(25) }}
          >
            <View style={{ flex: 1 }}>
              {loading ? <LoaderView loading={loading} /> : addressHistory}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.noAddress}>
          <Text style={styles.verificationHistory}>
            {translation.AddressHistory.Verification_History}
          </Text>
          <View style={styles.noAddressData}>
            <Text style={styles.noAddressDataText}>
              {translation.AddressHistory.No_Address_Found}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: hp(10),
    marginBottom: hp(10),
    backgroundColor: COLORS.White,
  },
  verificationHistoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(10),
  },
  verificationHistory: {
    fontSize: hp(22),
    // fontWeight: '700',
    fontFamily: FONTS.Urbanist_Bold,
    color: COLORS.GrayDark,
    marginTop: hp(12),
  },
  picker: {
    width: wp(97),
    height: hp(45),
    borderWidth: 1,
    borderColor: COLORS.LightGrey,
    borderRadius: wp(22),
  },
  pickerButton: {
    width: wp(95),
    height: hp(44),
    borderRadius: wp(22),
    backgroundColor: "transparent",
  },
  pickerItem: {
    color: COLORS.DarkGrey,
  },
  dropdown: {
    width: wp(16),
    height: hp(16),
  },
  loading: {
    height: hp(50),
  },
  card: {
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
    borderRadius: wp(15),
    padding: wp(10),
    margin: wp(5),
    marginHorizontal: wp(15),
    width: wp(327),
    minHeight: hp(111),
    justifyContent: "center",
  },
  cardItem: {
    width: wp(280),
    flexDirection: "column",
    borderRightWidth: wp(1),
    borderColor: COLORS.LightGrey,
  },
  nextButton: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginLeft: wp(8),
    marginRight: wp(11),
  },
  rightArrow: {
    width: wp(21),
    height: hp(21),
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(7),
    marginLeft: wp(2),
  },
  addressRowLabel: {
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(16),
    fontWeight: "500",
    marginLeft: wp(5),
  },
  addressRowData: {
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
    fontSize: hp(16),
    fontWeight: "600",
    marginLeft: wp(10),
    marginRight: wp(19),
    width: wp(100),
    textAlign: "right",
  },
  noAddress: {
    marginLeft: wp(24),
  },
  noAddressData: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(10),
  },
  noAddressDataText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: hp(17),
    fontFamily: FONTS.Urbanist_Bold,
    // fontWeight: '700',
    color: COLORS.DarkGrey,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});
export default AddressHistoryList;
