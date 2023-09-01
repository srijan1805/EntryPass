import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAddressHistories,
  getLastVerifiedAddressAPI,
  getEmplyeeAddressAPI,
} from '../../utils/AddressNetworksAPI';

interface AddressHistoryState {
  addressHistory: [];
  loading: boolean;
  history: {
    id: number;
    employeeId: number;
    contactNo: string;
    blockAndStreetName: string;
    floorAndUnitNumber: string;
    postalCode: number;
    numberOfOccupant: number;
    numberOfBathrooms: number;
    numberOfBedrooms: number;
    verifiedDate: string;
    completedBy: string;
  };
  lastVerifiedLocation: {
    id: number;
    employeeId: number;
    contactNo: string;
    blockAndStreetName: string;
    floorAndUnitNumber: string;
    postalCode: number;
    numberOfOccupant: number;
    numberOfBathrooms: number;
    numberOfBedrooms: number;
    verifiedDate: string;
    completedBy: string;
  };
  employeeAddress: {
    id: number;
    employeeId: number;
    contactNo: string;
    blockAndStreetName: string;
    floorAndUnitNumber: string;
    postalCode: number;
    numberOfOccupant: number;
    numberOfBathrooms: number;
    numberOfBedrooms: number;
    verifiedDate: string;
    completedBy: string;
    dueDate: string;
  };
  PostalCode: string;
}

let initialState: AddressHistoryState = {
  addressHistory: [],
  loading: false,
  history: {
    id: 0,
    employeeId: 0,
    contactNo: null,
    blockAndStreetName: '',
    floorAndUnitNumber: '',
    postalCode: 0,
    numberOfOccupant: 0,
    numberOfBathrooms: 0,
    numberOfBedrooms: 0,
    verifiedDate: '',
    completedBy: '',
  },
  lastVerifiedLocation: {
    id: 0,
    employeeId: 0,
    contactNo: null,
    blockAndStreetName: '',
    floorAndUnitNumber: '',
    postalCode: 0,
    numberOfOccupant: 0,
    numberOfBathrooms: 0,
    numberOfBedrooms: 0,
    verifiedDate: '',
    completedBy: '',
  },
  employeeAddress: {
    id: 0,
    employeeId: 0,
    contactNo: '',
    blockAndStreetName: '',
    floorAndUnitNumber: '',
    postalCode: 0,
    numberOfOccupant: 0,
    numberOfBathrooms: 0,
    numberOfBedrooms: 0,
    verifiedDate: '',
    completedBy: '',
    dueDate: '',
  },
  PostalCode: null,
};

const getAddressHistory: any = createAsyncThunk(
  'getAddressHistories',
  async (data: number, { rejectWithValue }) => {
    try {
      const employeeId = data;
      let response: any = await getAddressHistories(employeeId);
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getHistory: any = createAsyncThunk(
  'getHistory',
  async (data: any, { rejectWithValue }) => {
    try {
      const { employeeId, historyId } = data;

      // Pass the id to fetch data
      let response: any = await getAddressHistories(employeeId, historyId);
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getLastVerifiedAddress: any = createAsyncThunk(
  'getLastVerifiedAddress',
  async (data: any, { rejectWithValue }) => {
    try {
      // Pass the id to fetch data
      const emplID = data;
      let response: any = await getLastVerifiedAddressAPI(emplID);
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getEmplyeeAddress: any = createAsyncThunk(
  'getEmplyeeAddress',
  async (data: any, { rejectWithValue }) => {
    try {
      const { empID, addressId } = data;
      console.log('-----data-----getEmplyeeAddress--', data);
      console.log('-----empID-----getEmplyeeAddress--', empID);
      console.log('-----addressId-----getEmplyeeAddress--', addressId);
      // Pass the id to fetch data
      let response: any = await getEmplyeeAddressAPI(empID, addressId);
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const getEmployeePostalCode: any = createAsyncThunk(
  'employeePostal',
  async (data: any) => {
    if (data) {
      return data;
    } else {
      return null;
    }
  },
);

const slice = createSlice({
  name: 'addressHistories',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [getAddressHistory.fulfilled]: (state, action) => {
      state.addressHistory = action.payload;
    },
    [getAddressHistory.rejected]: (state, action) => {},

    [getHistory.fulfilled]: (state, action) => {
      state.history = action.payload;
    },
    [getHistory.rejected]: (state, action) => {},

    [getLastVerifiedAddress.fulfilled]: (state, action) => {
      state.lastVerifiedLocation = action.payload;
    },
    [getLastVerifiedAddress.rejected]: (state, action) => {},

    [getEmplyeeAddress.fulfilled]: (state, action) => {
      state.employeeAddress = action.payload;
    },
    [getEmplyeeAddress.rejected]: (state, action) => {},
    [getEmployeePostalCode.fulfilled]: (state, action) => {
      state.PostalCode = action.payload;
    },
    [getEmployeePostalCode.rejected]: (state, action) => {
      state.PostalCode = null;
    },
  },
});

export const { setLoading } = slice.actions;
export {
  getAddressHistory,
  getHistory,
  getLastVerifiedAddress,
  getEmplyeeAddress,
  getEmployeePostalCode,
};
export default slice.reducer;
