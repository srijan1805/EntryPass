import {
  appleLogout,
  clearingLogoutData,
  employeeRetrieveData,
  googlesignOut,
  microsoftLogout,
  tokenRetrieveData,
} from "../store/User/UserDetails";
import { postLogoutAPI } from "./ProfileNetworkAPI";
import { CommonActions } from "@react-navigation/native";
import translation from "../assets/translations/translate";
import { logout } from "../store/Profile/Profile";
import { clearDisabledUser } from "../store/User/DisabledUser";

export const appLogout = async (
  employeeNo: string,
  navigation: any,
  isDisabledDrawer = false,
  dispatch: any
) => {
  try {
    if (isDisabledDrawer) {
      employeeRetrieveData().then((tokenval) => {
        clearingLogoutData();
        dispatch(logout());
        dispatch(clearDisabledUser());
        navigation.goBack();
      });
    } else {
      tokenRetrieveData()
        .then(async (to) => {
          let bodyVal = {
            employeeId: employeeNo,
            fcmToken: to.newToken,
          };
          postLogoutAPI(bodyVal).then(async (tokenRes) => {
            if (tokenRes.status === 200) {
              employeeRetrieveData().then(async (tokenval) => {
                if (tokenval.registrationType === "Google") {
                  googlesignOut();
                } else if (tokenval.registrationType === "Microsoft") {
                  microsoftLogout();
                } else if (tokenval.registrationType === "Apple") {
                  appleLogout();
                }
              });
              await clearingLogoutData();
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: "Login",
                    },
                  ],
                })
              );
            } else {
              alert("Logout Api issue");
            }
          });
        })
        .catch((err) => {
          if (err !== "undefined" && err.toString().includes("Network Error")) {
            alert(translation.AddressVerification.oops_network_err_msg);
          }
        });
    }
  } catch (error) {
    throw new Error(`APP LOGOUT FAILED, ${error}`);
  }
};
