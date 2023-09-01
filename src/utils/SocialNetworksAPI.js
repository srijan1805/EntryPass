import axios from "axios";
import {
  GoogleAPI,
  GoogleURL,
  GooglelocalURL,
  MicrosoftlocalURL,
  ApplelocalURL,
} from ".";
import { Config } from "./Config";
//import Config from 'react-native-config';
const BaseURL = Config.BASE_URL;
import DeviceInfo from "react-native-device-info";
import uuid from "react-native-uuid";
const DeviceType = Platform.OS === "ios" ? "IOS" : "Android";
const uniqueId = DeviceInfo.getUniqueId();

class SocialNetworksAPI {
  googleApiGet(codeVal, lat, long) {
    const codeParams = {
      code: codeVal,
    };

    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${GooglelocalURL}?code=${codeVal}`;

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
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          console.log("errorRes Google---->", errorRes);
          reject(errorRes);
        });
    });
  }

  microsoftApiGet(codeVal, lat, long) {
    const codeParams = {
      userId: codeVal,
    };

    console.log("<<<<<<<<", `${BaseURL}${MicrosoftlocalURL}`, codeParams, {
      accept: "text/plain",
      mac: uniqueId,
      uuid: uuid.v4(),
      dtype: DeviceType,
      latitude: lat,
      longitude: long,
    });

    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${MicrosoftlocalURL}`;

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
        data: codeParams,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          console.log("MICROSOFT API FAILED", errorRes.response);
          reject(errorRes);
        });
    });
  }

  appleApiGet(codeVal, lat, long) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${ApplelocalURL}`;
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
        data: codeVal,
        timeout: this.API_TIME_OUT,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          console.log(`APPLE API GET FAILLED,${errorRes}`);
          reject(errorRes);
        });
    });
  }

  // currentTimeApiGet(codeVal) {
  //   return new Promise((resolve, reject) => {
  //     const URL = "http://worldclockapi.com/api/json/utc/now";
  //     // console.log("WORLD CLOCK TIME APIIII URL", URL);
  //     axios({
  //       method: "get",
  //       url: URL,
  //       timeout: 60000,
  //     })
  //       .then((sucessRes) => {
  //         console.log("WORLD CLOCK TIME API RESP", sucessRes);
  //         resolve(sucessRes);
  //       })
  //       .catch((errorRes) => {
  //         console.log("WORLD CLOCK TIME APIIIII FAILED", errorRes.response);
  //         reject(errorRes);
  //       });
  //   });
  // }

  currentTimeApiGet = async (codeVal) => {
    // return new Promise((resolve, reject) => {
    //   const URL = "http://worldclockapi.com/api/json/utc/now";
    //   // console.log("WORLD CLOCK TIME APIIII URL", URL);
    //   axios({
    //     method: "get",
    //     url: URL,
    //     timeout: 60000,
    //   })
    //     .then((sucessRes) => {
    //       console.log("WORLD CLOCK TIME API RESP", sucessRes);
    //       resolve(sucessRes);
    //     })
    //     .catch((errorRes) => {
    //       console.log("WORLD CLOCK TIME APIIIII FAILED", errorRes.response);
    //       reject(errorRes);
    //     });
    // });
    try {
      const URL = "http://worldclockapi.com/api/json/utc/now";

      const response = await axios({
        method: "get",
        url: URL,
        timeout: 60000,
      });
      return response;
    } catch (error) {
      throw new Error(`WORLD CLOCK TIME APIIIII FAILED ${error}`);
    }
  };
}
export const socialNetworksAPI = new SocialNetworksAPI();
