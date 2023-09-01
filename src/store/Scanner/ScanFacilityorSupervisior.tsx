// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface ScanState {
//   supervisiorscan: boolean;
//   facilityscan: boolean;
//   scantype: String;
// }

// let initialState: ScanState = {
//   supervisiorscan: false,
//   facilityscan: false,
//   scantype: '',
// };

// const getscantype: any = createAsyncThunk(
//   'getscantype',
//   async (data: any, { rejectWithValue }) => {
//     try {
//       setTimeout(() => {
//         console.log('data--------', data);
//         return data;
//       }, 100);

//       // Pass the id to fetch data
//     } catch (e) {
//       return rejectWithValue(e);
//     }
//   }
// );

// const getsupervisiorscan: any = (state: ScanState) => state.supervisiorscan;
// const getfacilityscan: any = createAsyncThunk(
//   'getfacilityscan',
//   async (data: any, { rejectWithValue }) => {
//     try {
//       // Pass the id to fetch data
//       return data;
//     } catch (e) {
//       return rejectWithValue(e);
//     }
//   }
// );
// // const getsupervisiorscan: any = createAsyncThunk(
// //   'getsupervisiorscan',
// //   async (data: any, { rejectWithValue }) => {
// //     try {
// //       // Pass the id to fetch data
// //       return data;
// //     } catch (e) {
// //       return rejectWithValue(e);
// //     }
// //   }
// // );

// const slice = createSlice({
//   name: 'getscandetails',
//   initialState,
//   reducers: {
//     setsupervisiorscan: (state, action) => {
//       state.supervisiorscan = action.payload;
//     },
//     setfacilityscan: (state, action) => {
//       state.facilityscan = action.payload;
//     },
//     setScantype: (state, action) => {
//       state.scantype = action.payload;
//       console.log('action log -------', action.payload);
//     },
//   },
//   extraReducers: {
//     [getsupervisiorscan.fulfilled]: (state, action) => {
//       state.supervisiorscan = action.payload;
//     },
//     [getsupervisiorscan.rejected]: (state, action) => {},

//     [getfacilityscan.fulfilled]: (state, action) => {
//       state.facilityscan = action.payload;
//     },
//     [getfacilityscan.rejected]: (state, action) => {},

//     [getscantype.fulfilled]: (state, action) => {
//       // state.loading = false
//       console.log('action log ---gett----', action);
//       //state.scantype = payload;
//     },
//     //
//     // [getscantype.fulfilled]: (state, action) => {
//     //   console.log('action log ---gett----', action.payload);
//     //   state.scantype = action.payload;
//     // },
//     [getscantype.rejected]: (state, action) => {},
//   },
// });

// export const { setsupervisiorscan, setfacilityscan, setScantype } =
//   slice.actions;
// export { getsupervisiorscan, getfacilityscan, getscantype };
// export default slice.reducer;

// import { AsyncStorage } from 'react-native';

// const saveArticle = async (key, value) => {
//   try {
//     await AsyncStorage.setItem(key, value);
//   } catch (e) {
//     console.log(e);
//   }
// };

// const getAllData = () => {
//   AsyncStorage.getAllKeys().then((keys) => {
//     return AsyncStorage.multiGet(keys)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   });
// };
