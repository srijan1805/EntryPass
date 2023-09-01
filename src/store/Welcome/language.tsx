import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

interface LanguageState {
  selected_lang: string;
  saveRatingSuccess: boolean;
  ageRangeData: [];
  ageRangeSuccess: boolean;
  langugesData: [];
  IstutorialDone: boolean;
  isBackAgePage: boolean;
  IstutorialLandingDone: boolean;
  loading: boolean;
}

let initialState: LanguageState = {
  selected_lang: '',
  saveRatingSuccess: false,
  ageRangeData: [],
  ageRangeSuccess: false,
  langugesData: [],
  IstutorialDone: false,
  isBackAgePage: false,
  IstutorialLandingDone: false,
  loading: false,
};

// const getProfileDetails: any = createAsyncThunk(
//   'getProfileDetails',
//   async (data, { rejectWithValue }) => {
//     try {
//       let response = await request('get', '/common/my-profile-page');
//       return response.data;
//     } catch (e) {
//       return rejectWithValue(e.response.data);
//     }
//   },
// );
const getLanguageDetails: any = createAsyncThunk(
  'getLanguageDetails',
  async (data, {rejectWithValue}) => {
    try {
      let response: any = 'dummy'; 
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

const saveRatings: any = createAsyncThunk(
  'saveRatings',
  async (data, {rejectWithValue}) => {
    try {
      let response: any = 'dummy'; 
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

const getAgeRangeData: any = createAsyncThunk(
  'getAgeRangeData',
  async (data, {rejectWithValue}) => {
    try {
      let response: any = 'dummy'; 
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

const slice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLangauge: (state, action) => {
      console.log('action.payload', action);

      state.selected_lang = action.payload;
    },
    tutorialCheck: (state, action) => {
      state.IstutorialDone = action.payload;
    },
    isbackButtonAge: (state, action) => {
      state.isBackAgePage = action.payload;
    },
    tutorialLandingCheck: (state, action) => {
      state.IstutorialLandingDone = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    // [getProfileDetails.fulfilled]: (state, action) => {

    // },
    // [getProfileDetails.rejected]: (state, action) => {

    // },
    [saveRatings.fulfilled]: (state, action) => {
      state.saveRatingSuccess = true;
    },
    [saveRatings.rejected]: (state, action) => {
      state.saveRatingSuccess = false;
    },

    [getAgeRangeData.fulfilled]: (state, action) => {
      state.ageRangeSuccess = true;
      state.ageRangeData = action.payload;
      state.loading = false;
    },
    [getAgeRangeData.rejected]: (state, action) => {
      state.ageRangeSuccess = false;
      state.ageRangeData = [];
      state.loading = false;
    },
    [getLanguageDetails.fulfilled]: (state, action) => {
      state.langugesData = action.payload;
      console.log('=====>>>', action.payload);
    },
    [getLanguageDetails.rejected]: (state, action) => {},
  },
});

export const {
  setLangauge,
  tutorialCheck,
  isbackButtonAge,
  tutorialLandingCheck,
  setLoading,
} = slice.actions;
export {saveRatings, getAgeRangeData, getLanguageDetails};
export default slice.reducer;
