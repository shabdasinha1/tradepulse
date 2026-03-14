import { useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  DashboardProductOverview,
  DashboardAllProductList,
  DashboardProductHighlights,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import VerticalScroll from "../../components/common/VerticalScroll";
import { FiSliders } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel";
import PageDisclaimer from "../../components/common/PageDisclaimer";
import UniversalFilter from "../../components/common/UniversalFilter";
import useUniversalFilters from "../../hooks/useUniversalFilters";

/* ===============================
   SKELETON COMPONENT
================================ */

const Skeleton = React.memo(({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
));

/* ===============================
   MAIN COMPONENT
================================ */

const DashboardProduct = () => {
  const { reporterCode, productId, partnerCode, corridor, startDate, endDate } =
    useSelector((state) => state.corridor, shallowEqual);
  


  const shortCorridor = corridor?.includes(",")
    ? corridor.split(",")[0] + "..."
    : corridor;

  const observer = useRef(null);
  const requestRef = useRef(0);

  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  const [error, setError] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

  /* ===============================
   LOCAL TABLE FILTERS (HOOK)
================================ */

  const { filters, setFilters } = useUniversalFilters({
    partnerCode: partnerCode || "",
    product: "",
    riskLevel: "",
    startDate: "",
    endDate: "",
  });

  const [productData, setProductData] = useState({
    productOverview: {},
    productHighlights: {},
  });

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const activePartner = filters.partnerCode || partnerCode;

  /* ===============================
     FETCH PRODUCT OPTIONS
  =============================== */

  const { data: allProductsData } = useQuery({
    queryKey: ["allProducts"],
    queryFn: () => DashboardAllProductList(),
  });

  useEffect(() => {
    if (allProductsData?.success) {
      setAllProducts(allProductsData?.data?.data || []);
    }
  }, [allProductsData]);

  /* ===============================
     GLOBAL PARAMS
  =============================== */

  const globalParams = useMemo(
    () => ({
      reporter: reporterCode,
      partner: partnerCode,
      product: productId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [reporterCode, partnerCode, productId, startDate, endDate],
  );

  /* ===============================
     OVERVIEW API
  =============================== */

  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ["productOverview", globalParams],
    queryFn: () => DashboardProductOverview(globalParams),
    enabled: !!partnerCode,
  });

  /* ===============================
     HIGHLIGHTS API
  =============================== */

  const { data: highlightData } = useQuery({
    queryKey: ["productHighlights", globalParams],
    queryFn: () => DashboardProductHighlights(globalParams),
    enabled: !!partnerCode,
  });

  /* ===============================
     STORE OVERVIEW + HIGHLIGHTS
  =============================== */

  useEffect(() => {
    setProductData({
      productOverview: overviewData?.data || {},
      productHighlights: highlightData?.data || {},
    });
  }, [overviewData, highlightData]);

  /* ===============================
     TABLE FILTER KEY
  =============================== */

  const tableFilterKey = useMemo(
    () => ({
      partnerCode: filters.partnerCode,
      product: filters.product,
      riskLevel: filters.riskLevel,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
    [
      filters.partnerCode,
      filters.product,
      filters.riskLevel,
      filters.startDate,
      filters.endDate,
    ],
  );

  /* ===============================
     FETCH TABLE PRODUCTS
  =============================== */

  const fetchProducts = async (reset = false) => {


  if (!reporterCode || !activePartner) return;

  const requestId = ++requestRef.current;

  setIsTableLoading(true);

  try {

    const params = {
      reporter: reporterCode,
      partner: activePartner,
      product: filters.product || productId || undefined,
      startDate: filters.startDate || startDate || undefined,
      endDate: filters.endDate || endDate || undefined,
      risk: filters.riskLevel
        ? filters.riskLevel.toUpperCase()
        : undefined,
      page: reset ? 1 : page,
      limit: 10,
    };

    const res = await DashboardAllProductList(params);

    if (requestId !== requestRef.current) return;

    const newData = res?.data?.data ?? [];

    setProducts((prev) => {
      if (reset) return newData;

      const map = new Map(prev.map((i) => [i.product, i]));
      newData.forEach((i) => map.set(i.product, i));
      return Array.from(map.values());
    });

    setHasMore(newData.length === 10);

  } catch (err) {
    setError(GetApiErrorMessage(err));
  } finally {
    setIsTableLoading(false);
  }
};

  /* ===============================
     FETCH WHEN FILTERS CHANGE
  =============================== */

  useEffect(() => {
    if (!activePartner) return;

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProducts(true);
  }, [
  reporterCode,
  activePartner,
  filters.product,
  filters.riskLevel,
  filters.startDate,
  filters.endDate
]);

  /* ===============================
     FETCH PAGINATION
  =============================== */

  useEffect(() => {
    if (page === 1) return;
    fetchProducts();
  }, [page]);

  /* ===============================
     INFINITE SCROLL
  =============================== */

  const lastProductRef = useCallback(
    (node) => {
      if (isTableLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isTableLoading, hasMore],
  );

  /* ===============================
     PRODUCT ROWS
  =============================== */

  const productRows = useMemo(() => {
    return products.map((item, index) => {
      const isLast = products.length === index + 1;

      return (
        <div
          ref={isLast ? lastProductRef : null}
          className="product-row"
          key={item.product || index}
        >
          <span>{item.product}</span>

          <span className="tp-muted text-center">
            £{Number(item.avgExportPrice).toFixed(2)}
          </span>

          <span className="text-center">
            <span className="tp-pill tp-pill-primary">
              {item.importDemandTrend}
            </span>
          </span>

          <span className="text-center">
            <span className="tp-pill tp-pill-primary">
              {item.exportActivityLevel}
            </span>
          </span>

          <span className="text-center">
            <span
              className={`tp-pill ${
                item.volatilityRisk === "LOW"
                  ? "tp-pill-success"
                  : item.volatilityRisk === "MEDIUM"
                    ? "tp-pill-warning"
                    : item.volatilityRisk === "HIGH"
                      ? "tp-pill-danger"
                      : ""
              }`}
            >
              {item.volatilityRisk}
            </span>
          </span>
        </div>
      );
    });
  }, [products, lastProductRef]);

  /* ===============================
     FILTER HANDLER
  =============================== */

  const handleFilterChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
    }));

    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  /* ===============================
     UI
  =============================== */

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        <header>
          <h1 className="tp-section-title">
            Corridor Product <span>Intelligence</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Product performance within selected trade corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              <div className="tp-corridor-pill">
                <span className="tp-country">Active Corridor :</span>
                <span
                  className="tp-country tp-country-truncate"
                  title={corridor}
                >
                  {shortCorridor || "Selected Corridor"}
                </span>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFilterOpen(true)}
              >
                <FiSliders />
                Filters
              </button>
            </div>
          </div>
        </header>

        <span className="tp-product-disclaimer">
          <PageDisclaimer />
        </span>

        {error && (
          <div className="tp-error-box">
            <p>{error}</p>
          </div>
        )}

        {/* ================= OVERVIEW ================= */}

        <div className="tp-grid tp-product-overview-grid">
          {overviewLoading ? (
            [...Array(4)].map((_, i) => (
              <div className="tp-card" key={i}>
                <Skeleton className="sk-text-sm" />
                <Skeleton className="sk-text-lg" />
              </div>
            ))
          ) : (
            <>
              <div className="tp-card">
                <p className="tp-muted">Most Imported Product ({corridor})</p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.totalProducts || "-"}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Fastest Growing Demand ({corridor})</p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.activeProducts || "-"}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Price Volatility</p>
                <h3 className="tp-text-up tp-overview-text">
                  {productData?.productOverview?.topValueProduct?.split(",")[0]}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Risk Product</p>
                <h3 className="tp-text-down tp-overview-text">
                  {
                    productData?.productOverview?.lowestValueProduct?.split(
                      ",",
                    )[0]
                  }
                </h3>
              </div>
            </>
          )}
        </div>

        {/* ================= TABLE ================= */}

        <div className="tp-card">
          <div className="tp-table-header">
            <h3 className="tp-table-title">Product List</h3>

            <button
              className="tp-btn-outline tp-overview-filter-btn"
              onClick={() => setTableFilterOpen(true)}
            >
              <CiFilter />
              Filters
            </button>
          </div>

          <div className="product-table-wrapper">
            <div className="product-table">
              <div className="product-row product-head">
                <span>Product</span>
                <span className="text-center">Avg Export Price</span>
                <span className="text-center">UK Import Demand Trend</span>
                <span className="text-center">Export Activity Level</span>
                <span className="text-center">Volatility Risk</span>
              </div>

              <VerticalScroll>
                {products.length === 0 && !isTableLoading && (
                  <div className="product-row tp-empty-row">
                    <span className="tp-muted tp-empty-text">
                      Product not found
                    </span>
                  </div>
                )}

                {productRows}

                {isTableLoading &&
                  [...Array(4)].map((_, i) => (
                    <div className="product-row" key={i}>
                      {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="sk-table-cell" />
                      ))}
                    </div>
                  ))}
              </VerticalScroll>
            </div>
          </div>
        </div>

        {/* ================= INSIGHTS ================= */}

        <div className="tp-grid tp-insight-grid">
          <div className="tp-card">
            <p className="tp-muted">Most Imported Product ({corridor})</p>
            <h3 className="tp-overview-text">
              {productData?.productHighlights?.mostTradedProduct || "N/A"}
            </h3>
          </div>

          <div className="tp-card">
            <p className="tp-muted">Highest Price Volatility ({corridor})</p>
            <h3 className="tp-overview-text">
              {productData?.productHighlights?.highestVolatilityProduct ||
                "N/A"}
            </h3>
          </div>
        </div>
      </div>

      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}

      {tableFilterOpen && (
        <UniversalFilter
          showCorridor
          showProduct
          showTimeRange
          showRiskLevel
          productOptions={allProducts}
          defaultValues={filters}
          onChange={(values) => {
            handleFilterChange(values);
            setTableFilterOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default DashboardProduct;
