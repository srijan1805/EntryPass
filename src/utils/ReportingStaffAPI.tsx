import axios from "axios";
import { Config } from "../utils/Config";
import {
  employeeRoute,
  StaffUnderSupervisior,
  RemoveStaffUnderSupervisor,
} from "./urls";
const BaseURL = Config.BASE_URL;

export const fetchReportingStaff = async (emplID: string) => {
  try {
    const { status, data } = await axios.get(
      `${BaseURL}/${employeeRoute}/${StaffUnderSupervisior}/${emplID}`
    );

    if (status === 200 && data.length > 0) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`FETCH REPORTING STAFF API FAILED, ${error}`);
  }
};

export const removeReportingStaff = async (bodyData: any) => {
  try {
    const { status, data } = await axios.post(
      `${BaseURL}/${employeeRoute}/${RemoveStaffUnderSupervisor}`,
      bodyData
    );
    if (status === 200) {
    }
  } catch (error) {
    throw new Error(`REMOVE REPORTING STAFF API FAILED, ${error}`);
  }
};
