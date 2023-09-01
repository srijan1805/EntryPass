import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import translation from "../../assets/translations/translate";
import { hp, wp } from "../../utils/responsive-helper";
import { COLORS } from "../../constants/color";
import { FONTS } from "../../constants/font";
import { CommonActions, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Buttons } from "../../components/Buttons";
import { useDispatch } from "react-redux";
import { getVaccinations } from "../../store/Vaccinations/Vaccinations";
import { profileRetrieveData } from "../../store/User/UserDetails";
import NavigationHeader from "../../components/NavigationHeader";

const VaccinationDetails = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [Name, setName] = useState("No Data Found");
  const [EmpNo, setEmpNo] = useState("No Data Found");
  const [HepBScreeningDate, SetHepBScreeningDate] = useState("NA");
  const [HepCScreeningDate, SetHepCScreeningDate] = useState("NA");
  const [HIVScreeningDate, SetHIVScreeningDate] = useState("NA");
  const [vaccinationResultData, setvaccinationResultData] = useState([]);
  const notApplicable = "NA";
  const StaffID = props.route.params.StaffID;
  const Type = props.route.params.Type;

  useEffect(() => {
    if (Type === "self") {
      profileRetrieveData().then((resp) => {
        setName(resp.employeeName);
        setEmpNo(resp.qrPassCode);
      });
    }
    dispatch(getVaccinations(StaffID)) //UEMSS36323
      .then((data: any) => {
        let notificationsData = data.payload;
        notificationsData.ListEmployeeDetailsData &&
          notificationsData.ListEmployeeDetailsData.map((item: any) => {
            setName(item.Name);
            setEmpNo(item.EmpNo);
            SetHepBScreeningDate(item.HepBScreeningDate);
            SetHepCScreeningDate(item.HepCScreeningDate);
            SetHIVScreeningDate(item.HIVScreeningDate);
          });
        setvaccinationResultData(notificationsData.ListVaccinationDetailsData);
      })
      .catch((err: any) => {
        if (err !== "undefined" && err.toString().includes("Network Error")) {
          alert(translation.AddressVerification.oops_network_err_msg);
        }
      });
  }, []);

  const vaccinationCard = (
    VaccinationName,
    Frequency,
    DOVDose1,
    DueDateDose1,
    StatusDose1,
    DOVDose2,
    DueDateDose2,
    StatusDose2,
    DOVDose3,
    DueDateDose3,
    StatusDose3
  ) => {
    let TotalDoses = getTotalDoses(StatusDose1, StatusDose2, StatusDose3);
    let vacStatus1 = StatusDose1.toString().toLowerCase();
    let vacStatus2 = StatusDose2.toString().toLowerCase();
    let vacStatus3 = StatusDose3.toString().toLowerCase();

    return (
      <View style={styles.vaccinationCardContainer}>
        <View style={styles.vaccinationDetailsContainer}>
          <Text style={styles.vaccinationName}>{VaccinationName}</Text>
          <Text style={styles.vaccinationTypeDose}>{Frequency}</Text>

          <View style={styles.divider} />

          <View style={styles.vaccinationTypeContainer}>
            <Text style={styles.vaccinationTypeDose}>
              {translation.Vaccination.Dose}
            </Text>
          </View>

          {vacStatus3 !== "n/a" ? (
            <View style={styles.vaccinationDetailsRow}>
              <View style={styles.vaccinationDateContainer}>
                <Text style={styles.vaccinationDate}>{TotalDoses--}</Text>
              </View>

              <View
                style={[
                  styles.vaccinationStatusContainer,
                  {
                    backgroundColor:
                      vacStatus3 === "overdue"
                        ? COLORS.Red
                        : vacStatus3 === "done"
                        ? COLORS.Green
                        : COLORS.Yellow,
                    flex: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.vaccinationStatus,
                    {
                      color:
                        vacStatus3 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus3 === "done"
                    ? "Completed"
                    : vacStatus3 == "upcoming"
                    ? "Upcoming"
                    : "Overdue"}
                </Text>
                <Text
                  style={[
                    styles.hypen,
                    {
                      color:
                        vacStatus3 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {" "}
                  -{" "}
                </Text>
                <Text
                  style={[
                    styles.nextVaccinationDate,
                    {
                      color:
                        vacStatus3 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus3 === "done"
                    ? moment
                        .utc(new Date(ConvertDate(DOVDose3))) //2022-01-12
                        .local()
                        .format("DD MMMM yyyy")
                    : DueDateDose3 == ""
                    ? moment
                        .utc(new Date(ConvertDate(DueDateDose3))) //2022-01-12
                        .local()
                        .format("DD MMMM yyyy")
                    : notApplicable}
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}
          {vacStatus2 !== "n/a" ? (
            <View style={styles.vaccinationDetailsRow}>
              <View style={styles.vaccinationDateContainer}>
                <Text style={styles.vaccinationDate}>{TotalDoses--}</Text>
              </View>

              <View
                style={[
                  styles.vaccinationStatusContainer,
                  {
                    backgroundColor:
                      vacStatus2 === "overdue"
                        ? COLORS.Red
                        : vacStatus2 === "done"
                        ? COLORS.Green
                        : COLORS.Yellow,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.vaccinationStatus,
                    {
                      color:
                        vacStatus2 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus2 === "done"
                    ? "Completed"
                    : vacStatus2 == "upcoming"
                    ? "Upcoming"
                    : "Overdue"}
                </Text>
                <Text
                  style={[
                    styles.hypen,
                    {
                      color:
                        vacStatus2 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {" "}
                  -{" "}
                </Text>
                <Text
                  style={[
                    styles.nextVaccinationDate,
                    {
                      color:
                        vacStatus2 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus2 === "done"
                    ? moment
                        .utc(new Date(ConvertDate(DOVDose2))) //2022-01-12
                        .local()
                        .format("DD MMMM yyyy")
                    : DueDateDose2 !== ""
                    ? moment
                        .utc(new Date(ConvertDate(DueDateDose2))) //2022-01-12
                        .local()
                        .format("DD MMMM yyyy")
                    : notApplicable}
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}

          {vacStatus1 !== "n/a" ? (
            <View style={styles.vaccinationDetailsRow}>
              <View style={styles.vaccinationDateContainer}>
                <Text style={styles.vaccinationDate}> {TotalDoses--} </Text>
              </View>

              <View
                style={[
                  styles.vaccinationStatusContainer,
                  {
                    backgroundColor:
                      vacStatus1 === "overdue"
                        ? COLORS.Red
                        : vacStatus1 === "done"
                        ? COLORS.Green
                        : COLORS.Yellow,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.vaccinationStatus,
                    {
                      color:
                        vacStatus1 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus1 === "done"
                    ? "Completed"
                    : vacStatus1 == "upcoming"
                    ? "Upcoming"
                    : "Overdue"}
                </Text>

                <Text
                  style={[
                    styles.hypen,
                    {
                      color:
                        vacStatus1 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {" "}
                  -{" "}
                </Text>
                <Text
                  style={[
                    styles.nextVaccinationDate,
                    {
                      color:
                        vacStatus1 === "upcoming"
                          ? COLORS.DarkGrey
                          : COLORS.White,
                    },
                  ]}
                >
                  {vacStatus1 === "done"
                    ? moment
                        .utc(new Date(ConvertDate(DOVDose1)))
                        .local()
                        .format("DD MMMM yyyy")
                    : DueDateDose1 !== ""
                    ? moment
                        .utc(new Date(ConvertDate(DueDateDose1)))
                        .local()
                        .format("DD MMMM yyyy")
                    : notApplicable}
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        title={translation.Vaccination.Vaccination}
        onPressCallBack={() => navigation.goBack()}
      />
      {/* Design the screen */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.employeeDetailsContainer}>
          <View style={styles.employeeColumnContainer}>
            <View style={[styles.employeeColumn, { marginTop: hp(25) }]}>
              <Text style={styles.employeeTitle}>
                {translation.ArtTest.EmployeeName}
              </Text>
              <Text style={styles.employeeContent}>{Name}</Text>
            </View>
            <View style={[styles.employeeColumn, { marginTop: hp(10) }]}>
              <Text style={styles.employeeTitle}>
                {translation.ArtTest.EmployeeNo}
              </Text>
              <Text style={styles.employeeContent}>{EmpNo}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.vaccinationTitle}>
          {translation.Vaccination.VaccinationScreeningDetails}
        </Text>
        <View style={styles.vaccinationScreeningContainer}>
          <View
            style={[
              styles.vaccinationScreeningBlock,
              {
                borderRightColor: COLORS.White,
                borderRightWidth: wp(1),
                borderTopLeftRadius: wp(7),
                borderBottomLeftRadius: wp(7),
              },
            ]}
          >
            <Text style={styles.vaccinationBlockTitle}>
              {translation.Vaccination.hep_b}
            </Text>
            <Text style={styles.vaccinationBlockSubTitle}>
              {ConvertDate(HepBScreeningDate)}
            </Text>
          </View>
          <View
            style={[
              styles.vaccinationScreeningBlock,
              {
                borderRightColor: COLORS.White,
                borderRightWidth: wp(1),
              },
            ]}
          >
            <Text style={styles.vaccinationBlockTitle}>
              {translation.Vaccination.hep_c}
            </Text>
            <Text style={styles.vaccinationBlockSubTitle}>
              {ConvertDate(HepCScreeningDate)}
            </Text>
          </View>
          <View
            style={[
              styles.vaccinationScreeningBlock,
              {
                borderTopRightRadius: wp(7),
                borderBottomRightRadius: wp(7),
              },
            ]}
          >
            <Text style={styles.vaccinationBlockTitle}>
              {translation.Vaccination.hiv}
            </Text>
            <Text style={styles.vaccinationBlockSubTitle}>
              {ConvertDate(HIVScreeningDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.vaccinationListTitle}>
          {translation.Vaccination.VaccinationDetails}
        </Text>
        <View>
          {vaccinationResultData &&
            vaccinationResultData.map((item, index) => {
              return vaccinationCard(
                item.VaccinationName,
                item.Frequency,
                item.DOVDose1,
                item.DueDateDose1,
                item.StatusDose1,
                item.DOVDose2,
                item.DueDateDose2,
                item.StatusDose2,
                item.DOVDose3,
                item.DueDateDose3,
                item.StatusDose3
              );
            })}
        </View>

        <Buttons
          onPress={() => {
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
          }}
          text={translation.Vaccination.Done}
          BTNstyle={{ ...styles.buttonStyle }}
          textStyle={{ ...styles.buttonTxt }}
          ImgStyle={undefined}
          loader={undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

function getTotalDoses(dose1, dose2, dose3) {
  let count = 0;
  if (dose1 !== "N/A") count++;
  if (dose2 !== "N/A") count++;
  if (dose3 !== "N/A") count++;
  return count;
}

function ConvertDate(data) {
  let var1 = data.replace("/", " ");
  let var2 = var1.replace("/", " ");
  return var2;
}

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
    alignSelf: "center",
    borderRadius: wp(9),
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: COLORS.LightGrey,
  },
  employeeDetailsImage: {
    width: wp(97),
    height: hp(122),
    borderRadius: wp(15),
    alignSelf: "center",
    marginLeft: wp(19),
    resizeMode: "contain",
  },
  employeeColumnContainer: {
    flexDirection: "column",
  },
  employeeColumn: {
    flexDirection: "column",
    marginLeft: wp(22),
  },
  employeeTitle: {
    fontSize: hp(16),
    fontWeight: "400",
    fontFamily: FONTS.Urbanist,
    lineHeight: hp(22),
    color: COLORS.DarkGrey,
  },
  employeeContent: {
    width: wp(169),
    flexWrap: "wrap",
    fontSize: hp(16),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist_Semibold,
    lineHeight: hp(22),
    color: COLORS.DarkGrey,
  },
  vaccinationTitle: {
    fontSize: hp(18),
    fontWeight: "700",
    marginLeft: wp(24),
    marginTop: hp(32),
    marginBottom: hp(11.5),
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
  },
  vaccinationScreeningContainer: {
    width: wp(330),
    height: hp(80.4),
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: wp(24),
  },
  vaccinationScreeningBlock: {
    width: wp(110),
    flexDirection: "column",
    paddingLeft: wp(14),
    backgroundColor: COLORS.Blue + "4D",
  },
  vaccinationBlockTitle: {
    width: wp(82),
    flexWrap: "wrap",
    fontSize: hp(14),
    fontWeight: "600",
    paddingTop: hp(21),
    justifyContent: "center",
    fontFamily: FONTS.Urbanist_Medium,
    color: COLORS.DarkGrey,
  },
  vaccinationBlockSubTitle: {
    fontSize: hp(14),
    marginTop: hp(5),
    fontWeight: "400",
    fontFamily: FONTS.Urbanist,
    color: COLORS.DarkGrey,
  },
  vaccinationListTitle: {
    fontSize: hp(18),
    fontWeight: "700",
    fontFamily: FONTS.Urbanist_Semibold,
    marginTop: hp(35),
    marginLeft: wp(24),
    marginBottom: hp(14),
    color: COLORS.DarkGrey,
  },

  // vaccination card
  vaccinationCardContainer: {
    width: wp(326),
    flexDirection: "row",
    marginLeft: wp(24),
    marginRight: wp(24),
    marginTop: hp(10),
    marginBottom: hp(10),
    borderWidth: wp(1),
    borderColor: COLORS.LightGrey,
    borderRadius: wp(9),
  },
  vaccinationDateContainer: {
    width: wp(45),
    height: hp(45),
    flexDirection: "column",
    justifyContent: "space-around",
    borderRadius: wp(5),
    backgroundColor: COLORS.LightGrey + "80",
  },
  vaccinationDate: {
    textAlign: "center",
    fontSize: hp(18),
    fontWeight: "600",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Semibold,
  },
  vaccinationMonthYear: {
    textAlign: "center",
    fontSize: hp(12),
    fontWeight: "400",
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist,
  },
  vaccinationDetailsContainer: {
    width: wp(320),
    marginTop: hp(12),
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  vaccinationName: {
    fontSize: hp(16),
    fontWeight: "600",
    width: wp(200),
    flexWrap: "wrap",
    marginLeft: wp(11),
    color: COLORS.DarkGrey,
    fontFamily: FONTS.Urbanist_Bold,
  },
  vaccinationDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    marginTop: hp(10),
    marginBottom: hp(10),
    marginLeft: wp(11),
    flex: 1,
  },
  vaccinationTypeContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  vaccinationTypeDose: {
    fontSize: hp(14),
    fontWeight: "400",
    width: wp(110),
    flexWrap: "wrap",
    color: COLORS.DarkGrey,
    marginLeft: wp(11),
    fontFamily: FONTS.Urbanist,
    marginTop: hp(10),
  },
  vaccinationStatusContainer: {
    width: wp(246),
    height: hp(45),
    borderRadius: wp(8),
    marginLeft: wp(10),
    marginRight: wp(10),
    flexDirection: "row",
    alignItems: "center",
  },
  vaccinationStatus: {
    fontSize: hp(14),
    fontWeight: "700",
    textAlign: "right",
    marginLeft: wp(10),
    fontFamily: FONTS.Urbanist_Medium,
  },
  hypen: {
    fontSize: hp(14),
    fontWeight: "700",
    textAlign: "center",
    fontFamily: FONTS.Urbanist_Medium,
  },
  nextVaccinationDate: {
    fontSize: hp(14),
    fontWeight: "600",
    textAlign: "right",
    marginRight: wp(10),
    fontFamily: FONTS.Urbanist,
  },
  buttonStyle: {
    padding: wp(10),
    width: wp(326),
    height: hp(54),
    backgroundColor: COLORS.Blue,
    marginTop: hp(20),
    marginBottom: hp(20),
    borderRadius: wp(10),
    marginLeft: wp(24),
  },
  buttonTxt: {
    fontSize: hp(18),
    alignItems: "center",
    textAlign: "center",
    color: COLORS.White,
    fontFamily: FONTS.Urbanist_Semibold,
    paddingTop: hp(5),
  },
  divider: {
    backgroundColor: COLORS.LightGrey,
    height: hp(1),
    width: wp(324),
    marginTop: hp(10),
    marginBottom: hp(10),
  },
});

export default VaccinationDetails;
