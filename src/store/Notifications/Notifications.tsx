import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsAPI,
  notificationsPending,
} from "../../utils/NotificationNetworksAPI";

interface NotificationsState {
  notifications: [];
  loading: boolean;
  isPendingNotif: boolean;
}

let initialState: NotificationsState = {
  notifications: [],
  loading: false,
  isPendingNotif: false,
};

const getNotifications: any = createAsyncThunk(
  "getNotifications",
  async (data: any, { rejectWithValue }) => {
    try {
      const employeeId = data;
      let response: any = await getNotificationsAPI(employeeId);
      console.log("NOTIFFF RESPP", response);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const isPendingNotifications: any = createAsyncThunk(
  "isPendingNotifications",
  async (data: any, { rejectWithValue }) => {
    try {
      const employeeId = data;
      let response: any = await notificationsPending(employeeId);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [getNotifications.fulfilled]: (state, action) => {
      state.notifications = action.payload;
    },
    [getNotifications.rejected]: () => {},

    [isPendingNotifications.fulfilled]: (state, action) => {
      return { ...state, isPendingNotif: action.payload };
    },
    [isPendingNotifications.rejected]: () => {},
  },
});

export const { setLoading } = slice.actions;
export { getNotifications, isPendingNotifications };
export default slice.reducer;
