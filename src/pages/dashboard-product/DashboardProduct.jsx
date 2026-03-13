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

const DEFAULT_FILTERS = {
  partnerCode: "",
  product: "",
  timeRange: "90d",
  riskLevel: "",
};

/* ===============================
   SKELETON COMPONENTS
================================ */

const Skeleton = React.memo(({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
));

const ProductOverviewSkeleton = () => {
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack tp-skeleton-opacity">
        <div className="tp-grid tp-product-overview-grid">
          {[...Array(4)].map((_, i) => (
            <div className="tp-card" key={i}>
              <Skeleton className="sk-text-sm" />
              <Skeleton className="sk-text-lg" />
            </div>
          ))}
        </div>

        <div className="tp-card tp-skeleton">
          {[...Array(6)].map((_, i) => (
            <div className="product-row" key={i}>
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="sk-table-cell" />
              ))}
            </div>
          ))}
        </div>

        <div className="tp-grid tp-grid-2">
          {[...Array(2)].map((_, i) => (
            <div className="tp-card" key={i}>
              <Skeleton className="sk-text-sm" />
              <Skeleton className="sk-text-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===============================
   MAIN COMPONENT
================================ */

const DashboardProduct = () => {
  const { reporterCode, partnerCode, corridor, startDate, endDate } =
    useSelector((state) => state.corridor, shallowEqual);

  const observer = useRef(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);

  const [error, setError] = useState(null);
  const requestRef = useRef(0);

  const [isTableLoading, setIsTableLoading] = useState(false);

  const [filters, setFilters] = useState({
    partnerCode: partnerCode || "",
    product: "",
    timeRange: "90d",
    riskLevel: "",
  });

  const [productData, setProductData] = useState({
    productOverview: {},
    productHighlights: {},
  });

  const [allProducts, setAllProducts] = useState([]);

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
     FETCH PRODUCT OPTIONS
  ================================ */

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
     FETCH OVERVIEW + INSIGHTS
  ================================ */

  const activePartner = filters.partnerCode || partnerCode;

  const params = useMemo(
    () => ({
      reporter: reporterCode,
      partner: activePartner,
      product: filters.product || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [reporterCode, activePartner, filters.product, startDate, endDate],
  );

  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: [
      "productOverview",
      reporterCode,
      activePartner,
      filters.product,
      startDate,
      endDate,
    ],
    queryFn: () => DashboardProductOverview(params),
    enabled: !!activePartner,
  });

  const { data: highlightData } = useQuery({
    queryKey: [
      "productHighlights",
      reporterCode,
      partnerCode,
      filters.product,
      startDate,
      endDate,
    ],
    queryFn: () => DashboardProductHighlights(params),
    enabled: !!partnerCode,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      partnerCode: partnerCode || "",
    }));
  }, [partnerCode]);
  /* ===============================
     FETCH TABLE DATA
  ================================ */

  const fetchProducts = async (reset = false) => {
    if (isTableLoading) return;

    const requestId = ++requestRef.current;

    setIsTableLoading(true);

    try {
      const params = {
        reporter: reporterCode,
        partner: partnerCode,
        product: filters.product || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        risk: filters.riskLevel?.toUpperCase(),
        page: reset ? 1 : page,
        limit: 10,
      };

      const res = await DashboardAllProductList(params);

      if (requestId !== requestRef.current) return;

      const newData = res?.data?.data ?? [];

      setProducts((prev) => {
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

  useEffect(() => {
    if (!overviewData && !highlightData) return;

    setProductData({
      productOverview: overviewData?.data || {},
      productHighlights: highlightData?.data || {},
    });
  }, [overviewData, highlightData]);
  const lastProductRef = useCallback(
    (node) => {
      if (isTableLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isTableLoading, hasMore],
  );

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
            {/* £{item.avgExportPrice} */}£
            {Number(item.avgExportPrice).toFixed(2)}
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
     EFFECTS
  ================================ */
  useEffect(() => {
    if (!partnerCode) return;

    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchProducts(true);
  }, [filters, startDate, endDate]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts();
  }, [page]);
  /* ===============================
     INFINITE SCROLL
  ================================ */

  /* ===============================
     FILTER HANDLER
  ================================ */

  const handleFilterChange = (values) => {
    setFilters((prev) => {
      const isSame =
        prev.partnerCode === values.partnerCode &&
        prev.product === values.product &&
        prev.timeRange === values.timeRange &&
        prev.riskLevel === values.riskLevel;

      if (isSame) return prev;

      setProducts([]);
      setPage(1);
      setHasMore(true);

      return values;
    });
  };

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
                <span className="tp-country">Active Corridor : </span>
                {/* <span className="tp-arrow">→</span> */}
                <span className="tp-country">({corridor || "Selected Corridor"})</span>
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

        <PageDisclaimer />

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
                <p className="tp-muted">
                  Most Imported Product ({corridor || "Selected Corridor"})
                </p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.totalProducts || "-"}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">
                  Fastest Growing Demand ({corridor || "Selected Corridor"})
                </p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.activeProducts || "-"}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Price Volatility</p>
                <h3 className="tp-text-up tp-overview-text">
                  {
                    productData?.productOverview?.topValueProduct?.split(
                      ",",
                    )?.[0]
                  }
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Risk Product</p>
                <h3 className="tp-text-down tp-overview-text">
                  {
                    productData?.productOverview?.lowestValueProduct?.split(
                      ",",
                    )?.[0]
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

            {/* <div className="tp-table-search">
              <UniversalFilter
                showCorridor
                showProduct
                showTimeRange
                showRiskLevel
                productOptions={allProducts}
                defaultValues={filters}
                onChange={handleFilterChange}
              />
            </div> */}
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
            <p className="tp-muted">
              Most Imported Product ({corridor || "Selected Corridor"})
            </p>
            <h3 className="tp-overview-text">
              {productData?.productHighlights?.mostTradedProduct || "N/A"}
            </h3>
          </div>

          <div className="tp-card">
            <p className="tp-muted">
              Highest Price Volatility ({corridor || "Selected Corridor"})
            </p>
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
