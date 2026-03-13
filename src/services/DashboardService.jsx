import Api from "../api/Api";

/* ===============================
   DASHBOARD OVERVIEW
================================ */

/*    SHIPPING API        */
export const DashboardOverviewShipping = async () => {
  return Api.get("/shipping/latest");
};
/*  Exchange Rates vs NGN   */
export const DashboardOverviewExchange = async (base) => {
  return Api.get(`/exchange/exchange?base=${base}`);
};

/* ===============================
   DASHBOARD EXPORT PRICE TREND
================================ */

export const DashboardExportPriceTrend = async (params = {}) => {
  return Api.get("/dashboard/export-price-trend", { params });
};

/* ===============================
   DASHBOARD IMPORT DEMAND TREND
================================ */

export const DashboardImportDemandTrend = async (params = {}) => {
  return Api.get("/dashboard/import-demand-trend", { params });
};

/* ===============================
   DASHBOARD MARGIN IMPACT
================================ */

export const DashboardMarginImpact = async (budget) => {
  return Api.get("/dashboard/margin-impact", {
    params: { budget }
  });
};

/* ===============================
   DASHBOARD EXCHANGE RATE
================================ */

export const DashboardExchangeRate = async (params = {}) => {
  return Api.get("/dashboard/exchange-rate", { params });
};

/* ===============================
   DASHBOARD SHIPPING COSTS
================================ */

export const DashboardShippingCosts = async (params = {}) => {
  return Api.get("/dashboard/shipping-costs", { params });
};

/* ===============================
   DASHBOARD PRODUCT LIST
================================ */
export const DashboardAllProductList = async (params = {}) => {
  return Api.get("/products/list", { params });
};
export const DashboardProductList = async (params = {}) => {
  return Api.get("/products/search", { params });
};

/* ===============================
   DASHBOARD PRODUCT OVERVIEW
================================ */
export const DashboardProductOverview = async (params = {}) => {
  return Api.get("/products/overview", { params });
};
/* ===============================
   DASHBOARD PRODUCT INSIGHTS
================================ */
export const DashboardProductInsights = async () => {
  return Api.get("/products/insights");
};

/* ===============================
   DASHBOARD PRODUCT HIGHLIGHTS
================================ */
export const DashboardProductHighlights = async (params = {}) => {
  return Api.get("/products/highlights", { params });
};

/* ===============================
   DASHBOARD KPI SUMMARY
================================ */
export const DashboardKPIs = async (params = {}) => {
  return Api.get("/dashboard/kpis", { params });
};


/* ===============================
   DASHBOARD FORECAST
================================ */
export const DashboardForcast = async (hasCode) => {
  return Api.get(`/forecast/dashboard/${hasCode}`);
};

export const ForcastAssets = async ({ limit, page }) => {
  return Api.get(`/forecast/assets?limit=${limit}&page=${page}`);
};

export const ForcastPriceChart = async (hsCode) => {
  return Api.get(`/forecast/price-chart/${hsCode}`);
};
export const ForcastConfidenceChart = async (hsCode) => {
  return Api.get(`/forecast/confidence-chart/${hsCode}`);
};

/* ===============================
   DASHBOARD SUPPLIERS
================================ */
export const DashboardSuppliers = async ({ page, limit }) => {
  return Api.get(`/company/suppliers?page=${page}&limit=${limit}`);
};

/* ===============================
   PRODUCT DROPDOWN SEARCH
================================ */
export const ProductDropdownSearch = async (query) => {
  return Api.get("/products/products", {
    params: { q: query },
  });
};

/* ===============================
   DASHBOARD FORECAST OVERVIEW
================================ */
export const ForecastOverview = async () => {
  return Api.get("/forecast/overview");
};

/* ===============================
   DASHBOARD TRADE NEWS
================================ */
export const DashboardTradeNews = async (countryCode) => {
  return Api.get("/trade/news", {
    params: { countryCode },
  });
};


/* ===============================
   CORRIDORS BY REPORTER COUNTRY
================================ */
export const DashboardCorridors = async (reporterCode) => {
  return Api.get(`/products/corridors?reporter=${reporterCode}`);
};


/* ===============================
   DASHBOARD COUNTRIES LIST
================================ */
export const DashboardCountries = async (params = {}) => {
  return Api.get("/dashboard/countries", { params });
};