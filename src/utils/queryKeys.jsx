export const queryKeys = {
  countries: (page, search, region) => ["countries", page, search, region],

  corridors: (reporterCode) => ["corridors", reporterCode],

 suppliers: ({ partnerRegion }) => [
  "suppliers",
  partnerRegion,
],
  
  feedback: (page, limit) => ["feedback", page, limit],

  marginImpact: (budget, baseCurrency, quoteCurrency) => [
    "marginImpact",
    budget,
    baseCurrency,
    quoteCurrency,
  ],

  productOverview: (params) => ["productOverview", params],

  productHighlights: (params) => ["productHighlights", params],

  productTable: (filters) => ["productTable", filters],

  /* ===============================
     DASHBOARD OVERVIEW
  =============================== */

  dashboardKPIs: (reporter, partner, product, startDate, endDate) => [
    "dashboardKPIs",
    reporter,
    partner,
    product,
    startDate,
    endDate,
  ],

  exportPriceTrend: (reporter, partner, product, startDate, endDate) => [
    "exportPriceTrend",
    reporter,
    partner,
    product,
    startDate,
    endDate,
  ],

  importDemandTrend: (reporter, partner, product, startDate, endDate) => [
    "importDemandTrend",
    reporter,
    partner,
    product,
    startDate,
    endDate,
  ],

  dutySnapshot: (reporterCode, startDate, endDate) => [
    "dutySnapshot",
    reporterCode,
    startDate,
    endDate,
  ],

  exchangeRates: (reporterCode, partnerCode, startDate, endDate) => [
    "exchangeRates",
    reporterCode,
    partnerCode,
    startDate,
    endDate,
  ],

shippingCosts: (reporterCode, partnerCode, startDate, endDate) => [
  "shippingCosts",
  reporterCode,
  partnerCode,
  startDate,
  endDate,
],
 corridorNews: (countryCode, page = 0, size = 10) => [
  "corridorNews",
  countryCode,
  page,
  size,
],
};
