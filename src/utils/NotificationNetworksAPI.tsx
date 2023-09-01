import axios from 'axios';
import { EmployeeeNotifications, employeeRoute, Notifications } from './urls';
//import Config from 'react-native-config';
import {Config} from './Config';
const BaseURL = Config.BASE_URL;
export const getNotificationsAPI = (emplID: string) => {
  const response = axios.get(
    `${BaseURL}${EmployeeeNotifications}/${emplID}/${Notifications}`,
  );

  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateMarkAsRead = (emplID: string, notificationId: number) => {
  const response = axios.put(
    `${BaseURL}${EmployeeeNotifications}/${emplID}/${Notifications}/${notificationId}`,
  );
  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const notificationsPending = (emplID: string) => {
  const response = axios.get(
    `${BaseURL}Employee/${emplID}`,
  );
  return response
    .then((response) => {      
      return response.data.result.hasNotification;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateMarkAllAsRead = (emplID: string) => {
  const response = axios.put(
    `${BaseURL}${EmployeeeNotifications}/${emplID}/${Notifications}`,
  );
  return response
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
