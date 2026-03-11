import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  country: "United Kingdom",
  reporterCode: "826",
  partnerCode: 566,
  corridor: 566,
  productId: "",
  timeRange: "90d",
};

const corridorSlice = createSlice({
  name: "corridor",
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.country = action.payload;
    },

    setReporterCode: (state, action) => {
      state.reporterCode = action.payload;
      state.partnerCode = null;
      state.corridor = null;
      state.productId = null;
    },

    setCorridor: (state, action) => {
      state.corridor = action.payload;
      state.productId = null;
    },

    setPartnerCode: (state, action) => {
      state.partnerCode = action.payload;
    },

    setProduct: (state, action) => {
      state.productId = action.payload;
    },

    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },

    resetFilters: (state) => {
      state.country = "United Kingdom";
      state.reporterCode = "826";
      state.partnerCode = 566;
      state.corridor = 566;
      state.productId = "";
      state.timeRange = "90d";
    },
  },
});

export const {
  setCountry,
  setReporterCode,
  setPartnerCode,
  setCorridor,
  setProduct,
  setTimeRange,
  resetFilters,
} = corridorSlice.actions;

export default corridorSlice.reducer;