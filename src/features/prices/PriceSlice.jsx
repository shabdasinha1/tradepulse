import { createSlice } from "@reduxjs/toolkit";

const priceSlice = createSlice({
  name: "prices",
  initialState: {},
  reducers: {
    updatePrices: (state, action) => {
      const { symbol, price } = action.payload;
      state[symbol] = price;
    },
  },
});

export const { updatePrices } = priceSlice.actions;
export default priceSlice.reducer;
