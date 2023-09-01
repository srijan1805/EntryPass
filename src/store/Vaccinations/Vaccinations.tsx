import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { vaccinationAPIcall } from "../../utils/VaccinationAPI";

interface VaccinationsState {
  ListEmployeeDetailsData: [];
  ListVaccinationDetailsData: [];
  loading: boolean;
}

let initialState: VaccinationsState = {
  ListEmployeeDetailsData: [],
  ListVaccinationDetailsData: [],
  loading: false,
};

const getVaccinations: any = createAsyncThunk(
  "getNotifications",
  async (data: any, { rejectWithValue }) => {
    try {
      const employeeId = data;
      let response: any = await vaccinationAPIcall.VaccinationApiPost(
        employeeId
      );
      console.log("----------", response.data);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const slice = createSlice({
  name: "vaccinations",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [getVaccinations.fulfilled]: (state, action) => {
      state.ListEmployeeDetailsData = action.payload;
      state.ListVaccinationDetailsData = action.payload;
    },
    [getVaccinations.rejected]: (state, action) => {},
  },
});

export const { setLoading } = slice.actions;
export { getVaccinations };
export default slice.reducer;
