import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  corridorId: "uk-ng",
  productId: null,
  timeRange: "90d"
}
const corridorSlice = createSlice({
  name: "corridor",
  initialState,
  reducers: {
    setCorridor: (state, action) => {
      state.corridorId = action.payload
      state.productId = null // reset product when corridor changes
    },
    setProduct: (state, action) => {
      state.productId = action.payload
    },
    setTimeRange: (state, action) => {
      state.timeRange = action.payload
    },
    resetFilters: (state) => {
      state.corridorId = null
      state.productId = null
      state.timeRange = "90d"
    }
  }
})

export const {
  setCorridor,
  setProduct,
  setTimeRange,
  resetFilters
} = corridorSlice.actions

export default corridorSlice.reducer