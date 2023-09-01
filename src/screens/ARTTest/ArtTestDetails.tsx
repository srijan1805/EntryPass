import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import translation from "../../assets/translations/translate";
import { COLORS } from "../../constants/color";
import { hp, wp } from "../../utils/responsive-helper";
import { FONTS } from "../../constants/font";
import LoaderView from "../../components/Loader";
import moment from "moment";
import { Buttons } from "../../components/Buttons";
import { useDispatch } from "react-redux";
import { ArtTestSubmit, GetArtTestDetails } from "../../utils/ArtTestAPI";
import { getProfileDetailsAPI } from "../../utils/ProfileNetworkAPI";
import { getTestKitBrandDetails } from "../../store/ArtTest/ArtTest";
import CalendarARTView from "../../components/CalendarARTView";
import RNFetchBlob from "rn-fetch-blob";
import { uploadImage } from "../../utils/AuditAPI";
import { timeZonecheck } from "../../store/User/UserDetails";
import moments from "moment-timezone";
DropDownPicker.setListMode("SCROLLVIEW");

const ArtTestDetails = (props) => {
  // var moments = require('moment-timezone');
  let timeZonecheckval = timeZonecheck();

  const navigation = useNavigation();
  const [testResultIsPositive, setTestResultPositive] = useState(false);
  const [temp, setTemp] = useState("");
  const [time, setTime] = useState(new Date());
  const [remarks, setRemarks] = useState("");
  const [getstate, setState] = useState([]);
  const [testKitBrand, setTestKitBrand] = useState("");
  const [imgUri, setImgUri] = useState("");
  const [imgName, setimgName] = useState("");
  const [isShown, setisShown] = useState(false);
  const [lastTestDate, setLastTestDate] = useState("");
  const [empName, setEmpName] = useState("");
  const [empID, setEmpID] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState({
    evidance: false,
    testKitBrand: false,
    remarks: false,
  });

  let FileName = "";
  //Multiple------
  const [startmultidate, setstartmultiDate] = useState<Date | undefined>(
    props.route.params.multiStartdate
  );
  const [endmultidate, setendMultiDate] = useState<Date | undefined>(
    props.route.params.multiEnddate
  );

  //Single------
  const [singlestartdate, setsinglestartdate] = useState<Date | undefined>(
    props.route.params.singleStartdates || new Date()
  );
  const [singleenddate, setsingleenddate] = useState<Date | undefined>(
    props.route.params.singleEnddates
  );
  const [calendarTypeval, setcalendarTypeval] = useState("Single");

  let auditData = {};

  const employeeID = props.route.params.employeeID;

  const dispatch = useDispatch();

  const [items, setItems] = useState([]);

  const text1 = useRef();
  const text2 = useRef();

  useEffect(() => {
    setisLoading(true);
    getProfileDetailsAPI(employeeID)
      .then((data) => {
        setEmpName(data.result.employeeName);
        setEmpID(data.result.empNameId);
        setisLoading(false);
      })
      .catch((err) => console.log(err));
    GetArtTestDetails(employeeID)
      .then((data: any) => {
        setLastTestDate(data.result.lastDate);
        setisLoading(false);
      })
      .catch((err) => console.log(err));
    setisLoading(false);
    //Get Test Kit Brand Data from API
    dispatch(getTestKitBrandDetails())
      .then((data: any) => {
        let testKit = data.payload;
        let str = JSON.stringify(testKit);
        str = str.replace(/\"id\":/g, '"label":');
        str = str.replace(/\"name\":/g, '"value":');
        let json = JSON.parse(str);
        setItems(json);
      })
      .catch((err: any) => {});
  }, []);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const currentTime = {
    hours: moment.utc(time).local().format("hh"),
    mins: moment.utc(time).local().format("mm"),
    amPm: moment.utc(time).local().format("A"),
  };

  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);

  var ImagePicker = require("react-native-image-picker");
  const openGallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        // const source = { uri: response.uri };
        setState(response.assets);
      }
    });
  };

  useEffect(() => {
    getstate.map((item) => {
      // console.log(item.fileName);
      setimgName(item.fileName);
      setImgUri(item.uri);
    });
  });
  FileName = imgName.replace("rn_image_picker_lib_temp_", "");

  const deleteImage = () => {
    setState([]);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const realPath =
    Platform.OS === "ios" ? imgUri.replace("file://", "") : imgUri;

  let data = [
    {
      name: "file",
      type: "image/png",
      filename: FileName,
      data: RNFetchBlob.wrap(decodeURIComponent(realPath)),
    },
  ];

  const tooglemodel = (
    calendartype: any,
    startsingleDateVal: Date,
    endsingleDateVal: Date,
    startmultiDateVal: Date,
    endmultiDateVal: Date
  ) => {
    let multistartdateform = moments(startmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");

    let multienddateform = moments(endmultiDateVal)
      .tz(timeZonecheckval)
      .format("YYYY-MM-DD");

    setstartmultiDate(startmultiDateVal);
    setendMultiDate(endmultiDateVal);
    setsingleenddate(endsingleDateVal);
    setsinglestartdate(startsingleDateVal);
    setcalendarTypeval(calendartype);
    setisShown(false);
  };

  function showErrorMessages() {
    return (
      <View
        style={{ flexDirection: "row", marginLeft: wp(24), marginTop: hp(3) }}
      >
        <Image
          style={{ width: wp(15), height: hp(15), resizeMode: "contain" }}
          source={require("../../assets/icons/Pending-Red.png")}
        />
        <Text style={styles.errorMsg}>
          {translation.ArtTest.this_field_cannot_be_empty}
        </Text>
      </View>
    );
  }

  const createAlert = () => {
    Alert.alert(translation.ArtTest.del_img, translation.ArtTest.r_u_sure_del, [
      {
        text: translation.ArtTest.Cancel,
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: translation.ArtTest.Yes,
        onPress: () => deleteImage(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoaderView loading={isLoading} />
      <View style={styles.header}>
        <CalendarARTView
          needToShow={isShown}
          tooglemodel={tooglemodel}
          calendarType={calendarTypeval}
          startsingleDateVal={singlestartdate}
          endsingleDateVal={singleenddate}
          startmultiDateVal={startmultidate}
          endmultiDateVal={endmultidate}
          viewtypePassed={"ART"}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Image
              style={styles.backButton}
              source={require("../../assets/icons/BackArrow.png")}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translation.ArtTest.ArtTest}</Text>
      </View>
      {/* Design the screen */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>
          <View style={styles.employeeDetailsContainer}>
            <View style={[styles.employeeColumn, { marginTop: hp(25) }]}>
              <Text style={styles.employeeTitle}>
                {translation.ArtTest.EmployeeName}
              </Text>
              <Text style={styles.employeeContent}>{empName}</Text>
            </View>
            <View style={[styles.employeeColumn, { marginTop: hp(10) }]}>
              <Text style={styles.employeeTitle}>
                {translation.ArtTest.EmployeeNo}
              </Text>
              <Text style={styles.employeeContent}>{empID}</Text>
            </View>
          </View>

          <View style={styles.lastTestDateContainer}>
            <Text style={styles.lastTestDateTitle}>
              {translation.ArtTest.LastTestDate}
            </Text>
            <Text style={styles.lastTestDateContent}>
              {lastTestDate && Platform.OS === "android"
                ? moments.utc(lastTestDate).format("DD MMM YYYY, hh:mm A")
                : lastTestDate && Platform.OS === "ios"
                ? moments
                    .utc(lastTestDate)
                    .tz(timeZonecheckval)
                    .format("DD MMM YYYY, HH:mm:ss")
                : ""}
            </Text>
          </View>
          <View style={styles.bottomBorder} />
          <Text style={styles.sectionTitle}>
            {translation.ArtTest.TestDate}
          </Text>
          {/* Calendar */}
          <TouchableOpacity
            onPress={() => {
              setcalendarTypeval("Single");
              setisShown(true);
            }}
          >
            <View style={styles.calendar}>
              <Text style={styles.calendarTextField}>
                {moments(singlestartdate)
                  .tz(timeZonecheckval)
                  .format("DD/MM/YYYY")}
              </Text>
              <Image
                source={require("../../assets/icons/Calendar.png")}
                style={styles.calendarIcon}
              />
            </View>
          </TouchableOpacity>
          <View />
          <Text style={styles.sectionTitle}>
            {translation.ArtTest.TestTime}
          </Text>
          {/* Time picker */}
          <TouchableOpacity onPress={showDatePicker}>
            <View style={styles.timeContainer}>
              <View style={styles.timeHrsContainer}>
                <Text style={styles.timeHrsText}>{currentTime.hours}</Text>
              </View>
              <Text style={styles.timeColon}>:</Text>
              <View style={styles.timeHrsContainer}>
                <Text style={styles.timeHrsText}>{currentTime.mins}</Text>
              </View>
              <View style={styles.amPmContainer}>
                <View
                  style={[
                    styles.amPm,
                    {
                      backgroundColor:
                        currentTime.amPm === "AM" ? COLORS.Blue : COLORS.White,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.amPmText,
                      {
                        color:
                          currentTime.amPm === "AM"
                            ? COLORS.White
                            : COLORS.Black,
                      },
                    ]}
                  >
                    {translation.ArtTest.am}
                  </Text>
                </View>
                <View
                  style={[
                    styles.amPm,
                    {
                      backgroundColor:
                        currentTime.amPm === "PM" ? COLORS.Blue : COLORS.White,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.amPmText,
                      {
                        color:
                          currentTime.amPm === "PM"
                            ? COLORS.White
                            : COLORS.Black,
                      },
                    ]}
                  >
                    {translation.ArtTest.pm}
                  </Text>
                </View>
              </View>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              date={new Date()}
              onConfirm={(time: any) => {
                setTime(time);
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            {translation.ArtTest.TestResult}
          </Text>
          {/* Radio button */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setTestResultPositive(false);
                }}
              >
                <View
                  style={[
                    styles.tabStyle,
                    {
                      backgroundColor: !testResultIsPositive
                        ? COLORS.Green
                        : COLORS.White,
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={styles.checkMarkResult}
                      source={
                        !testResultIsPositive
                          ? require("../../assets/icons/Checked-Select.png")
                          : require("../../assets/icons/Unchecked.png")
                      }
                    />
                    <Text
                      style={[
                        styles.testResult,
                        {
                          color: !testResultIsPositive
                            ? COLORS.White
                            : COLORS.DarkGrey,
                        },
                      ]}
                    >
                      {translation.ArtTest.Negative}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  setTestResultPositive(true);
                }}
              >
                <View
                  style={[
                    styles.tabStyle,
                    {
                      backgroundColor: testResultIsPositive
                        ? COLORS.Red
                        : COLORS.White,
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={[styles.checkMarkResult]}
                      source={
                        testResultIsPositive
                          ? require("../../assets/icons/Checked-Select.png")
                          : require("../../assets/icons/Unchecked.png")
                      }
                    />
                    <Text
                      style={[
                        styles.testResult,
                        {
                          color: testResultIsPositive
                            ? COLORS.White
                            : COLORS.DarkGrey,
                        },
                      ]}
                    >
                      {translation.ArtTest.Positive}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <Text style={styles.sectionTitle}>
            {translation.ArtTest.Evidence}
          </Text>
          {/* Upload image */}
          <View style={styles.uploadImageContainer}>
            <Text style={styles.uploadImage}>
              {translation.ArtTest.UploadImage}
            </Text>
            <Buttons
              onPress={() => openGallery()}
              text={translation.ArtTest.SelectImage}
              BTNstyle={{ ...styles.selectButtonStyle }}
              textStyle={{ ...styles.selectButtonTxt }}
              ImgStyle={undefined}
              loader={undefined}
            />
          </View>
          <View style={styles.previewContainer}>
            {getstate.length > 0 ? (
              <>
                <View style={styles.ImageContainer}>
                  <Image source={{ uri: imgUri }} style={styles.previewImage} />
                  <Text style={styles.ImageName}>{FileName}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.deleteContainer}
                    onPress={() => createAlert()}
                  >
                    <Image
                      source={require("../../assets/icons/trash.png")}
                      style={styles.delete}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.FileName}>
                {translation.ArtTest.FileName}
              </Text>
            )}
            {error.evidance ? showErrorMessages() : <View />}
          </View>
          <View style={styles.bottomBorder} />
          <Text style={styles.sectionTitle}>
            {translation.ArtTest.TestKitBrand}
          </Text>
          {/* Test kit brand */}
          <View
            style={[
              styles.dropdown,
              Platform.OS === "android" && open
                ? { minHeight: items.length * hp(75) }
                : {},
            ]}
          >
            {items && items.length !== 0 ? (
              <DropDownPicker
                schema={{
                  label: "value",
                  value: "value",
                }}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                showTickIcon={false}
                dropDownDirection="BOTTOM"
                placeholder={translation.ArtTest.SelectTestKit}
                placeholderStyle={styles.placeholderText}
                onSelectItem={(item) => {
                  setTestKitBrand(item.value);
                  setError({ ...error, testKitBrand: false });
                }}
                textStyle={styles.text}
                style={styles.dropdownStyle}
                dropDownContainerStyle={{ borderColor: COLORS.LightGrey }}
              />
            ) : (
              <View />
            )}
          </View>
          {error.testKitBrand ? showErrorMessages() : <View />}
          <Text style={[styles.sectionTitle, { zIndex: open ? -1 : 0 }]}>
            {translation.ArtTest.Temperature} (
            {translation.ArtTest.Optional.toLowerCase()})
          </Text>
          {/* Temperature */}
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={COLORS.placeHolderColor}
            returnKeyType="next"
            ref={text1}
            onSubmitEditing={() => {
              text2.current.focus();
              // text2.current.focus();
            }}
            onEndEditing={() => {
              setTemp(temp.trim().replace(/\s+/g, " "));
            }}
            editable={true}
            keyboardType="decimal-pad"
            secureTextEntry={false}
            value={temp}
            maxLength={4}
            placeholder={translation.ArtTest.EnterTemperature}
            onChangeText={(temp: any) => {
              setTemp(temp);
            }}
            style={[styles.inputField, { zIndex: open ? -1 : 0 }]}
          />
          <Text style={[styles.sectionTitle, { zIndex: open ? -1 : 0 }]}>
            {translation.ArtTest.Remarks} (
            {translation.ArtTest.Optional.toLowerCase()})
          </Text>
          {/* Remarks */}
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={COLORS.placeHolderColor}
            returnKeyType="next"
            onEndEditing={() => {
              setRemarks(remarks.trim().replace(/\s+/g, " "));
            }}
            ref={text2}
            editable={true}
            multiline
            numberOfLines={7}
            maxLength={500}
            secureTextEntry={false}
            value={remarks}
            placeholder={translation.ArtTest.EnterRemarks}
            onChangeText={(remarks: any) => {
              setRemarks(remarks);
            }}
            // onBlur={() => {
            //   if (remarks.length === 0) {
            //     setError({ ...error, remarks: true });
            //   } else {
            //     setError({ ...error, remarks: false });
            //   }
            // }}
            style={[
              styles.inputField,
              {
                height: hp(129),
                zIndex: open ? -1 : 0,
                textAlignVertical: "top",
              },
            ]}
          />
          {error.remarks ? showErrorMessages() : <View />}
          <Buttons
            onPress={async () => {
              if (testKitBrand.trim() === "" || testKitBrand.trim() === null) {
                setError({ ...error, testKitBrand: true });
              } else {
                if (getstate.length > 0) {
                  setisLoading(true);
                  await uploadImage(data)
                    .then((resp) => {
                      let downloadURI = JSON.parse(resp.data);
                      if (
                        downloadURI.result.trim() === "" ||
                        downloadURI.result.trim() === null
                      ) {
                        setError({ ...error, evidance: true });
                      } else {
                        let d = new Date(singlestartdate);
                        let t = time.toString().substring(16, 24);
                        let date = d.toISOString().substring(0, 10);
                        let dateTime = date + "T" + t;

                        auditData = {
                          testDate: dateTime,
                          testResult: testResultIsPositive,
                          fileName: downloadURI.result,
                          testKit: testKitBrand,
                          temperature: temp,
                          remarks: remarks.trim().replace(/\s+/g, " "),
                        };

                        ArtTestSubmit(auditData, employeeID)
                          .then((resp) => {
                            if (resp.status === 200) {
                              if (resp.data.result.success) {
                                setisLoading(false);
                                navigation.navigate(
                                  "ArtTestDetailsSucessScreen"
                                );
                              } else {
                                setisLoading(false);
                                Alert.alert(
                                  translation.ArtTest.result_unsuccessful
                                );
                              }
                            } else {
                              setisLoading(false);
                              Alert.alert(
                                translation.ArtTest.result_unsuccessful
                              );
                            }
                          })
                          .catch((err) => console.log("ERROR : " + err));
                      }
                    })
                    .catch((err) => {
                      setisLoading(false);
                      Alert.alert(translation.ArtTest.result_unsuccessful);
                    });
                } else {
                  Alert.alert(translation.ArtTest.upload_test_report_image);
                }
              }
            }}
            text={translation.ArtTest.Submit}
            BTNstyle={{ ...styles.subitButtonStyle }}
            textStyle={{ ...styles.subitButtonTxt }}
            ImgStyle={undefined}
            loader={undefined}
          />
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  scrollView: {
    marginBottom: hp(10),
    backgroundColor: COLORS.White,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: hp(24),
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
  employeeDetailsContainer: {
    width: wp(327),
    height: hp(152),
    borderRadius: wp(9),
    backgroundColor: COLORS.LightGrey,
    alignSelf: "center",
  },
  employeeColumn: {
    flexDirection: "column",
    marginLeft: wp(25),
  },
  employeeTitle: {
    fontSize: hp(16),
    fontWeight: "400",
    fontFamily: FONTS.Urbanist,
    lineHeight: hp(22),
    color: COLORS.Black,
  },
  employeeContent: {
    fontSize: hp(16),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist_Semibold,
    lineHeight: hp(22),
    color: COLORS.Black,
  },
  lastTestDateContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  lastTestDateTitle: {
    fontSize: hp(16),
    fontWeight: "500",
    alignSelf: "center",
    fontFamily: FONTS.Urbanist,
    marginTop: hp(25),
    color: COLORS.Black,
  },
  lastTestDateContent: {
    fontSize: hp(16),
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: FONTS.Urbanist_Semibold,
    marginTop: hp(25),
    color: COLORS.Black,
  },
  bottomBorder: {
    width: wp(327),
    alignSelf: "center",
    borderBottomWidth: wp(1),
    borderBottomColor: COLORS.LightGrey,
    marginTop: hp(27),
  },
  sectionTitle: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist_Semibold,
    fontWeight: "700",
    marginTop: hp(20),
    marginLeft: wp(24),
    color: COLORS.Black,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(17),
    marginLeft: wp(24),
    marginRight: wp(24),
  },
  timeHrsContainer: {
    width: wp(86),
    height: hp(55),
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
    borderRadius: wp(7),
    justifyContent: "center",
  },
  timeHrsText: {
    fontSize: hp(18),
    fontFamily: FONTS.Urbanist,
    fontWeight: "600",
    justifyContent: "center",
    textAlign: "center",
    color: COLORS.Black,
  },
  timeColon: {
    fontSize: hp(18),
    fontWeight: "700",
    alignSelf: "center",
    fontFamily: FONTS.Urbanist,
  },
  amPmContainer: {
    width: wp(122),
    height: hp(55),
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: wp(1),
    borderRadius: wp(7),
    borderColor: COLORS.LightGrey,
  },
  amPm: {
    justifyContent: "center",
    width: wp(60),
    alignContent: "center",
    borderRadius: wp(6),
  },
  amPmText: {
    textAlign: "center",
    fontSize: hp(16),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist,
    color: COLORS.Black,
  },
  tabsContainer: {
    width: wp(327),
    marginTop: hp(16),
    marginLeft: wp(24),
    marginRight: wp(24),
    padding: hp(3),
    borderWidth: wp(1),
    borderRadius: wp(10),
    borderColor: COLORS.LightGrey,
  },
  tabs: {
    height: hp(48),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabStyle: {
    borderRadius: wp(7),
    color: COLORS.White,
    fontWeight: "600",
    textAlign: "center",
    width: wp(160),
    paddingHorizontal: wp(10),
    justifyContent: "center",
  },
  checkMarkResult: {
    marginTop: hp(5),
    width: 20,
    height: 20,
  },
  testResult: {
    fontSize: hp(16),
    paddingLeft: wp(10),
    paddingVertical: hp(5),
    textAlignVertical: "center",
    fontFamily: FONTS.Urbanist_Semibold,
  },
  uploadImageContainer: {
    width: wp(327),
    height: hp(102),
    marginTop: hp(17),
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: wp(10),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
  },
  uploadImage: {
    textAlign: "center",
    fontSize: hp(18),
    fontWeight: "500",
    color: COLORS.LightGrey,
    fontFamily: FONTS.Urbanist,
  },
  selectButtonStyle: {
    width: wp(144),
    height: hp(40),
    marginTop: hp(12),
    alignSelf: "center",
    borderRadius: wp(10),
    justifyContent: "center",
    backgroundColor: COLORS.Yellow,
  },
  selectButtonTxt: {
    fontSize: hp(16),
    alignSelf: "center",
    textAlignVertical: "center",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(24),
    marginRight: wp(24),
    width: wp(327),
    marginTop: hp(16),
    justifyContent: "space-between",
  },
  ImageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewImage: {
    height: hp(60),
    width: wp(60),
  },
  ImageName: {
    color: COLORS.LightBlue,
    marginLeft: wp(16),
    width: wp(200),
    flexWrap: "wrap",
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(14),
  },
  deleteContainer: {
    backgroundColor: COLORS.Red,
    borderRadius: wp(36),
    height: wp(36),
    width: wp(36),
    justifyContent: "center",
    alignItems: "center",
  },
  delete: {
    height: hp(27),
    width: wp(22),
    alignSelf: "center",
    resizeMode: "contain",
  },
  FileName: {
    color: COLORS.LightGrey,
    alignSelf: "center",
    fontFamily: FONTS.Urbanist_Medium,
    fontSize: hp(16),
    display: "none",
  },
  dropdown: {
    width: wp(326),
    alignSelf: "center",
    marginTop: hp(18),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(10),
    zIndex: 2,
  },
  dropdownText: {
    fontSize: hp(16),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
  },
  placeholderText: {
    color: COLORS.LightGrey,
    fontSize: hp(18),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
  },
  text: {
    color: COLORS.DarkGrey,
    fontSize: hp(18),
    fontWeight: "500",
    fontFamily: FONTS.Urbanist,
  },
  dropdownContainer: {
    borderColor: COLORS.LightGrey,
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderColor: COLORS.placeHolderColor,
    borderWidth: wp(1),
    width: wp(326),
    borderRadius: wp(10),
    padding: wp(10),
    marginTop: hp(10),
    marginLeft: wp(24),
    marginRight: wp(24),
  },
  calendarIcon: {
    width: wp(24),
    height: wp(24),
    tintColor: COLORS.DarkGrey,
  },
  inputField: {
    fontFamily: FONTS.Urbanist,
    padding: wp(10),
    fontSize: hp(18),
    marginTop: hp(18),
    fontWeight: "500",
    alignSelf: "center",
    borderColor: COLORS.placeHolderColor,
    borderWidth: wp(1),
    width: wp(326),
    borderRadius: wp(10),
    color: COLORS.DarkGrey,
  },
  calendarTextField: {
    fontFamily: FONTS.Urbanist,
    fontSize: hp(18),
    fontWeight: "500",
    alignSelf: "center",
    color: COLORS.DarkGrey,
  },
  subitButtonStyle: {
    width: wp(326),
    height: hp(54),
    marginTop: hp(12),
    marginBottom: hp(28),
    alignSelf: "center",
    borderRadius: wp(10),
    justifyContent: "center",
    backgroundColor: COLORS.Blue,
  },
  subitButtonTxt: {
    fontSize: hp(18),
    alignSelf: "center",
    textAlignVertical: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  errorMsg: {
    color: COLORS.Red,
    marginLeft: wp(4),
    fontFamily: FONTS.Urbanist,
    fontSize: hp(12),
  },
  dropdownStyle: {
    backgroundColor: COLORS.White,
    borderColor: COLORS.LightGrey,
    borderWidth: wp(1),
  },
});

export default ArtTestDetails;
