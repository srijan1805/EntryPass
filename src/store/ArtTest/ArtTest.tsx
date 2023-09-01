import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTestKitBrandAPI } from '../../utils/EmployeeNetworkAPI';
import { getProfileDetailsAPI } from '../../utils/ProfileNetworkAPI';

interface TestKitBrandState {
  result: [];
    testKitBrandDetails: {
      result: [
        label: number,
        value: string
      ];
  };
}

let initialState: TestKitBrandState = {
  testKitBrandDetails: {
    result: [
      ,
      ,
    ],
    //result[0]
  },
  result: []
};

const getTestKitBrandDetails: any = createAsyncThunk(
  'testKitBrandDetails',
  async (data: any, { rejectWithValue }) => {
    try {
      // Pass the id to fetch data
      let response: any = await getTestKitBrandAPI();
      return response.result;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);


const slice = createSlice({
  name: 'testKitBrandDetails',
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
    [getTestKitBrandDetails.fulfilled]: (state, action) => {
      state.testKitBrandDetails = action.payload;
    },
    [getTestKitBrandDetails.rejected]: (state, action) => {},
  },
});
export const { setLoading,logout } = slice.actions;
export { getTestKitBrandDetails };
export default slice.reducer;
