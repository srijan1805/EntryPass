import * as React from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Login from "../screens/Login/Login";
import ScanQRcodesupervisor from "../screens/Supervisor/ScanQRcodesupervisor";
import Home from "../screens/Home/Home";
import Profile from "../screens/Profile/Profile";
import SuccessfulScreen from "../screens/Supervisor/SuccessfulScreen";
import UnsuccesfulScreen from "../screens/Supervisor/UnsuccesfulScreen";
import DrawerComponent from "../components/DrawerComponent";
import QrScanner from "../screens/QrScanner/QrScanner";
import SelectLanguage from "../screens/SelectLanguage/SelectLanguage";
import AddressHistory from "../screens/Address/AddressHistory/AddressHistory";
import AddressHistoryList from "../screens/Address/AddressHistory/AddressHistoryList";
import AddressVerification from "../screens/AddressVerification/AddressVerification";
import AddressVerificationTextInput from "../screens/AddressVerification/AddressVerificationTextInput";
import CodeVerification from "../screens/CodeVerification/CodeVerification";
import Registration from "../screens/QrScanner/Registration";
import EmployeeVerification from "../screens/AddressVerification/EmployeeVerification";
import AddressVerificationHomeScreen from "../screens/AddressVerification/AddressVerificationHomeScreen";
import NotificationsScreen from "../screens/Notifications/Notifications";
import CaptureImage from "../screens/AddressVerificationRecidence/AddressVerificationImageCapture";
import CaptureHome from "../screens/AddressVerificationRecidence/CaptureResidenceImage";
import UploadResidenceImage from "../screens/AddressVerificationRecidence/UploadResidenceImage";
import AddressVerificationSucessScreen from "../screens/AddressVerification/AddressVerficationSucessScreen";
import AddressVerificationConfirmScreen from "../screens/AddressVerification/AddressVerificationConfirmScreen";
import AttendanceDetail from "../screens/Attendances/AttendanceDetail";
import AttendanceRequestScreen from "../screens/Attendances/AttendanceRequestScreen";
import AttendanceList from "../screens/Attendances/AttendanceList";
import AttendancePreview from "../screens/Attendances/AttendancePreview";
import AttendanceScanner from "../screens/Attendances/AttendanceQRScan";
// import { AddressTabs } from '../screens/AddressVerification/AddressTabs';
import AttendanceHomeScreen from "../screens/Attendance/AttendanceHomeScreen";
import ArtTestHome from "../screens/ARTTest/ArtTestHome";
import ArtTestSelf from "../screens/ARTTest/ArtTestSelf";
import ArtTestStaff from "../screens/ARTTest/ArtTestStaff";
import ArtTestDetails from "../screens/ARTTest/ArtTestDetails";
import ArtTestDetailsSucessScreen from "../screens/ARTTest/ArtTestDetailsSucessScreen";
import VaccinationDetails from "../screens/Vaccination/VaccinationDetails";
import VaccinationHome from "../screens/Vaccination/VaccinationHome";
import ArtTestQrScan from "../screens/ARTTest/ArtTestQrScan";
import HomeDisabled from "../screens/Home/HomeDisabled";
import DisabledDrawerComponent from "../components/DisabledDrawerComponent";

import { COLORS } from "../constants/color";
import { hp, wp } from "../utils/responsive-helper";
import translation from "../assets/translations/translate";
import { FONTS } from "../constants/font";
import { attendance_styles } from "../utils/Styles";
import ProfileDisabled from "../screens/Profile/ProfileDisabled";
import { profileRetrieveData } from "../store/User/UserDetails";
import { notificationsPending } from "../utils/NotificationNetworksAPI";
import CustomAddressTabs from "../screens/AddressVerification/CustomAddressTabs";
import CustomArtTestTabs from "../screens/ARTTest/CustomArtTestTabs";
import CustomAttendanceTabs from "../screens/Attendance/CustomAttendanceTabs";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { isPendingNotifications } from "../store/Notifications/Notifications";
import FacilityChangeQrScanner from "../screens/FacilityChangeQrScanner/FacilityChangeQrScanner";
import GpsAttendance from "../screens/GpsAttendance/GpsAttendance";
import SuccessFacilityScreen from "../screens/FacilityChangeQrScanner/SuccessFacilityScreen";
import AttendanceSuccess from "../screens/Attendances/AttendanceSuccess";
import VaccinationVerificationForOthers from "../screens/Vaccination/VaccinationVerificationForOthers";
import ArtTestForOthers from "../screens/ARTTest/ArtTestForOthers";
import EmployeeDetailsScreen from "../screens/Home/EmployeeDetailsScreen";
import DefaultPromptScreen from "../screens/Home/DefaultPromptScreen";
import VaccinationSuccessScreen from "../screens/Vaccination/VaccinationSuccessScreen";
import ReportingStaffScreen from "../screens/ReportingStaff/ReportingStaffScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const DisabledTab = createBottomTabNavigator();
const AttendanceTab = createMaterialTopTabNavigator();
const ARTTestTab = createMaterialTopTabNavigator();
const AddressTab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, style }) => {
  const progress: any = useDrawerProgress();
  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const backgroundColor = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [COLORS.White, COLORS.PurpleButton],
  });

  const animatedStyles = {
    // borderRadius,
    // backgroundColor,
    transform: [{ scale }],
  };
  return (
    <Animated.View
      style={[
        {
          ...styles.tabAnimatedConatiner,
          backgroundColor: COLORS.PurpleButton,
          borderRadius: borderRadius,
          transform: [{ scale: scale }],
        },
        // animatedStyles,
      ]}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: hp(80) },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  styles.tabBarStyle,
                  {
                    backgroundColor: focused ? COLORS.Yellow : "transparent",
                    borderColor: focused ? COLORS.Yellow : "transparent",
                    borderRadius: focused ? wp(30) : 0,
                  },
                ]}
              >
                <Image
                  source={require("../assets/icons/Home-White.png")}
                  style={[
                    styles.tabIcon,
                    {
                      resizeMode: "contain",
                      tintColor: focused ? COLORS.White : COLORS.Purple,
                    },
                  ]}
                />
              </View>
            ),
          }}
        />

        {/* Add bottom tabs */}

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  styles.tabBarStyle,
                  {
                    backgroundColor: focused ? COLORS.Yellow : "transparent",
                    borderColor: focused ? COLORS.Yellow : "transparent",
                    borderRadius: focused ? wp(30) : 0,
                  },
                ]}
              >
                <Image
                  source={require("../assets/icons/Profile-Purple.png")}
                  style={[
                    styles.tabIcon,
                    {
                      resizeMode: "contain",
                      tintColor: focused ? COLORS.White : COLORS.Purple,
                    },
                  ]}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </Animated.View>
  );
};

export function DisabledTabs() {
  const progress: any = useDrawerProgress();
  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 10],
  });
  return (
    <Animated.View
      style={[
        {
          ...styles.tabAnimatedConatiner,
          backgroundColor: COLORS.PurpleButton,
          borderRadius: borderRadius,
          transform: [{ scale: scale }],
        },
      ]}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: hp(80) },
        }}
      >
        <Tab.Screen
          name="HomeDisabled"
          component={HomeDisabled}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  styles.tabBarStyle,
                  {
                    backgroundColor: focused ? COLORS.Yellow : "transparent",
                    borderColor: focused ? COLORS.Yellow : "transparent",
                    borderRadius: focused ? wp(30) : 0,
                  },
                ]}
              >
                <Image
                  source={require("../assets/icons/Home-White.png")}
                  style={[
                    styles.tabIcon,
                    {
                      resizeMode: "contain",
                      tintColor: focused ? COLORS.White : COLORS.Purple,
                    },
                  ]}
                />
              </View>
            ),
          }}
        />

        {/* Add bottom tabs */}

        <Tab.Screen
          name="ProfileDisabled"
          component={ProfileDisabled}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  styles.tabBarStyle,
                  {
                    backgroundColor: focused ? COLORS.Yellow : "transparent",
                    borderColor: focused ? COLORS.Yellow : "transparent",
                    borderRadius: focused ? wp(30) : 0,
                  },
                ]}
              >
                <Image
                  source={require("../assets/icons/Profile-Purple.png")}
                  style={[
                    styles.tabIcon,
                    {
                      resizeMode: "contain",
                      tintColor: focused ? COLORS.White : COLORS.Purple,
                    },
                  ]}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </Animated.View>
  );
}

export function AttendanceTabs() {
  return (
    <AttendanceTab.Navigator
      tabBar={(props) => <CustomAttendanceTabs {...props} />}
      backBehavior={"initialRoute"}
    >
      <AttendanceTab.Screen
        name="AttendanceHomeScreen"
        component={AttendanceHomeScreen}
      />
      <AttendanceTab.Screen name="AttendanceList" component={AttendanceList} />
    </AttendanceTab.Navigator>
  );
}

function AddressTabs() {
  return (
    <AddressTab.Navigator
      tabBar={(props) => <CustomAddressTabs {...props} />}
      backBehavior={"initialRoute"}
      screenOptions={{
        swipeEnabled: false,
        lazy: true,
      }}
    >
      <AddressTab.Screen
        name="AddressVerificationHomeScreen"
        component={AddressVerificationHomeScreen}
        options={{
          swipeEnabled: false,
          lazy: true,
        }}
      />
      <AddressTab.Screen
        name="AddressHistoryList"
        component={AddressHistoryList}
        options={{
          swipeEnabled: false,
          lazy: true,
        }}
      />
    </AddressTab.Navigator>
  );
}

function Register() {
  const navigation = useNavigation();

  const header = {
    headerLeft: () => (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.back}>
              <Image
                style={styles.backButton}
                source={require("../assets/icons/BackArrow.png")}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {translation.AddressHistory.AddressVerification}
          </Text>
        </View>
      </>
    ),
    headerTitle: "",
  };

  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      {/* <Stack.Screen
        name="SelectLanguage"
        component={SelectLanguage}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="QrScanner"
        component={QrScanner}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyDrawer"
        component={MyDrawer}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SuccessfulScreen"
        component={SuccessfulScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UnsuccesfulScreen"
        component={UnsuccesfulScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddressHistoryList"
        component={AddressHistoryList}
        options={header}
      />
      <Stack.Screen
        name="AddressHistory"
        component={AddressHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressVerificationSucessScreen"
        component={AddressVerificationSucessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressVerificationConfirmScreen"
        component={AddressVerificationConfirmScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressVerification"
        component={AddressVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddressVerificationHomeScreen"
        component={AddressVerificationHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CaptureResidenceImage"
        component={CaptureHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressVerificationImageCapture"
        component={CaptureImage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadResidenceImage"
        component={UploadResidenceImage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CodeVerification"
        component={CodeVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployeeVerification"
        component={EmployeeVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQRcodesupervisor"
        component={ScanQRcodesupervisor}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddressVerificationTextInput"
        component={AddressVerificationTextInput}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AttendanceDetail"
        component={AttendanceDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AttendanceList"
        component={AttendanceList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AttendancePreview"
        component={AttendancePreview}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AttendanceSuccess"
        component={AttendanceSuccess}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AttendanceRequestScreen"
        component={AttendanceRequestScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AttendanceHomeScreen"
        component={AttendanceHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FacilityChangeQrScanner"
        component={FacilityChangeQrScanner}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuccessFacilityScreen"
        component={SuccessFacilityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AttendanceQRScan"
        component={AttendanceScanner}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GpsAttendance"
        component={GpsAttendance}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={"AddressTabs"}
        component={AddressTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestHome"
        component={ArtTestHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestSelf"
        component={ArtTestSelf}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestStaff"
        component={ArtTestStaff}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestDetails"
        component={ArtTestDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestDetailsSucessScreen"
        component={ArtTestDetailsSucessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestQrScan"
        component={ArtTestQrScan}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtTestForOthers"
        component={ArtTestForOthers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VaccinationDetails"
        component={VaccinationDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VaccinationHome"
        component={VaccinationHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VaccinationVerificationForOthers"
        component={VaccinationVerificationForOthers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeDisabled"
        component={HomeDisabled}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployeeDetailsScreen"
        component={EmployeeDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DefaultPromptScreen"
        component={DefaultPromptScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VaccinationSuccessScreen"
        component={VaccinationSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportingStaffScreen"
        component={ReportingStaffScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function CustomArtTestTopTabs() {
  return (
    <ARTTestTab.Navigator
      tabBar={(props) => <CustomArtTestTabs {...props} />}
      backBehavior={"initialRoute"}
    >
      <ARTTestTab.Screen name="ArtTestSelf" component={ArtTestSelf} />
      <ARTTestTab.Screen name="ArtTestStaff" component={ArtTestStaff} />
    </ARTTestTab.Navigator>
  );
}

export function ARTTestTabs() {
  return (
    <ARTTestTab.Navigator
      tabBar={(props) => <CustomArtTestTabs {...props} />}
      backBehavior={"initialRoute"}
    >
      <ARTTestTab.Screen name="ArtTestSelf" component={ArtTestSelf} />
      <ARTTestTab.Screen name="ArtTestStaff" component={ArtTestStaff} />
    </ARTTestTab.Navigator>
  );
}

function MyDrawer(props) {
  const dispatch = useDispatch();
  const isNotifPending = useSelector(
    (state: RootState) => state.notificationState.isPendingNotif
  );

  React.useEffect(() => {
    profileRetrieveData()
      .then((tokenval) => {
        // tokenval.employeeId
        dispatch(isPendingNotifications(tokenval.employeeId));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const navigation = useNavigation();
  const menu = {
    headerStyle: {
      height: Platform.OS === "ios" ? hp(100) : hp(80),
      elevation: 0,
      shadowOpacity: 0,
    },
    headerRight: () => (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={() => {
            navigation.navigate("NotificationsScreen");
          }}
        >
          <View style={isNotifPending ? styles.hasNotification : {}} />
          <Image
            style={styles.notifications}
            source={require("../assets/icons/Notification.png")}
          />
        </TouchableOpacity>
      </>
    ),
    headerLeft: (props) => (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[styles.openDrawer, { marginLeft: wp(16) }]}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Image
            style={styles.logoImg}
            source={require("../assets/icons/menu.png")}
          />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/images/EP-Logo1.png")}
        />
      </>
    ),
    headerTitle: "",
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: COLORS.PurpleButton }}>
      <Drawer.Navigator
        useLegacyImplementation
        drawerStyle={{
          // width: Platform.OS === "ios" ? "100%" : "65%",
          //backgroundColor: COLORS.darkBlue,
          flex: 1,
          width: "50%",
          backgroundColor: "transparent",
        }}
        keyboardDismissMode={"on-drag"}
        screenOptions={{
          drawerType: "slide",
          overlayColor: "transparent",
          drawerContentContainerStyle: {
            flex: 1,
          },
          sceneContainerStyle: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            elevation: 24,
            backgroundColor: "transparent",
          },
          headerShown: false,
        }}
        backBehavior="none"
        drawerContent={(props) => {
          return <DrawerComponent {...props} />;
        }}
      >
        {/* <Drawer.Screen name={"Tabs"} component={Tabs} options={menu} /> */}
        <Drawer.Screen name="Tabs" options={menu}>
          {(props) => <Tabs {...props} />}
        </Drawer.Screen>
        <Drawer.Screen
          name={"AddressTabs"}
          component={AddressTabs}
          options={{ headerShown: false }}
        />

        <Drawer.Screen
          name={"AttendanceTabs"}
          component={AttendanceTabs}
          options={{ headerShown: false }}
        />

        <Drawer.Screen
          name={"ARTTestTabs"}
          component={CustomArtTestTopTabs}
          options={{ headerShown: false }}
        />

        <Drawer.Screen
          name={"CodeVerification"}
          component={CodeVerification}
          options={menu}
        />
      </Drawer.Navigator>
    </Animated.View>
  );
}

function DisabledDrawer(props) {
  const navigation = useNavigation();

  const disabledMenu = {
    headerStyle: {
      height: Platform.OS === "ios" ? hp(100) : hp(80),
      elevation: 0,
      shadowOpacity: 0,
    },
    headerRight: () => (
      <>
        <TouchableOpacity
          // activeOpacity={0.5}
          style={styles.button}
          onPress={() => navigation.navigate("DefaultPromptScreen")}
        >
          <Image
            style={[styles.notifications]}
            source={require("../assets/icons/Notification.png")}
          />
        </TouchableOpacity>
      </>
    ),
    headerLeft: (props) => (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[styles.openDrawer, { marginLeft: wp(16) }]}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Image
            style={styles.logoImg}
            source={require("../assets/icons/menu.png")}
          />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/images/EP-Logo1.png")}
        />
      </>
    ),
    headerTitle: "",
  };

  return (
    <>
      <Animated.View style={{ flex: 1, backgroundColor: COLORS.PurpleButton }}>
        <Drawer.Navigator
          // keyboardDismissMode={"on-drag"}
          // screenOptions={{ drawerType: "back" }}
          useLegacyImplementation
          drawerStyle={{
            // width: Platform.OS === "ios" ? "100%" : "65%",
            //backgroundColor: COLORS.darkBlue,
            flex: 1,
            width: "50%",
            backgroundColor: "transparent",
          }}
          keyboardDismissMode={"on-drag"}
          screenOptions={{
            drawerType: "slide",
            overlayColor: "transparent",
            drawerContentContainerStyle: {
              flex: 1,
            },
            sceneContainerStyle: {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,
              elevation: 24,
              backgroundColor: "transparent",
            },
            headerShown: false,
          }}
          backBehavior="none"
          // drawerContent={(props) => <DisabledDrawerComponent {...props} />}
          drawerContent={(props) => (
            <DrawerComponent isDisabledDrawer={true} {...props} />
          )}
        >
          <Drawer.Screen
            name={"DisabledTabs"}
            component={DisabledTabs}
            options={disabledMenu}
          />
          <Drawer.Screen
            name={"DefaultPromptScreen"}
            component={DefaultPromptScreen}
            options={{ headerShown: false }}
          />
        </Drawer.Navigator>
      </Animated.View>
    </>
  );
}

const getaAppLang = async () => {
  try {
    const appLang = await AsyncStorage.getItem("applanguage");
    return appLang;
  } catch (error) {}
};

function AppNavigation() {
  getaAppLang().then((res: any) => {
    translation.setLanguage(res);
  });

  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name={"Register"} component={Register} />
      <Stack.Screen name={"MyDrawer"} component={MyDrawer} />
      <Stack.Screen name={"DisabledDrawer"} component={DisabledDrawer} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: wp(30),
    height: wp(30),
  },
  tabBarStyle: {
    padding: wp(10),
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? hp(25) : 0,
  },
  tabContainer: {
    height: hp(50),
    borderWidth: wp(1),
    borderColor: COLORS.White,
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
  },
  tabBar: {
    width: wp(165),
    borderRadius: wp(10),
    borderWidth: hp(1),
    borderColor: COLORS.LightGrey,
    height: hp(47),
    marginTop: hp(-14),
    textAlign: "center",
  },
  tabBarTitle: {
    fontSize: hp(18),
    textAlign: "center",
    marginTop: hp(10),
    fontWeight: "600",
    fontFamily: FONTS.Urbanist_Semibold,
  },
  button: {
    justifyContent: "center",
    marginLeft: wp(10),
    paddingLeft: wp(40),
    paddingBottom: hp(50),
    paddingRight: wp(20),
    paddingTop: hp(10),
    alignItems: "center",
    // marginTop: hp(8),
  },
  logo: {
    height: hp(29),
    width: wp(155),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
    position: "absolute",
    marginTop: hp(35),
    marginLeft: wp(70),
  },
  openDrawer: {
    justifyContent: "center",
    marginLeft: wp(10),
    paddingLeft: wp(10),
    paddingBottom: hp(50),
    paddingRight: wp(40),
    paddingTop: hp(10),
    alignItems: "center",
    marginTop: hp(10),
  },
  logoImg: {
    height: hp(20),
    width: wp(27),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
    position: "absolute",
    top: hp(15),
  },
  notifications: {
    height: hp(33),
    width: wp(30),
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "stretch",
    position: "absolute",
    top: hp(15),
    marginLeft: 0,
  },
  headersView: {
    // flexDirection: 'row',
    marginLeft: wp(24),
    marginTop: hp(12),
    height: hp(44),
    width: wp(44),
    marginBottom: hp(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: hp(10),
    paddingBottom: hp(10),
    backgroundColor: COLORS.White,
  },
  back: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.LightGrey,
    borderColor: COLORS.LightGrey,
    borderRadius: wp(20),
    width: wp(40),
    height: hp(40),
    marginLeft: wp(24),
  },
  backButton: {
    width: wp(25),
    height: hp(25),
    tintColor: COLORS.DarkGrey,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: hp(24),
    fontFamily: FONTS.Urbanist_Semibold,
    color: COLORS.DarkGrey,
    marginLeft: wp(18),
    width: wp(300),
    alignSelf: "center",
  },
  hasNotification: {
    width: wp(10),
    height: hp(10),
    borderRadius: wp(10),
    backgroundColor: COLORS.Red,
    top: hp(17),
    left: wp(30),
    position: "absolute",
    zIndex: 2,
  },
  tabAnimatedConatiner: {
    flex: 1,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
    overflow: "hidden",
  },
});

export default AppNavigation;
