import axios from 'axios';
//import Config from 'react-native-config';
import {Config} from '../utils/Config';
const BaseURL = Config.BASE_URL;

export const getEmployeeDetails = (emplID: number) => {
  const response = axios.get(`${BaseURL}/Employee/${emplID}`);
  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
