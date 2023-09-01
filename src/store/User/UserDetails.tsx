import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, statusCodes } from "react-native-google-signin";
import AzureAuth from "react-native-azure-auth";
import appleAuth, {
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import { Config } from "./../../utils/Config";
import moment from "moment";
import RNLocalize from "react-native-localize";

//import Config from 'react-native-config';
const Google_Web_CLIENT_ID = Config.Google_Web_CLIENT_ID;
const Google_IOS_CLIENT_ID = Config.Google_IOS_CLIENT_ID;
const Microsoft_Web_CLIENT_ID = Config.Microsoft_Web_CLIENT_ID;
const Microsoft_Android_RedirectURL = Config.Microsoft_Android_RedirectURL;
const Microsoft_IOS_RedirectURL = Config.Microsoft_IOS_RedirectURL;
export const employeestoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("Logindata", JSON.stringify(dataVal));
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    // Error saving data
  }
};
export const employeeretrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("Logindata");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const otpStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("OTPdata", JSON.stringify(dataVal));
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    // Error saving data
  }
};
export const otpRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("OTPdata");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------login", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const attendanceScanStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("attendanceScanData", JSON.stringify(dataVal));
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    // Error saving data
  }
};
export const attendanceScanRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("attendanceScanData");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------attendanceScanData", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const tokenStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("tokenScanData", JSON.stringify(dataVal));
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    // Error saving data
  }
};
export const tokenRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("tokenScanData");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------tokenScanData", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const profileStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("ProfileData", JSON.stringify(dataVal));
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    throw new Error(`PROFILE STORE DATA FAILED,${error}`);
  }
};

export const storeUserDefaultFacility = async (dataVal) => {
  try {
    await AsyncStorage.setItem("UserDefaultFacility", JSON.stringify(dataVal));
  } catch (error) {
    throw new Error(` SET UserDefaultFacility FAILED`);
  }
};

export const retriveUserDefaultFacility = async () => {
  try {
    const value = await AsyncStorage.getItem("UserDefaultFacility");

    if (value !== null) {
      let dataval = JSON.parse(value);
      return dataval;
    }
  } catch (error) {
    throw new Error(` GET UserDefaultFacility FAILED`);
  }
};

export const profileRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("ProfileData");
    if (value !== null) {
      let dataval = JSON.parse(value);
      return dataval;
    }
  } catch (error) {
    throw new Error(`PROFILE RETRIVE DATA FAILED, ${error}`);
    // Error retrieving data
  }
};

export const currentTimeStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem("CurrentTime", JSON.stringify(dataVal));
  } catch (error) {
    // Error saving data
  }
};
export const currentTimeRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("CurrentTime");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------ProfileData", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};
export const employeeRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("EmployeeData");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------EmployeeData", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const addressVerficationFacilityStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem(
      "IsFacilityVerfication",
      JSON.stringify(dataVal)
    );
    //  console.log("dataval-----store-----login",dataval);
  } catch (error) {
    // Error saving data
  }
};
export const addressVerficationFacilityRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("IsFacilityVerfication");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------IsFacilityVerfication", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const loginStoreData = async (dataVal) => {
  try {
    await AsyncStorage.setItem(
      "IsRegistrationcompleted",
      JSON.stringify(dataVal)
    );
    console.log("IsRegistrationcompleted-----store-----login", dataVal);
  } catch (error) {
    // Error saving data
  }
};
export const loginRetrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("IsRegistrationcompleted");
    if (value !== null) {
      // We have data!!
      let dataval = JSON.parse(value);
      console.log("dataval----------IsRegistrationcompleted", dataval);
      return dataval;
    }
  } catch (error) {
    // Error retrieving data
  }
};

export const googlesignOut = async () => {
  try {
    console.log("Google-----Logout");
    GoogleSignin.configure({
      webClientId: Google_Web_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, //
      iosClientId: Google_IOS_CLIENT_ID,
    });
    await GoogleSignin.signOut();
    //this.setState({ user: null }); // Remember to remove the user from your app's state as well
  } catch (error) {
    console.error(error);
  }
};

export const microsoftLogout = async () => {
  try {
    console.log("Microsoft-----Logout");
    const CLIENT_ID = Microsoft_Web_CLIENT_ID; // replace the string with YOUR client ID
    const azureAuth = new AzureAuth({
      clientId: CLIENT_ID,
      tenant: "common",
      redirectUri:
        Platform.OS === "ios"
          ? Microsoft_IOS_RedirectURL
          : Microsoft_Android_RedirectURL,
    });
    console.log(
      "MicrosoftAzure redirect-----Logout",
      azureAuth.auth.redirectUri
    );
    azureAuth.webAuth
      .clearSession({ closeOnLoad: true })
      .then((success) => {
        //this.setState({ accessToken: null, user: null });
      })
      .catch((error) => console.log(error));

    // azureAuth.webAuth.authorize({
    //   scope: 'openid profile User.Read Mail.Read',
    //   prompt: 'login',
    // });
  } catch (error) {
    console.error(error);
  }
};

export const appleLogout = async () => {
  await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGOUT,
  });
};

export function timeZonecheck() {
  var timezoneval = "";
  try {
    timezoneval = RNLocalize.getTimeZone();
  } catch (e) {
    return "";
  }
  return timezoneval;
}

export const clearingLogoutData = async () => {
  try {
    await AsyncStorage.removeItem("Logindata");
    await AsyncStorage.removeItem("OTPdata");
    await AsyncStorage.removeItem("ProfileData");
    await AsyncStorage.removeItem("IsFacilityVerfication");
    await AsyncStorage.removeItem("IsRegistrationcompleted");
  } catch (error) {
    console.error(error);
  }
};
