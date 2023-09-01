import axios from "axios";
import { log } from "react-native-reanimated";
import {
  employeeRoute,
  addressHistoryListing,
  addressHistoryDetails,
  AddressVerificationSubmit,
  Addressresident,
} from "./urls";
//import Config from 'react-native-config';
import { Config } from "../utils/Config";
const BaseURL = Config.BASE_URL;
import DeviceInfo from "react-native-device-info";
import uuid from "react-native-uuid";
import { Platform } from "react-native";
const DeviceType = Platform.OS === "ios" ? "IOS" : "Android";
const uniqueId = DeviceInfo.getUniqueId();

export const getAddressHistories = (emplID: number, addressId?: number) => {
  if (addressId && addressId > 0) {
    const response = axios.get(
      `${BaseURL}${employeeRoute}${emplID}/${addressHistoryDetails}${addressId}`
    );

    return response
      .then((responses) => {
        return responses.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    const response = axios.get(
      `${BaseURL}${employeeRoute}${emplID}/${addressHistoryListing}`
    );
    return response
      .then((responses) => {
        return responses.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const getLastVerifiedAddressAPI = (emplID: number) => {
  const response = axios.get(
    `${BaseURL}${employeeRoute}${emplID}/${addressHistoryDetails}`
  );

  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("ERR", error);
      console.log(error);
    });
};

export const getEmplyeeAddressAPI = (emplID: number, addressID: number) => {
  const response = axios.get(
    `${BaseURL}${employeeRoute}${emplID}/${AddressVerificationSubmit}/${addressID}`
  );
  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const headers = {
  "Content-Type": "application/json",
};

export const postVerifiedAddressAPI = (
  addressVal,
  employeeIdval,
  lat,
  long
) => {
  let api_url = `${BaseURL}${employeeRoute}${employeeIdval}/${AddressVerificationSubmit}`;

  const response = axios.post(api_url, addressVal, {
    headers: {
      accept: "text/plain",
      "Content-Type": "application/json",
      mac: uniqueId,
      uuid: uuid.v4(),
      dtype: DeviceType,
      latitude: lat,
      longitude: long,
    },
  });
  return response
    .then((response) => {
      return response;
    })
    .catch((error) => {});
};

export function profileDetailGetAPI(emplID) {
  return new Promise((resolve, reject) => {
    const URL = `${BaseURL}${employeeRoute}${emplID}/${AddressVerificationSubmit}`;

    axios({
      method: "get",
      url: URL,
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

export function addressResidentsGetAPI() {
  return new Promise((resolve, reject) => {
    const URL = `${BaseURL}${Addressresident}`;
    axios({
      method: "get",
      url: URL,
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
