import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface EmployeeState {
  employeeId: number;
}

let initialState: EmployeeState = {
  employeeId: 0,
};

const getEmployeeId: any = (state: EmployeeState) => state.employeeId;

const slice = createSlice({
  name: 'getEmployee',
  initialState,
  reducers: {
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload;
    },
  },
});

export const { setEmployeeId } = slice.actions;
export { getEmployeeId };
export default slice.reducer;
