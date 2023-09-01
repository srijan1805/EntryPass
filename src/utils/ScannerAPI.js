import axios from 'axios';
import {
  FacilityScan,
  SupervisiorScan,
  employeeRoute,
  AttendanceScan,
  ArtQrCodeScan,
} from '.';
import { Config } from './Config';
//import Config from 'react-native-config';
const BaseURL = Config.BASE_URL;
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';
import { Platform } from 'react-native';
const DeviceType = Platform.OS === 'ios' ? 'IOS' : 'Android';
const uniqueId = DeviceInfo.getUniqueId();

class ScannerAPI {
  facilityqRCodeApiGET(userID, codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${userID}/${FacilityScan}/${codeVal}`;
      console.log('url--cc-->', URL);
      axios({
        method: 'get',
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

  supervisiorqRCodeApiGET(userID, codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${userID}/${SupervisiorScan}/${codeVal}`;
      console.log('url--cc-->', URL);
      axios({
        method: 'put',
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

  supervisiorNotscanqRCodeApiPUT(userID, codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${userID}/${SupervisiorScan}`;
      console.log('url--cc-->', URL);
      axios({
        method: 'put',
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

  attendanceqRCodeApiGET(codeVal) {
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${codeVal}/${AttendanceScan}`;
      axios({
        method: 'get',
        url: URL,
        headers: {
          accept: 'text/plain',
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
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

  artTestqRCodeApiGET(codeVal, scanType, empId) {
    const data = { employeeID: empId, scanType: scanType };
    return new Promise((resolve, reject) => {
      const URL = `${BaseURL}${employeeRoute}${ArtQrCodeScan}${codeVal}`;
      console.log('URL......', URL);
      axios({
        method: 'post',
        url: URL,
        headers: {
          accept: 'text/plain',
          mac: uniqueId,
          uuid: uuid.v4(),
          dtype: DeviceType,
        },
        data: data,
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

  artTestApiGET(empID) {
    return new Promise((resolve, reject) => {
      console.log('Inside artTestAPIGET', empID);

      const URL = `${BaseURL}${employeeRoute}${empID}/${ArtTestSubmitDet}`;
      console.log('Inside artTestAPIGEET', url);
      axios({
        method: 'get',
        url: URL,
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
  //Employee/11/Supervisor
}
export const scannerAPIcall = new ScannerAPI();
