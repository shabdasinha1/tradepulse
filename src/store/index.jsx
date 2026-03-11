import { configureStore } from "@reduxjs/toolkit"
import corridorReducer from "./slices/corridorSlice"
import countryReducer from "./slices/countrySlice"

export const store = configureStore({
  reducer: {
    corridor: corridorReducer,
    country: countryReducer
  }
})