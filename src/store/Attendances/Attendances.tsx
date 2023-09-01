import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceStaffAPI } from "../../utils/AttendanceNetworkAPI";

interface AttendancesProfileState {
  attendanceProfileDetails: {
    employeeName: string;
    employeeNameId: string;
    shiftStartTime: string;
    shiftEndTime: string;
    clockInImageUrl: string;
    clockOutImageUrl: string;
    employeeId: number;
    clockInTime: string;
    clockOutTime: string;
    totalTime: string;
    needtoreload: boolean;
    disableClockIn: boolean;
    disableClockOut: boolean;
    clockInAckImageUrl: string | null | undefined;
    clockOutAckImageUrl: string | null | undefined;
    showclockIn15HoursLapsed: boolean;
    attendanceToday: boolean;
  };
  attendanceDetails: {
    employeeName: string;
    employeeNameId: string;
    shiftStartTime: string;
    shiftEndTime: string;
    clockInImageUrl: string;
    clockOutImageUrl: string;
    employeeId: number;
    clockInTime: string;
    clockOutTime: string;
    totalTime: string;
    needtoreload: boolean;
    disableClockIn: boolean;
    disableClockOut: boolean;
    clockInAckImageUrl: string | null | undefined;
    clockOutAckImageUrl: string | null | undefined;
    showclockIn15HoursLapsed: boolean;
    attendanceToday: boolean;
  };
  staffData: [];
  refresh: boolean;
}

let initialState: AttendancesProfileState = {
  attendanceProfileDetails: {
    employeeName: "",
    employeeNameId: "",
    shiftStartTime: "",
    shiftEndTime: "",
    clockInImageUrl: "",
    clockOutImageUrl: "",
    employeeId: 0,
    clockInTime: "",
    clockOutTime: "",
    totalTime: "",
    needtoreload: false,
    disableClockIn: false,
    disableClockOut: false,
    clockInAckImageUrl: "",
    clockOutAckImageUrl: "",
    showclockIn15HoursLapsed: false,
    attendanceToday: false,
  },
  attendanceDetails: {
    employeeName: "",
    employeeNameId: "",
    shiftStartTime: "",
    shiftEndTime: "",
    clockInImageUrl: "",
    clockOutImageUrl: "",
    employeeId: 0,
    clockInTime: "",
    clockOutTime: "",
    totalTime: "",
    needtoreload: false,
    disableClockIn: false,
    disableClockOut: false,
    clockInAckImageUrl: "",
    clockOutAckImageUrl: "",
    showclockIn15HoursLapsed: false,
    attendanceToday: false,
  },
  staffData: [],
  refresh: false,
};

const getStaffData: any = createAsyncThunk(
  "getStaffData",
  async (data: any, { rejectWithValue }) => {
    try {
      const { ID, dateText } = data;
      let response: any = await attendanceStaffAPI.attendanceStaffGetAPI(
        ID,
        dateText
      );
      return response.data.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const onRefreshPage: any = createAsyncThunk(
  "onRefresh",
  async (data: boolean) => {
    if (data) {
      return data;
    } else {
      return false;
    }
  }
);

const getattendancesProfileDetails: any = createAsyncThunk(
  "AttendancesProfileDetails",
  async (data: any, { rejectWithValue }) => {
    try {
      const [employeeID, screentype, clickedDate] = data;
      if (screentype === "Self") {
        const response =
          await attendanceStaffAPI.getAttendanceProfileDetailsAPI(employeeID);
        return response.result;
      } else {
        const response =
          await attendanceStaffAPI.getAttendanceonDateProfileDetailsAPI(
            screentype,
            clickedDate
          );
        return response.result;
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const AttendancesProfileDetails: any = createAsyncThunk(
  "attendancesProfileDetails",
  async (data: any, { rejectWithValue }) => {
    try {
      const [employeeID, screentype, clickedDate, empTimeID] = data;
      let response: any;
      if (screentype === "Self") {
        response = await attendanceStaffAPI.getAttendanceProfileDetailsAPI(
          employeeID
        );
      } else {
        response =
          await attendanceStaffAPI.getAttendanceonDateProfileDetailsAPI(
            employeeID,
            clickedDate,
            empTimeID
          );
      }
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const slice = createSlice({
  name: "AttendancesProfileDetails",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      //state.loading = action.payload;
    },
    logout: (state) => {
      // From here we can take action only at this "counter" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
      console.log("hi hello redux");
    },
    updateAction: (state) => {
      state.attendanceProfileDetails.needtoreload =
        !state.attendanceProfileDetails.needtoreload;
    },
  },
  extraReducers: {
    [getattendancesProfileDetails.fulfilled]: (state, action) => {
      state.attendanceProfileDetails = action.payload;
    },
    [getattendancesProfileDetails.rejected]: (state, action) => {
      state.attendanceProfileDetails = {
        employeeName: "",
        employeeNameId: "",
        shiftStartTime: "",
        shiftEndTime: "",
        clockInImageUrl: "",
        clockOutImageUrl: "",
        employeeId: 0,
        clockInTime: "",
        clockOutTime: "",
        totalTime: "",
        needtoreload: state.attendanceProfileDetails.needtoreload,
        disableClockIn: false,
        disableClockOut: false,
        clockInAckImageUrl: "",
        clockOutAckImageUrl: "",
      };
    },
    [AttendancesProfileDetails.fulfilled]: (state, action) => {
      state.attendanceDetails = action.payload;
    },
    [AttendancesProfileDetails.rejected]: (state, action) => {
      state.attendanceDetails = {
        employeeName: "",
        employeeNameId: "",
        shiftStartTime: "",
        shiftEndTime: "",
        clockInImageUrl: "",
        clockOutImageUrl: "",
        employeeId: 0,
        clockInTime: "",
        clockOutTime: "",
        totalTime: "",
        needtoreload: state.attendanceDetails.needtoreload,
        disableClockIn: false,
        disableClockOut: false,
        clockInAckImageUrl: "",
        clockOutAckImageUrl: "",
      };
    },
    [getStaffData.fulfilled]: (state, action) => {
      state.staffData = action.payload;
    },
    [getStaffData.rejected]: (state, action) => {},
    [onRefreshPage.fulfilled]: (state, action) => {
      state.refresh = action.payload;
    },
    [onRefreshPage.rejected]: (state, action) => {
      state.refresh = false;
    },
  },
});
export const { setLoading, logout, updateAction } = slice.actions;
export {
  getattendancesProfileDetails,
  getStaffData,
  onRefreshPage,
  AttendancesProfileDetails,
};
export default slice.reducer;
