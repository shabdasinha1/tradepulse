import { createSlice } from "@reduxjs/toolkit";
import getSymbolFromCurrency from "currency-symbol-map";

const initialState = {
  country: "United Kingdom",
  countryCode: "GBR",
  reporterCode: "826",
  partnerCode: 566,
  partnerCountry: "Nigeria",
  partnerCountryCode: "NGA",
  corridor: "UK ↔ Nigeria",
  productId: "",
  productLabel: "",
  timeRange: "90d",
  startDate: null,
  endDate: null,
  baseCurrency: "GBP",
  currencySymbol: getSymbolFromCurrency("GBP"),
  quoteCurrency: "NGN",
  quoteCurrencySymbol: getSymbolFromCurrency("NGN"),
  tradeflow: "EXPORT",
  region: "Europe",
  partnerRegion:"Africa"
};

const corridorSlice = createSlice({
  name: "corridor",
  initialState,
  reducers: {
    setCountry: (state, action) => {
  const { name, numeric, currency, region, alpha3 } = action.payload;

  state.country = name;
  state.reporterCode = numeric;
  state.baseCurrency = currency;
  state.currencySymbol = getSymbolFromCurrency(currency);

  // ✅ NEW
  if (alpha3) {
    state.countryCode = alpha3;
  }

  if (region !== undefined) {
    state.region = region;
  }
},
    setReporterCode: (state, action) => {
      state.reporterCode = action.payload;
      state.partnerCode = null;
      state.partnerCountry = null;
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

   setPartnerCountry: (state, action) => {
  const { name, alpha3, region } = action.payload;

  state.partnerCountry = name;

  if (alpha3) {
    state.partnerCountryCode = alpha3;
  }

  // ✅ NEW
  if (region !== undefined) {
    state.partnerRegion = region;
  }
},

    setProduct: (state, action) => {
      state.productId = action.payload.value;
      state.productLabel = action.payload.label;
    },

    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },

    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setTradeflow: (state, action) => {
      state.tradeflow = action.payload;
    },
    setQuoteCurrency: (state, action) => {
      state.quoteCurrency = action.payload;
      state.quoteCurrencySymbol = getSymbolFromCurrency(action.payload);
    }, setRegion: (state, action) => {
      state.region = action.payload;
    },
    setPartnerRegion: (state, action) => {
  state.partnerRegion = action.payload;
},
    resetFilters: (state) => {
      state.country = "United Kingdom";
      state.countryCode = "GBR";
      state.reporterCode = "826";
      state.partnerCode = 566;
      state.partnerCountry = "Nigeria";
      state.partnerCountryCode = "NGA";
      state.corridor = "UK ↔ Nigeria";
      state.productId = "";
      state.productLabel = "";
      state.timeRange = "90d";
      state.startDate = null;
      state.endDate = null;
      state.baseCurrency = "GBP";
      state.currencySymbol = getSymbolFromCurrency("GBP");
      state.quoteCurrency = "NGN";
      state.quoteCurrencySymbol = getSymbolFromCurrency("NGN");
      state.tradeflow = "EXPORT";
      state.region = "Europe";
      state.partnerRegion = "Africa";
    },
  },
});

export const {
  setCountry,
  setReporterCode,
  setPartnerCode,
  setPartnerCountry,
  setCorridor,
  setProduct,
  setTimeRange,
  setDateRange,
  setTradeflow,
  setQuoteCurrency,
  setRegion,
  setPartnerRegion, 
  resetFilters,
} = corridorSlice.actions;

export default corridorSlice.reducer;