import { createSlice } from "@reduxjs/toolkit"
import { sortedCountries, countryNumericMap } from "../../data/Data.jsx"

const initialState = {
  countries: sortedCountries,
  countryMap: countryNumericMap
}

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {}
})

export default countrySlice.reducer