export const queryKeys = {
  countries: (page, search) => ["countries", page, search],

  corridors: (reporterCode) => ["corridors", reporterCode],

  suppliers: ({
  reporterCode,
  partnerCode,
  startDate,
  endDate,
  tradeflow,
  region,
  isInitialLoad,
}) => [
  "suppliers",
  isInitialLoad ? "initial" : "filtered",
  reporterCode,
  partnerCode, // ✅ ADD THIS
  startDate,
  endDate,
  tradeflow,
  region,
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

  shippingCosts: (startDate, endDate, origin, destination) => [
    "shippingCosts",
    startDate,
    endDate,
    origin,
    destination,
  ],
  corridorNews: (reporter, partner, startDate, endDate) => [
    "corridorNews",
    reporter,
    partner,
    startDate,
    endDate,
  ],
};
