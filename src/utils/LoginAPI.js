import axios from "axios";
import {
  LoginIDUrl,
  LoginQRcodeIdURL,
  VerifyOTPURL,
  VerifyOTPtigger,
  VerifyOTPValidate,
  employeeRoute,
  ArtTestID,
  ResendOTP,
  QRCode,
  EmployeeVerify,
} from ".";
//import Config from 'react-native-config';
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Config } from "./Config";
const BaseURL = Config.BASE_URL;
import DeviceInfo from "react-native-device-info";
import uuid from "react-native-uuid";
import { deviceRegistration } from "./urls";
import { socialNetworksAPI } from "./index";
import { employeestoreData, loginStoreData } from "../store/User/UserDetails";

const DeviceType = Platform.OS === "ios" ? "IOS" : "Android";
const uniqueId = DeviceInfo.getUniqueId();

class LoginAPI {
  verifyOTPApiPost(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${VerifyOTPURL}?code=${codeVal}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  loginIdApiPost(codeVal, lat, long) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${LoginIDUrl}/${codeVal}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
          latitude: lat,
          longitude: long,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  qRCodeApiPost(codeVal, lat, long, imageName) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${LoginQRcodeIdURL}/${codeVal}?imageName=${imageName}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
          latitude: lat,
          longitude: long,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          console.log("QR CODE API RESPPPP", JSON.stringify(sucessRes.data));
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  verifytiggerOtpApiPost(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${VerifyOTPtigger}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  verifyValidateOtpApiPost(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${VerifyOTPValidate}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  resendOtpApiPost(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${ResendOTP}`;
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  profileDetailGetAPI(emplID) {
    console.log("url--profile data-Id->", emplID);
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${emplID}`;
      axios({
        method: "get",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  ArtTestIdApiGet(codeVal, scanType) {
    console.log("url---->");
    return new Promise((resolve, reject) => {
      console.log("url---1->");
      const URL = `${BaseURL}${employeeRoute}${ArtTestID}${codeVal}?scanType=${scanType}`;
      console.log("url---->", URL);
      axios({
        method: "get",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  VerifyEmpPost(codeVal) {
    console.log("url---->");
    return new Promise((resolve, reject) => {
      console.log("url---1->", uniqueId, uuid.v4(), DeviceType);
      const URL = `${BaseURL}${employeeRoute}EmployeeNo/${codeVal}?scanType=0`;
      console.log("url---->", URL);
      axios({
        method: "get",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        // data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }
  VerifyEmpQR(codeVal, empID) {
    const data = {
      employeeID: empID,
      scanType: 0,
    };
    console.log("url---->", data);
    return new Promise((resolve, reject) => {
      console.log("url---1->", uniqueId, uuid.v4(), DeviceType);
      const URL = `${BaseURL}${employeeRoute}QRCode/${codeVal}`;
      console.log("url---->", URL);
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        data: data,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  deviceRegistrationPost(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${deviceRegistration}`;
      console.log("---URL---deviceRegistrationPost---", URL);
      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
        },
        data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          console.log("---URL---sucessRes---", sucessRes);
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }
}

export const loginAPIcall = new LoginAPI();

export const googleLoginApi = async (
  tokenVal,
  lat,
  long,
  navigation,
  isNonUserLogin = true
) => {
  try {
    const tokenRes = await socialNetworksAPI.googleApiGet(tokenVal, lat, long);
    if (tokenRes.status === 200) {
      let emplyeedata = {
        employeeId: tokenRes.data.result.employeeId,
        employeeName: tokenRes.data.result.employeeName,
        employeeQRCode: tokenRes.data.result.employeeQRCode,
        registrationType: "Google",
        phoneNumber: "",
      };
      await employeestoreData(emplyeedata);
      await loginStoreData({
        IsregistrationCompleted: false,
      });
      if (isNonUserLogin) {
        await navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Registration",
                params: {
                  scanType: "facility",
                  scancompete: false,
                  stepIndicatorval: 1,
                },
              },
            ],
          })
        );
      }
      return "GOOGLE LOGIN SUCCESS";
    } else {
      return "GOOGLE LOGIN FAILED";
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const microsoftOfficeLoginApi = async (
  tokenVal,
  lat,
  long,
  navigation,
  isNonUserLogin = true
) => {
  try {
    const tokenRes = await socialNetworksAPI.microsoftApiGet(
      tokenVal,
      lat,
      long
    );
    console.log("Microsoft Res=---->", tokenRes.data.result);
    if (tokenRes.status === 200) {
      let emplyeedata = {
        employeeId: tokenRes.data.result.employeeId,
        employeeName: tokenRes.data.result.employeeName,
        employeeQRCode: tokenRes.data.result.employeeQRCode,
        registrationType: "Microsoft",
        phoneNumber: "",
      };

      await employeestoreData(emplyeedata);
      await loginStoreData({
        IsregistrationCompleted: false,
      });
      if (isNonUserLogin) {
        await navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Registration",
                params: {
                  scanType: "facility",
                  scancompete: false,
                  stepIndicatorval: 1,
                },
              },
            ],
          })
        );
      }

      return "MICROSOFT LOGIN SUCCESS";
    } else {
      return "MICROSOFT LOGIN FAILED";
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const searchNonExistingUser = async (loginDetails) => {
  try {
    const { loginType, tokenVal, lat, long, navigation } = loginDetails;

    const { status, data } = await axios({
      method: "POST",
      url: `${BaseURL}${employeeRoute}${EmployeeVerify}`,
      data: {
        email: tokenVal,
      },
    });
    console.log("SEARCHHHH USERERRR", status, data);
    if (status === 200 && data === true) {
      if (loginType === 2) {
        return await googleLoginApi(tokenVal, lat, long, navigation, false);
      } else if (loginType === 3) {
        return await microsoftOfficeLoginApi(
          tokenVal,
          lat,
          long,
          navigation,
          false
        );
      }
    } else if (status === 200 && data === false) {
      throw new Error(`NO USER FOUND`);
    }
  } catch (error) {
    throw new Error(`SEARCH NON EXISTING USER API FAILED,${error}`);
  }
};
