import { configureStore } from "@reduxjs/toolkit"
import corridorReducer from "./slices/corridorSlice"

export const store = configureStore({
  reducer: {
    corridor: corridorReducer
  }
})