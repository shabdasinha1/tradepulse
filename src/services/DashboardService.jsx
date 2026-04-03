import Api from "../api/Api";

/* ===============================
   PARAM CLEANER
================================ */

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== ""),
  );

/* ===============================
   DASHBOARD OVERVIEW
================================ */

/*    SHIPPING API        */
export const DashboardOverviewShipping = async () => {
  return Api.get("/app/api/shipping/latest");
};

/*  Exchange Rates vs NGN   */
export const DashboardOverviewExchange = async (base) => {
  return Api.get("/app/api/exchange/exchange", {
    params: cleanParams({ base }),
  });
};

/* ===============================
   DASHBOARD EXPORT PRICE TREND
================================ */

export const DashboardExportPriceTrend = async (params = {}) => {
  return Api.get("/app/api/dashboard/export-price-trend", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD IMPORT DEMAND TREND
================================ */

export const DashboardImportDemandTrend = async (params = {}) => {
  return Api.get("/app/api/dashboard/import-demand-trend", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD MARGIN IMPACT
================================ */

export const DashboardMarginImpact = async ({
  budget,
  baseCurrency,
  quoteCurrency,
}) => {
  return Api.get("/app/api/dashboard/margin-impact", {
    params: cleanParams({
      budget,
      baseCurrency,
      quoteCurrency,
    }),
  });
};

/* ===============================
   DASHBOARD EXCHANGE RATE
================================ */

export const DashboardExchangeRate = async (params = {}) => {
  return Api.get("/app/api/dashboard/exchange-rate", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD SHIPPING COSTS
================================ */

export const DashboardShippingCosts = async (params = {}) => {
  return Api.get("/app/api/dashboard/shipping-costs", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD DUTY SNAPSHOT
================================ */

export const DashboardDutySnapshot = async (params = {}) => {
  return Api.get("/app/api/dashboard/duty-snapshot", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD PRODUCT LIST
================================ */

export const DashboardAllProductList = async (params = {}) => {
  return Api.get("/app/api/products/list", {
    params: cleanParams(params),
  });
};

export const DashboardProductList = async (params = {}) => {
  return Api.get("/app/api/products/search", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD PRODUCT OVERVIEW
================================ */

export const DashboardProductOverview = async (params = {}) => {
  return Api.get("/app/api/products/overview", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD PRODUCT INSIGHTS
================================ */

export const DashboardProductInsights = async () => {
  return Api.get("/app/api/products/insights");
};

/* ===============================
   DASHBOARD PRODUCT HIGHLIGHTS
================================ */

export const DashboardProductHighlights = async (params = {}) => {
  return Api.get("/app/api/products/highlights", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD KPI SUMMARY
================================ */

export const DashboardKPIs = async (params = {}) => {
  return Api.get("/app/api/dashboard/kpis", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD FORECAST
================================ */

export const DashboardForcast = async (hasCode) => {
  return Api.get(`/app/api/forecast/dashboard/${hasCode}`);
};

export const ForcastAssets = async ({ limit, page }) => {
  return Api.get("/app/api/forecast/assets", {
    params: cleanParams({ limit, page }),
  });
};

export const ForcastPriceChart = async (hsCode) => {
  return Api.get(`/app/api/forecast/price-chart/${hsCode}`);
};

export const ForcastConfidenceChart = async (hsCode) => {
  return Api.get(`/app/api/forecast/confidence-chart/${hsCode}`);
};

/* ===============================
   PRODUCT DROPDOWN SEARCH
================================ */

export const ProductDropdownSearch = async (query) => {
  return Api.get("/app/api/products/products", {
    params: cleanParams({ q: query }),
  });
};

/* ===============================
   DASHBOARD FORECAST OVERVIEW
================================ */

export const ForecastOverview = async () => {
  return Api.get("/app/api/forecast/overview");
};

/* ===============================
   DASHBOARD TRADE NEWS
================================ */

// export const DashboardTradeNews = async (countryCode) => {
//   return Api.get("/trade/news", {
//     params: cleanParams({ countryCode }),
//   });
// };
export const DashboardTradeNews = async (params = {}) => {
  return Api.get("/app/api/dashboard/corridor-news", {
    params: cleanParams(params),
  });
};

/* ===============================
   CORRIDORS BY REPORTER COUNTRY
================================ */

export const DashboardCorridors = async (reporterCode) => {
  return Api.get("/app/api/products/corridors", {
    params: cleanParams({ reporter: reporterCode }),
  });
};

/* ===============================
   DASHBOARD COUNTRIES LIST
================================ */

export const DashboardCountries = async (params = {}) => {
  return Api.get("/app/api/dashboard/countries", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD SUPPLIERS
================================ */

export const DashboardSuppliers = async (params = {}) => {
  return Api.get("/app/api/company/suppliers", {
    params: cleanParams(params),
  });
};

/* ===============================
   COMPANY SUPPLIERS 
================================ */

export const DashboardCompanySuppliers = async (params = {}) => {
  return Api.get("/app/api/company/company-suppliers", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD FEEDBACK
================================ */
export const DashboardFeedback = async (params = {}) => {
  return Api.get("/app/api/feedback/get", {
    params: cleanParams(params),
  });
};

/* ===============================
   DASHBOARD REGIONS
================================ */

export const DashboardRegions = async () => {
  return Api.get("/app/api/company/regions");
};

/* ===============================
   TRADE NEWS (EXTERNAL API)
================================ */
export const DashboardTradeNewsExternal = async ({
  countryCode,
  page = 0,
  size = 10,
}) => {
  return Api.get(`/news-int/api/news`, {
    params: {
      country: countryCode,
      page,
      size,
    },
  });
};

/* ===============================
   SUPPLIER MANAGEMENT APIs
================================ */

/* 📄 Get Suppliers (List + Filters + Pagination) */
export const GetSuppliers = async (params = {}) => {
  return Api.get("/supplier-dir-int/api/suppliers", {
    params: cleanParams(params),
  });
};

/* 🔍 Get Supplier by ID */
export const GetSupplierById = async (id) => {
  return Api.get(`/supplier-dir-int/api/suppliers/${id}`);
};

/* ➕ Create Single Supplier */
export const CreateSupplier = async (data) => {
  return Api.post("/supplier-dir-int/api/suppliers", data);
};

export const CreateSupplierBulk = async (data) => {
  return Api.post("/supplier-dir-int/api/suppliers/bulk", data);
};

// Delete Suppliers
export const DeleteSuppliers = async (id) => {
  return Api.delete(`/supplier-dir-int/api/suppliers/${id}`);
};
/* 📤 Bulk Upload Suppliers */
export const BulkCreateSuppliers = async (data = []) => {
  return Api.post("/supplier-dir-int/api/suppliers/bulk", data);
};

/* ✅ Verify Supplier */
export const VerifySupplier = async (id, payload) => {
  return Api.post(`/supplier-dir-int/api/suppliers/${id}/verify`, payload);
};

/* 🧾 Get Data Source Metadata (Dropdown) */
export const GetSupplierDataSources = async () => {
  return Api.get("/supplier-dir-int/api/suppliers/meta/data-source");
};

/* 🏷️ Get Verification Status Metadata (Dropdown) */
export const GetSupplierVerificationStatuses = async () => {
  return Api.get("/supplier-dir-int/api/suppliers/meta/verification-status");
};

/* 🔎 Supplier Name Suggestions (Autocomplete) */
export const SuggestSuppliers = async (name) => {
  return Api.get("/supplier-dir-int/api/suppliers/suggest", {
    params: cleanParams({ name }),
  });
};
export const GetDataSources = async (name) => {
  return Api.get("/supplier-dir-int/api/suppliers/meta/data-source", {
    params: cleanParams({ name }),
  });
};

/* ===============================
   SCHEDULER / ORCHESTRATOR APIs
================================ */

/* 📄 Get All Jobs */
export const GetSchedulerJobs = async () => {
  return Api.get("/orchestrator/jobs");
};

/* 🔍 Get Job By ID */
export const GetSchedulerJobById = async (id) => {
  return Api.get(`/orchestrator/jobs/${id}`);
};

/* ➕ Create Job */
export const CreateSchedulerJob = async (data) => {
  return Api.post("/orchestrator/jobs", data);
};

/* ▶️ Trigger Job */
export const TriggerSchedulerJob = async (id) => {
  return Api.post(`/orchestrator/jobs/${id}/trigger`);
};

/* ✏️ Update Job */
export const UpdateSchedulerJob = async (id, data) => {
  return Api.put(`/orchestrator/jobs/${id}`, data);
};

/* ❌ Delete Job */
export const DeleteSchedulerJob = async (id) => {
  return Api.delete(`/orchestrator/jobs/${id}`);
};

/* ===============================
   USER APIs
================================ */

/* 🔍 Get User By Email */
export const GetUserByEmail = async (email) => {
  return Api.get("/app/api/users/get-user", {
    params: cleanParams({ email }),
  });
};

/* ✏️ Update User */
export const UpdateUser = async (id, data) => {
  return Api.put(`/app/api/users/update-user/${id}`, data);
};

/* GET DATA SOURCES OF USER */
export const UserDataSources = async () => {
  return Api.get("/app/api/users/sources");
};
/* ===============================
   FX RATES
================================ */
export const FXRatesData = async (params = {}) => {
  return Api.get("/app/api/exchange/exchange-rate", {
    params: cleanParams(params),
  });
};
/* ===============================
   SHIPPING HISTORY
================================ */
export const ShippingHistoryData = async (params = {}) => {
  return Api.get("/app/api/shipping/history", {
    params: cleanParams(params),
  });
};
/* ===============================
   SHIPPING HISTORY
================================ */
export const DutySnapshotData = async (params = {}) => {
  return Api.get("/app/api/duty/history", {
    params: cleanParams(params),
  });
};
