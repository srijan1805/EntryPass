import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { profileRetrieveData } from "../../store/User/UserDetails";
import { ARTtestStaffList } from "../../utils/ArtTestAPI";
import { hp, wp } from "../../utils/responsive-helper";
import LoaderView from "../../components/Loader";
import CalendarView from "../../components/CalendarView";
import CalendarImage from "../../assets/images/Calendar.svg";
import { timeZonecheck } from "../../store/User/UserDetails";

DropDownPicker.setListMode("SCROLLVIEW");

function ArtTestStaff(props) {
  const [EmployeeID, setEmployeeID] = useState("");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [datalist, setDatalist] = useState([]);
  const [masterDatalist, setMasterDatalist] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [value, setValue] = useState("Negative");
  var moments = require("moment-timezone");
  let timeZonecheckval = timeZonecheck();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {
      label: translation.ArtTest.Negative,
      value: "Negative",
      icon: () => (
        <View style={[styles.colorIcon, { backgroundColor: COLORS.Green }]} />
      ),
    },
    {
      label: translation.ArtTest.Positive,
      value: "Positive",
      icon: () => (
        <View style={[styles.colorIcon, { backgroundColor: COLORS.Red }]} />
      ),
    },
    {
      label: translation.ArtTest.Outstanding,
      value: "Outstanding",
      icon: () => (
        <View style={[styles.colorIcon, { backgroundColor: COLORS.Yellow }]} />
      ),
    },
  ]);

  const [isShown, setisShown] = useState(false);

  const [calendarTypeval, setcalendarTypeval] = useState("Single");
  const [startmultidate, setstartmultiDate] = useState<Date | undefined>(
    new Date()
  );
  const [endmultidate, setendMultiDate] = useState<Date | undefined>(
    new Date()
  );

  //Single------
  const [singlestartdate, setsinglestartdate] = useState<Date | undefined>(
    new Date()
  );
  const [singleenddate, setsingleenddate] = useState<Date | undefined>(
    new Date()
  );

  let data = {
    date: moments(singlestartdate).tz(timeZonecheckval).format("YYYY-MM-DD"),
    testResult: value,
  };

  useEffect(() => {
    profileRetrieveData().then(async (tokenval) => {
      setEmployeeID(tokenval.employeeId);
      setIsSupervisor(tokenval.isSpuervisor);
      if (datalist.length === 0) {
        setisLoading(true);
        await ArtTestStaffAPI(tokenval.employeeId, data);
      }
      setisLoading(false);
    });
  }, []);

  async function ArtTestStaffAPI(empId, data) {
    // setisLoading(true);
    const resp = await ARTtestStaffList(empId, data);
    setDatalist(resp.data.result);
    setMasterDatalist(resp.data.result);
    setisLoading(false);
  }

  function onRefresh() {
    Keyboard.dismiss();
    async function listdata() {
      await getArtList();
    }
    listdata();
  }

  async function getArtList() {
    setDatalist([]);
    await ArtTestStaffAPI(EmployeeID, data);
    setisLoading(false);
  }

  function search(searchTexts: string) {
    let searchText = searchTexts.trimEnd().trimStart();
    let filteredData = masterDatalist.filter((item) => {
      return item.staffName.toLowerCase().includes(searchText.toLowerCase());
    });
    setDatalist(filteredData);
  }

  function filterList(filterItem) {
    onRefresh();
    setSearchText("");
    let filteredData = datalist.filter((item) => {
      if (item.testResult === filterItem) {
        return item;
      }
    });
    setDatalist(filteredData);
  }

  const staffTestCard = (index, name, role, testResult) => (
    <View style={styles.cardContainer} key={index}>
      <View style={styles.cardHeader}>
        <Text style={[styles.text, { marginLeft: wp(20) }]}>{name}</Text>
        <Text
          style={[
            styles.text,
            { marginRight: wp(24), width: wp(100), textAlign: "right" },
          ]}
        >
          {role === null ? "-" : role}
        </Text>
      </View>
      <View style={styles.testResultContainer}>
        <Text
          style={[
            styles.testResult,
            {
              color:
                testResult === "Positive"
                  ? COLORS.Red
                  : testResult === "Negative"
                  ? COLORS.Green
                  : COLORS.Yellow,
            },
          ]}
        >
          {testResult}
        </Text>
      </View>
    </View>
  );

  // Calendar
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const tooglemodel = (
    calendartype: any,
    startsingleDateVal: Date,
    endsingleDateVal: Date,
    startmultiDateVal: Date,
    endmultiDateVal: Date
  ) => {
    setstartmultiDate(startmultiDateVal);
    setendMultiDate(endmultiDateVal);
    setsingleenddate(endsingleDateVal);
    setsinglestartdate(startsingleDateVal);
    setcalendarTypeval(calendartype);
    setisShown(false);
    const Apidata = {
      date: moments(startsingleDateVal)
        .tz(timeZonecheckval)
        .format("YYYY-MM-DD"),
      testResult: value,
    };
    if (calendartype === "Single") {
      async function listdata() {
        setisLoading(true);
        await ArtTestStaffAPI(EmployeeID, Apidata);
      }

      listdata();
      setisLoading(false);
    }
    setSearchText("");
    // onRefresh();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <CalendarView
        needToShow={isShown}
        tooglemodel={tooglemodel}
        calendarType={calendarTypeval}
        startsingleDateVal={singlestartdate}
        endsingleDateVal={singleenddate}
        startmultiDateVal={startmultidate}
        endmultiDateVal={endmultidate}
        viewtypePassed={"ART"}
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isSupervisor ? (
          <View>
            <View style={styles.mainCalendarView}>
              <TouchableOpacity
                onPress={() => {
                  // setstartDate(startdate);
                  // setendDate(enddate);
                  setisShown(true);
                }}
              >
                <View style={styles.calendarView}>
                  <CalendarImage
                    style={styles.calendarIcon}
                    width={25}
                    height={25}
                  />
                  {calendarTypeval === "Multiple" ? (
                    <Text style={[styles.textStyleHeading]}>
                      {moments(startmultidate)
                        .tz(timeZonecheckval)
                        .format("DD MMM YYYY") +
                        " - " +
                        moments(endmultidate)
                          .tz(timeZonecheckval)
                          .format("DD MMM YYYY")}
                    </Text>
                  ) : (
                    <Text style={[styles.textStyleHeading]}>
                      {moments(singlestartdate)
                        .tz(timeZonecheckval)
                        .format("DD MMM YYYY, dddd")}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={COLORS.GrayLight}
            returnKeyType="next"
            placeholder={translation.ArtTest.SearchStaff}
            value={searchText}
            onChangeText={(searchText: string) => {
              if (searchText === "") {
                onRefresh();
              }
              setSearchText(searchText);
              search(searchText);
            }}
          />
          <Image
            source={require("../../assets/icons/Search-icon.png")}
            style={styles.iconStyle}
          />
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterByText}>
            {translation.ArtTest.FilterBy}:{" "}
          </Text>
          <View
            style={[
              styles.picker,
              Platform.OS === "android" && open && styles.androidContainer,
            ]}
          >
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              showTickIcon={false}
              dropDownDirection="BOTTOM"
              textStyle={styles.dropdownText}
              style={styles.dropdownStyle}
              placeholderStyle={styles.placeholderText}
              dropDownContainerStyle={{ borderColor: COLORS.Blue }}
              onChangeValue={(item) => {
                filterList(item);
              }}
              // onSelectItem={(item) => {
              //   filterList(item.value);
              // }}
            />
          </View>
        </View>
        <View
          style={[
            styles.bottomBorder,
            { marginTop: Platform.OS === "android" ? hp(15) : hp(0) },
          ]}
        />
        {datalist &&
          datalist.map((item, index) => {
            return staffTestCard(
              index,
              item.staffName,
              item.role,
              item.testResult
            );
          })}
        {datalist.length === 0 ? (
          <View style={styles.noArt}>
            <View style={styles.noArtData}>
              <Text style={styles.noArtDataText}>
                {translation.ArtTest.NoStaffData}
              </Text>
            </View>
          </View>
        ) : (
          <View />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.White,
    borderWidth: wp(1),
    borderColor: COLORS.Grey2,
    height: hp(56),
    borderRadius: wp(10),
    marginLeft: wp(24),
    marginRight: wp(24),
    marginTop: hp(25),
    textAlignVertical: "center",
  },
  textInput: {
    width: wp(290),
    paddingLeft: wp(12),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
    fontSize: hp(18),
  },
  iconStyle: {
    width: wp(24),
    height: hp(24),
    marginTop: hp(16),
    marginRight: wp(16),
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(327),
    marginTop: hp(22),
    marginBottom: hp(18),
    marginLeft: wp(24),
  },
  filterByText: {
    fontSize: hp(16),
    fontWeight: "600",
    marginTop: hp(10),
    alignSelf: "center",
    textAlign: "center",
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
  },
  bottomBorder: {
    width: wp(327),
    alignSelf: "center",
    borderBottomWidth: wp(1),
    borderBottomColor: COLORS.LightGrey,
    zIndex: -1,
  },
  picker: {
    width: wp(234),
    height: hp(42),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(10),
    minHeight: hp(42),
  },
  dropdown: {
    width: wp(24),
    height: hp(24),
  },
  pickerButton: {
    width: wp(234),
    borderRadius: wp(10),
    backgroundColor: COLORS.White,
  },
  dropdownText: {
    fontSize: hp(15),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
  },
  dropdownStyle: {
    backgroundColor: COLORS.White,
    borderColor: COLORS.Blue,
    borderWidth: wp(1),
  },
  placeholderText: {
    color: COLORS.DarkGrey,
    fontSize: hp(16),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
  },
  colorIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
  },
  cardContainer: {
    width: wp(326),
    minHeight: hp(124),
    backgroundColor: COLORS.LightGrey,
    alignSelf: "center",
    borderRadius: wp(10),
    marginVertical: hp(8),
    zIndex: -1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: hp(16),
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "600",
    color: COLORS.DarkGrey,
    marginTop: hp(15),
    width: wp(170),
    flexWrap: "wrap",
  },
  testResultContainer: {
    width: wp(286),
    height: hp(39),
    marginTop: hp(25),
    marginBottom: hp(25),
    borderRadius: wp(6),
    backgroundColor: COLORS.White,
    alignSelf: "center",
    justifyContent: "center",
    // position: 'absolute'
  },
  testResult: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "700",
    textAlign: "center",
  },
  mainCalendarView: {
    marginTop: hp(20),
    justifyContent: "center",
    alignItems: "center",
  },
  calendarView: {
    width: wp(298),
    height: hp(50),
    borderRadius: hp(22),
    borderWidth: wp(1),
    borderColor: COLORS.Blue,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    padding: hp(10),
  },
  calendarIcon: {
    marginLeft: wp(20),
  },
  textStyleHeading: {
    flex: 1,
    fontSize: wp(16),
    fontWeight: "600",
    marginLeft: wp(-20),
    color: COLORS.DarkGrey,
    textAlign: "center",
    fontFamily: FONTS.Urbanist_Semibold,
  },
  androidContainer: {
    minHeight: 170,
  },
  noArt: {
    marginLeft: wp(24),
    marginTop: hp(20),
    zIndex: -1,
  },
  noArtData: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: hp(10),
  },
  noArtDataText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: hp(17),
    fontFamily: FONTS.Urbanist,
    fontWeight: "700",
    color: COLORS.DarkGrey,
  },
});

export default ArtTestStaff;
