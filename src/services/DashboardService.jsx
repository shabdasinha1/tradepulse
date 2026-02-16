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
  // return Api.get("/api/exchange?base=EUR");
  return Api.get(`/exchange?base=${base}`);
};

/* ===============================
   DASHBOARD PRODUCT LIST
================================ */
// export const DashboardProductList = async () => {
//   return Api.get("/products/list");
// };
export const DashboardProductList = async () => {
  return Api.get("/products/search");
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
export const DashboardForcast = async () => {
  return Api.get("/forecast/forecast");
};

/* ===============================
   DASHBOARD SUPPLIERS
================================ */
export const DashboardSuppliers = async ({ page, limit }) => {
  return Api.get(`/company/suppliers?page=${page}&limit=${limit}`);
};
