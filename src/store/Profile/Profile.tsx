import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkShiftRemainderAPI,
  getProfileDetailsAPI,
} from "../../utils/ProfileNetworkAPI";

interface IGPSConfig {
  latitude: string;
  longitude: string;
  range: number;
  remarks: string;
}

type userLoc = {
  latitude: string | number;
  longitude: string | number;
};
interface ProfileState {
  profileDetails: {
    artTestLastDate: string;
    employeeID: number;
    empNameId: string;
    employeeName: string;
    contactNumber: string | null;
    emailID: string;
    qrPassCode: string;
    facility: string;
    doj: string;
    role: string;
    isSpuervisor: boolean;
    hasNotification: boolean;
    supervisorName: string;
    shiftStartTime: string;
    shiftEndTime: string;
    clockIn: string;
    clockOut: string;
    isAddressPending: boolean;
    isSupervisorVerfied: boolean;
    isArtTestPending: boolean;
    isAllowedEmployeeMobileForOthers: boolean;
    imageUrl: string;
    isAllowFaceDetect: boolean;
    listtblGPSConfigurations: Array<IGPSConfig> | null;
  };
  isShiftRemainderEnabled: boolean;
  userLocation: any;
}

let initialState: ProfileState = {
  profileDetails: {
    artTestLastDate: "",
    employeeID: 0,
    empNameId: "",
    employeeName: "",
    contactNumber: null,
    emailID: "",
    qrPassCode: "",
    facility: "",
    doj: "",
    role: "",
    isSpuervisor: false,
    hasNotification: false,
    supervisorName: "",
    shiftStartTime: "",
    shiftEndTime: "",
    clockIn: "",
    clockOut: "",
    isAddressPending: false,
    isSupervisorVerfied: false,
    isArtTestPending: false,
    isAllowedEmployeeMobileForOthers: false,
    imageUrl: "",
    isAllowFaceDetect: false,
    listtblGPSConfigurations: [],
  },
  isShiftRemainderEnabled: false,
  userLocation: {},
};

const getProfileDetails: any = createAsyncThunk(
  "profileDetails",
  async (data: any, { rejectWithValue }) => {
    try {
      // Pass the id to fetch data
      const emplID = data;

      let response: any = await getProfileDetailsAPI(emplID);

      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const checkShiftRemainder: any = createAsyncThunk(
  "shiftRemainder",
  async (data: any, { rejectWithValue }) => {
    try {
      const emplID = data;
      let response: any = await checkShiftRemainderAPI(emplID);
      return response;
    } catch (error) {
      return rejectWithValue(e);
    }
  }
);

const slice = createSlice({
  name: "profileDetails",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      //state.loading = action.payload;
    },
    logout: (state) => {
      // From here we can take action only at this "counter" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    },
    getUserCurrentLocation: (state, action) => {
      console.log("USER GPS COOORDINATES", action);
      state.userLocation = action.payload;
    },
  },
  extraReducers: {
    [getProfileDetails.fulfilled]: (state, action) => {
      state.profileDetails = action.payload;
    },
    [getProfileDetails.rejected]: (state, action) => {},
    [checkShiftRemainder.fulfilled]: (state, action) => {
      state.isShiftRemainderEnabled = action.payload?.[0]?.active;
    },
    [checkShiftRemainder.rejected]: (state, action) => {},
  },
});
export const { setLoading, logout, getUserCurrentLocation } = slice.actions;
export { getProfileDetails, checkShiftRemainder };
export default slice.reducer;
