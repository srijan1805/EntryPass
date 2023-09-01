import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginDetailsProps } from "../../utils/interface-helpers/common-interface";

interface EmployeeState {
  name: string;
  loginDetails: loginDetailsProps | null;
}

let initialState: EmployeeState = {
  name: "",
  loginDetails: {
    tokenVal: "",
    lat: "",
    long: "",
    loginType: 0,
    navigation: {},
  },
};

const getEmployeeName: any = (state: EmployeeState) => state.name;

const getLoginDetails: any = (state: EmployeeState) => state.loginDetails;

const slice = createSlice({
  name: "getDisabledEmployee",
  initialState,
  reducers: {
    setEmployeeName: (state, action) => {
      state.name = action.payload;
    },
    setNonUserDetails: (state, action) => {
      state.loginDetails = action.payload;
    },
    clearDisabledUser: (state) => {
      console.log("CALLEDDDDD DISABLEDD REDUCER");
      state.loginDetails = null;
      state.name = "";
    },
  },
});

export const { setEmployeeName, setNonUserDetails, clearDisabledUser } =
  slice.actions;
export { getEmployeeName, getLoginDetails };
export default slice.reducer;
