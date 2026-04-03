import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rates: {}, // ✅ { GBP: 1836, USD: 1390, NGN: 1 }
  lastUpdated: null,
};

const fxSlice = createSlice({
  name: "fx",
  initialState,
  reducers: {
    setExchangeRates: (state, action) => {
      state.rates = action.payload.rates;
      state.lastUpdated = action.payload.lastUpdated;
    },

    resetExchangeRates: (state) => {
      state.rates = {};
      state.lastUpdated = null;
    },
  },
});

export const { setExchangeRates, resetExchangeRates } = fxSlice.actions;
export default fxSlice.reducer;