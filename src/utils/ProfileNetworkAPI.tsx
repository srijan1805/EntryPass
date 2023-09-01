import axios from "axios";
import {
  ArtTestSubmitDet,
  DeleteProfile,
  EmployeeeNotifications,
  employeeRoute,
  Enable,
  Logout,
  Notifications,
  Notiftypes,
  ActiveStaff,
  ProfileImage,
} from "./urls";
//import Config from 'react-native-config';
import { Config } from "../utils/Config";
import { ArtTestSubmit } from "./ArtTestAPI";
import { ArtTestKit } from ".";
import { err } from "react-native-svg/lib/typescript/xml";
import { appLogout } from "./AppLogout";
const BaseURL = Config.BASE_URL;

export const getProfileDetailsAPI = async (emplID: number) => {
  try {
    const { status, data } = await axios.get(
      `${BaseURL}${employeeRoute}${emplID}`
    );
    if (status === 200 && data.result) {
      return data;
    }
  } catch (error) {
    throw new Error(`GET Profile Details Api Failed ${error}`);
  }
};

export const postLogoutAPI = async (bodyVal) => {
  try {
    const response = await axios.post(`${BaseURL}${Logout}`, bodyVal);
    return response;
  } catch (error) {
    throw new Error(`PROFILE LOGOUT API FAILED, ${error}`);
  }
};

export const getArtTestDropDownKitAPI = () => {
  const response = axios.get(`${BaseURL}${ArtTestSubmitDet}${ArtTestKit}`); ///ArtTest/TestKit
  console.log("getArtTestDropDownKitAPI------> ", response);
  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("getArtTestDropDownKitAPI Error ", error);
    });
};

export const profileDeleteAPI = async (data: any) => {
  try {
    const url = `${BaseURL}${employeeRoute}${DeleteProfile}`;
    const responce = await axios.post(url, data);
    if (responce.status === 200 && responce.data === true) {
      return "SUCCESS";
    } else {
      throw new Error(`DELETE USER PROFILE API FAILED`);
    }
  } catch (error) {
    console.log("ERRR", error);
    throw new Error(`DELETE USER PROFILE API FAILED,${error}`);
  }
};

export const checkShiftRemainderAPI = async (empId: string | number) => {
  try {
    const url = `${BaseURL}${EmployeeeNotifications}/${empId}/${Notifications}/${Notiftypes}`;
    const responce = await axios.get(url);

    if (responce.status === 200) {
      return responce.data;
    } else {
      throw new Error(`CHECK SHIFT REMAINDER API FAILED`);
    }
  } catch (error) {
    throw new Error(`CHECK SHIFT REMAINDER API FAILED,${error}`);
  }
};

export const enableShiftRemainderAPI = async (
  data: any,
  empId: string | number
) => {
  try {
    const url = `${BaseURL}${EmployeeeNotifications}/${empId}/${Notifications}/${Enable}`;
    const responce = await axios.post(url, data);
    if (responce.status === 200 && responce.data) {
      return "ENABLE SHIFT REMAINDER SUCCESS";
    } else {
      throw new Error(`ENABLE SHIFT REMAINDER API FAILED`);
    }
  } catch (error) {
    throw new Error(`ENABLE SHIFT REMAINDER API FAILED,${error}`);
  }
};

export const checkUserIsActive = async (empId: string, navigation: any) => {
  try {
    const url = `${BaseURL}${employeeRoute}/${ActiveStaff}/${empId}`;
    const responce = await axios.get(url);
    if (responce.status === 200 && responce.data.active === false) {
      appLogout(empId, navigation);
    } else {
      return "ACTIVE USERR";
    }
  } catch (error) {
    throw new Error(`USER ACTIVE API FAILED,${error}`);
  }
};

export const uploadProfileImageAPI = async (empId: string, bodydata: any) => {
  try {
    const url = `${BaseURL}${employeeRoute}/${ProfileImage}/${empId}`;
    console.log("PROFILE IMAGE URL", url, bodydata);
    const responce = await axios.post(url, bodydata);
    if (responce.status === 200) {
      return responce;
    }
  } catch (error) {
    throw new Error(`UPLOAD PROFILE IMAGE API FAILED, ${error}`);
  }
};
