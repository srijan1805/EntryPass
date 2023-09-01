import axios from "axios";
import {
  employeeRoute,
  AttendanceScan,
  Logout,
  ArtTestSubmitDet,
  ArtTestKit,
} from "./urls";
import { Config } from "../utils/Config";
const BaseURL = Config.BASE_URL;

export const getEmployeeDetailsAPI = (emplID: number) => {
  const response = axios.get(`${BaseURL}/Employee/${emplID}/${AttendanceScan}`);

  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("get employee details API Error ", error);
    });
};

export const getTestKitBrandAPI = () => {
  const response = axios.get(`${BaseURL}${ArtTestSubmitDet}/${ArtTestKit}`);

  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("getTestKitBrandAPI ", error);
    });
};
