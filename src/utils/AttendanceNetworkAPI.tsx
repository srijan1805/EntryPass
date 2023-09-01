import axios from "axios";
import {
  AttendanceStaffALL,
  employeeRoute,
  AttendanceCalendarList,
  AttendanceReason,
  AttendanceReasonSubmit,
  AttendanceScan,
} from ".";
//import Config from 'react-native-config';
import { Config } from "./Config";
import { attendancePush, ClockinGps, ClockoutGps, Emptimeid } from "./urls";
const BaseURL = Config.BASE_URL;

export interface gpsClockinObj {
  ClockInImageUrl: string;
  LanguageCode: string;
  location: string;
  Longitude: string | number;
  Latitude: string | number;
}

export interface gpsClockoutObj {
  ClockOutImageUrl: string;
  location: string;
  Longitude: string | number;
  Latitude: string | number;
}

class AttendanceStaffAPI {
  attendanceStaffGetAPI(emplID, dateText) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${emplID}${AttendanceStaffALL}${dateText}`;
      console.log("url---stafffff11-> attendanceStaffGetAPI", URL);
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

  attendanceFilterListApiPost(emplID, codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${emplID}${AttendanceCalendarList}`;

      axios({
        method: "post",
        url: URL,
        data: codeVal,
        timeout: 6000,
      })
        .then((sucessRes) => {
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          reject(errorRes);
        });
    });
  }

  attendanceReasonGetAPI() {
    return new Promise((resolve, reject) => {
      console.log("url---1->");
      const URL = `${BaseURL}${AttendanceReason.substring(
        1,
        AttendanceReason.length
      )}`;
      console.log("url---stafffff11->", URL);
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

  attendanceSubmitReasonApiPost(emplID, codeVal) {
    console.log("url---->");
    return new Promise((resolve, reject) => {
      console.log("url---1->");
      const URL = `${BaseURL}${employeeRoute}${emplID}${AttendanceReasonSubmit}`;
      console.log("url--cc-->", URL);
      axios({
        method: "post",
        url: URL,
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

  postAttendancePushforNotificationAPI(employeeID, languageType) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${attendancePush}?empId=${employeeID}&languageCode=${languageType}`;
      console.log("-----url----attendance push-", URL);

      axios({
        method: "post",
        url: URL,
        headers: {
          accept: "text/plain",
        },
        // data: codeVal,
        timeout: 6000,
      })
        .then((sucessRes) => {
          console.log("ATTENDANCE PUSH NOTIFICATION", sucessRes);
          resolve(sucessRes);
        })
        .catch((errorRes) => {
          console.log("ATTENDANCE PUSH NOTIFICATION", errorRes);
          reject(errorRes);
        });
    });
  }

  getAttendanceProfileDetailsAPI = async (emplID: number) => {
    console.log(
      "HYHYHYHYHYHYHYHY",
      `${BaseURL}${employeeRoute}${emplID}/${AttendanceScan}`
    );
    try {
      const { status, data } = await axios.get(
        `${BaseURL}${employeeRoute}${emplID}/${AttendanceScan}`
      );
      return data;
    } catch (error) {
      throw new Error(`get profile details API Error,${error}`);
    }
  };

  getAttendanceonDateProfileDetailsAPI = async (
    emplID: number,
    selectedDate: string,
    empTimeID?: number | string
  ) => {
    try {
      console.log(
        "ATEENDANCEEE DETAILLLLL",
        `${BaseURL}${employeeRoute}${emplID}/${AttendanceScan}/${selectedDate}?${Emptimeid}=${empTimeID}`
      );
      const { status, data } = await axios.get(
        `${BaseURL}${employeeRoute}${emplID}/${AttendanceScan}/${selectedDate}?${Emptimeid}=${empTimeID}`
      );
      if (status === 200) {
        console.log("Profile Details API------> ", data);
        return data;
      }
    } catch (error) {
      throw new Error(`get profile details API Error, ${error}`);
    }
  };

  gpsAttendancClockineApi = async (empId: number, dataObj: gpsClockinObj) => {
    try {
      const url = `${BaseURL}${employeeRoute}${empId}/${AttendanceScan}/${ClockinGps}`;

      console.log("GPS CLOCKINNN", url, dataObj);
      const responce = await axios({
        method: "POST",
        url: url,
        data: dataObj,
        timeout: 20000,
      });
      if (responce.status === 200) {
        return responce;
      }
    } catch (error) {
      throw new Error(`GPS ATTENDANCE CLOCKIN APII FAILED, ${error}`);
    }
  };

  gpsAttendanceClockoutApi = async (empId: number, dataObj: gpsClockoutObj) => {
    try {
      const url = `${BaseURL}${employeeRoute}${empId}/${AttendanceScan}/${ClockoutGps}`;
      console.log("CLOCKOUT APIIII CALLL", url, dataObj);
      const responce = await axios({
        method: "POST",
        url: url,
        data: dataObj,
        timeout: 20000,
      });
      if (responce.status === 200) {
        return responce;
      }
    } catch (error) {
      throw new Error(`GPS ATTENDANCE CLOCKOUT APII FAILED, ${error}`);
    }
  };
}

export const attendanceStaffAPI = new AttendanceStaffAPI();
