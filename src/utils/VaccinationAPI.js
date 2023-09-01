import axios from 'axios';
import {Config} from './Config';
const VaccinationURL = Config.Vaccination_URL;

class VaccinationAPI {
  VaccinationApiPost(codeVal) {
    //codeVal="UEMSS36323";
    return new Promise((resolve, reject) => {
      const URL = `${VaccinationURL}?StaffID=${codeVal}`;
      axios({
        method: 'post',
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
}
export const vaccinationAPIcall = new VaccinationAPI(); 