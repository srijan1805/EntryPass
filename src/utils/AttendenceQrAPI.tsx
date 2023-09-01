import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";

import {
  AttendanceScan,
  ClockinAck,
  ClockoutAck,
  employeeRoute,
  QRCode,
} from "./urls";
import { Config } from "./Config";
const BaseURL = Config.BASE_URL;
import DeviceInfo from "react-native-device-info";
import uuid from "react-native-uuid";
import { Platform } from "react-native";
const DeviceType = Platform.OS === "ios" ? "IOS" : "Android";
const uniqueId = DeviceInfo.getUniqueId();

const timeOut = 60000;

export const VerifyQR = async (qrCode, scanType, empId) => {
  try {
    const data = { employeeID: empId, scanType: scanType };
    console.log(
      "QRCODE URL",
      `${BaseURL}${employeeRoute}${QRCode}${qrCode}`,
      "_____",
      {
        accept: "text/plain",
        "Content-Type": "application/json",
        mac: uniqueId,
        uuid: uuid.v4(),
        dtype: DeviceType,
      }
    );
    const response = await axios.post(
      `${BaseURL}${employeeRoute}${QRCode}${qrCode}`,
      data,
      {
        timeout: timeOut,
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(`VERIFY QRCODE APII FAILED ${error}`);
  }
};

export const ClockIn = (empId: number, imageName, facId: number = 0) => {
  try {
    console.log(
      "NORAML CLOCK IN",
      empId,
      imageName,
      facId,
      `${BaseURL}${employeeRoute}${empId}/Attendance/ClockIn?facilityId=${facId}`
    );
    const response = axios.post(
      `${BaseURL}${employeeRoute}${empId}/Attendance/ClockIn?facilityId=${facId}`,
      imageName,
      {
        timeout: timeOut,
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error(`ATTENDANCE CLOCKIN API FAILED,${error}`);
  }
};

export const ClockOut = (empId: number, imageName) => {
  try {
    console.log(
      "CHECKKKK CLOCKK OUT METHOD",
      `${BaseURL}${employeeRoute}${empId}/Attendance/ClockOut`
    );
    const response = axios.post(
      `${BaseURL}${employeeRoute}${empId}/Attendance/ClockOut`,
      imageName,
      {
        timeout: timeOut,
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(`ATTENDANCE CLOCKOUT API FAILED,${error}`);
  }
};

export const uploadAttendanceImage = async (data: any) => {
  try {
    const response = await RNFetchBlob.config({ timeout: 20000 }).fetch(
      "POST",
      `${BaseURL}Image/Upload`,
      {
        "Content-Type": "multipart/form-data",
      },
      data
    );
    return response;
  } catch (error) {
    throw new Error(`UPLOAD ATTENDANCE IMAGE FAILED, ${error}`);
  }
};

export const attendanceAcknowledgeApi = async (
  employeeId: string | number,
  data: any,
  screenValType: string
) => {
  try {
    const apiUrl = `${BaseURL}${employeeRoute}${employeeId}/${AttendanceScan}/${
      screenValType === "clockIn" ? ClockinAck : ClockoutAck
    }`;
    console.log("attendanceAcknowledgeApi", apiUrl, data);
    const response = await axios.post(apiUrl, data);
    console.log("ACKKK RESPONCE", response);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`CLOCKIN ACKNOWLEDGEMENT API FAILED`);
    }
  } catch (error) {
    throw new Error(`CLOCKIN ACKNOWLEDGEMENT API FAILED,${error}`);
  }
};
