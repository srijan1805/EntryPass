import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import { employeeRoute, UploadImage } from "./urls";
import { Config } from "./Config";
const BaseURL = Config.BASE_URL;
export const uploadResidenceImage1 = async (data, userId, type: String) => {
  try {
    console.log(
      "uploadResidenceImage1 =--->",
      data,
      userId,
      type,
      `${BaseURL}${employeeRoute}${userId}/Address/Upload?imgType=${type}`
    );

    let api_url = `${BaseURL}${employeeRoute}${userId}/Address/Upload?imgType=${type}`;

    const response = await RNFetchBlob.config({ timeout: 2000 }).fetch(
      "POST",
      api_url,
      {
        "Content-Type": "multipart/form-data",
      },
      data
    );

    console.log("RESSSS", response);

    return response;
  } catch (error) {
    console.log("ERRRR", error);
  }
};

export const TypeList = () => {
  const response = axios.get(`${BaseURL}Address/ImageTypes`);
  return response;
};
