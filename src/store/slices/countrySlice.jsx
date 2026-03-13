import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  countries: [],
  countryMap: {}
}

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountries: (state, action) => {
      const countries = action.payload || []

      state.countries = [...countries].sort((a, b) =>
        a.name.localeCompare(b.name)
      )

      state.countryMap = countries.reduce((acc, c) => {
        acc[c.numeric] = c.name
        return acc
      }, {})
    }
  }
})

export const { setCountries } = countrySlice.actions
export default countrySlice.reducer