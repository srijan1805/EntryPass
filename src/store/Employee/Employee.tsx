import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEmployeeDetailsAPI } from '../../utils/EmployeeNetworkAPI';

interface EmployeeState {
  employeeDetails: {
    employeeId: number;
    employeeNameId: string;
    employeeName: string;
    date:string;
    shiftStartTime: string;
    shiftEndTime: string;
    clockInTime: string;
    clockOutTime: string;
    totalTime: string;
    isRequestSubmitted: boolean;
  };
}

let initialState: EmployeeState = {
  employeeDetails: {
    employeeId: 0,
    employeeNameId: '',
    employeeName: '',
    date:'',
    shiftStartTime: '',
    shiftEndTime: '',
    clockInTime: '',
    clockOutTime: '',
    totalTime: '',
    isRequestSubmitted: false,
  },
};

const getEmployeeDetails: any = createAsyncThunk(
  'employeeDetails',
  async (data: any, { rejectWithValue }) => {
    try {
      // Pass the id to fetch data
      const emplID = data;
      let response: any = await getEmployeeDetailsAPI(emplID);
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const slice = createSlice({
  name: 'employeeDetails',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      //state.loading = action.payload;
    },
    logout: state => {
      // From here we can take action only at this "counter" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
       console.log('hi hello redux');

    }
  },
  extraReducers: {
    [getEmployeeDetails.fulfilled]: (state, action) => {
      state.employeeDetails = action.payload;
    },
    [getEmployeeDetails.rejected]: (state, action) => {},
  },
});
export const { setLoading,logout } = slice.actions;
export { getEmployeeDetails };
export default slice.reducer;
