import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";

import { employeeRoute } from "./urls";
import { Config } from "./Config";
const BaseURL = Config.BASE_URL;

export const uploadImage = (data) => {
  console.log("uploadAttendanceImage =--->", data);
  const response = RNFetchBlob.fetch(
    "POST",
    `${BaseURL}Image/Upload`,
    {
      "Content-Type": "multipart/form-data",
    },
    data
  );
  return response;
};

const headers = {
  accept: "text/plain",
  "Content-Type": "application/json",
};

export const Audit = (data) => {
  const response = axios.post(`${BaseURL}${employeeRoute}/Audit`, data, {
    headers,
  });
  return response;
};
