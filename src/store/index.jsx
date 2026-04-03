import { configureStore } from "@reduxjs/toolkit"
import corridorReducer from "./slices/corridorSlice"
import countryReducer from "./slices/countrySlice"
import fxReducer from "./slices/fxSlice"

export const store = configureStore({
  reducer: {
    corridor: corridorReducer,
    country: countryReducer,
    fx: fxReducer,
  }
})