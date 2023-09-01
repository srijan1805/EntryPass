import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import { employeeRoute, QRCode, ArtTestSubmitDet } from './urls';
import { Config } from './Config';
const BaseURL = Config.BASE_URL;
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';
import { Platform } from 'react-native';
const DeviceType = Platform.OS === 'ios' ? 'IOS' : 'Android';
const uniqueId = DeviceInfo.getUniqueId();

const headers = {
  accept: 'text/plain',
  'Content-Type': 'application/json',
};
// export const ArtTestSubmit = (data, employeeID) => {
//   const url = `${BaseURL}${employeeRoute}${employeeID}/${ArtTestSubmitDet}`;
//   const response = axios.post(url, data, { headers });
//   return response;
// };

export const GetArtTestDetails = (empId) => {
  const response = axios.get(`${BaseURL}${employeeRoute}${empId}/ArtTest`, {
    headers,
  });
  return response
    .then((responses) => {
      return responses.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const ARTtestSelfList = (empId, data) => {
  const response = axios.post(
    `${BaseURL}${employeeRoute}${empId}/ArtTest/List`,
    data,
    { headers },
  );
  return response;
};

export const ARTtestStaffList = (empId, data) => {
  const response = axios.post(
    `${BaseURL}${employeeRoute}${empId}/ArtTest/All`,
    data,
    { headers },
  );
  return response;
};
export const ArtTestSubmit = (data, employeeID) => {
  const url = `${BaseURL}${employeeRoute}${employeeID}/${ArtTestSubmitDet}`;
  const response = axios.post(url, data, {
    headers:{accept: 'text/plain','mac':uniqueId, 'uuid':uuid.v4(), 'dtype':DeviceType},
  });
  return response;
};
