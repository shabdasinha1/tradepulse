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

// DASHBOARD PRICE TREND GRAPH
export const DashboardPriceTrend = async (priceHsCode) => {
  return Api.get(`/products/priceTrend?hs=${priceHsCode}`);
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
export const DashboardProductOverview = async () => {
  return Api.get("/products/overview");
};
/* ===============================
   DASHBOARD PRODUCT INSIGHTS
================================ */
export const DashboardProductInsights = async () => {
  return Api.get("/products/insights");
};

/* ===============================
   DASHBOARD FORECAST
================================ */
export const DashboardForcast = async (hasCode) => {
  return Api.get(`/forecast/dashboard/${hasCode}`);
};
//  DASHBOARD FORCAST DEMANG GRAPH
export const DemandGrowthForecast = async (demandHsCode) => {
  // return Api.get(`/forecast/demandForecast?hs=${demandHsCode}`);
  return Api.get(`/forecast/demand/${demandHsCode}`);
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