import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import addressHistoryReducer from "./AddressHistory/AddressHistory";
import userReducer from "./User/User";
import disabledUserReducer from "./User/DisabledUser";
import scanReducer from "./Scanner/ScanFacilityorSupervisior";
import profileReducer from "./Profile/Profile";
import employeeReducer from "./Employee/Employee";
import testKitBrandReducer from "./ArtTest/ArtTest";
import attendanceReducer from "./Attendances/Attendances";
import notificationReducer from "./Notifications/Notifications";

const appReducer = combineReducers({
  addressHistoryState: addressHistoryReducer,
  userState: userReducer,
  scanState: scanReducer,
  disabledUserState: disabledUserReducer,
  profileState: profileReducer,
  employeeState: employeeReducer,
  testKitBrand: testKitBrandReducer,
  attendanceprofileState: attendanceReducer,
  notificationState: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "addressHistory",
    "user",
    "scan",
    "notifications",
    "disabledUser",
    "staffData",
    "refresh",
    "PostalCode",
  ], //Things u want to persist
  // blacklist: ['medGlobalSearch','brands','rapidResponse','news','notifications'], //Things u dont
};

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  // console.log('inside redux clear', action);

  if (action.type === "profileDetails/logout") {
    state = undefined;
    console.log("inside redux clear");
  }
  return appReducer(state, action);
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

let persistor = persistStore(store);
export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;
export { persistor };
export default store;
//export default reducer;
