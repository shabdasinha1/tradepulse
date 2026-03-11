import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  DashboardProductInsights,
  DashboardProductOverview,
  DashboardAllProductList,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import VerticalScroll from "../../components/common/VerticalScroll";
import { FiSliders } from "react-icons/fi";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel";
import PageDisclaimer from "../../components/common/PageDisclaimer";
import UniversalFilter from "../../components/common/UniversalFilter";

/* ===============================
   SKELETON COMPONENTS
================================ */

const Skeleton = ({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
);

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
  const corridorId = useSelector((state) => state.corridor.corridorId);

  const observer = useRef(null);

  const [filterOpen, setFilterOpen] = useState(false);

  const [error, setError] = useState(null);

  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [filters, setFilters] = useState({
    corridor: corridorId || "",
    product: "",
    timeRange: "90d",
    riskLevel: "",
  });

  const [productData, setProductData] = useState({
    productOverview: {},
    productInsight: {},
  });

  const [allProducts, setAllProducts] = useState([]);

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
     FETCH PRODUCT OPTIONS
  ================================ */

  const fetchAllProducts = async () => {
    try {
      const res = await DashboardAllProductList();

      if (res?.success) {
        setAllProducts(res?.data?.data || []);
      }
    } catch (err) {
      console.error("Product options error:", err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  /* ===============================
     FETCH OVERVIEW + INSIGHTS
  ================================ */

  const fetchOverviewAndInsights = async () => {
    if (!filters.corridor) return;

    setIsOverviewLoading(true);
    setError(null);

    try {
      const params = {
        time_range: filters.timeRange,
        risk_level: filters.riskLevel,
      };

      const results = await Promise.allSettled([
        DashboardProductOverview(params),
        DashboardProductInsights(params),
      ]);
      console.log("result : ", results);
      const [overviewRes, insightRes] = results;

      if (overviewRes.status === "fulfilled") {
        setProductData((prev) => ({
          ...prev,
          productOverview: overviewRes.value?.data || {},
        }));
      }

      if (insightRes.status === "fulfilled") {
        setProductData((prev) => ({
          ...prev,
          productInsight: insightRes.value?.data || {},
        }));
      }
    } catch (err) {
      console.error("Overview API error:", err);
      setError(GetApiErrorMessage(err));
    } finally {
      setIsOverviewLoading(false);
    }
  };

  /* ===============================
     FETCH TABLE DATA
  ================================ */

  const fetchProducts = async () => {
    if (isTableLoading) return;
    if (!hasMore && page !== 1) return;

    setIsTableLoading(true);

    try {
      const params = {
        page,
        limit: 10,
      };

      const res = await DashboardAllProductList(params);

      const newData = res?.data?.data || [];

      setProducts((prev) => {
        const merged = page === 1 ? newData : [...prev, ...newData];

        const unique = Array.from(
          new Map(merged.map((item) => [item.product, item])).values(),
        );

        return unique;
      });

      if (newData.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Products API error:", err);
      setError(GetApiErrorMessage(err));
    } finally {
      setIsTableLoading(false);
    }
  };

  /* ===============================
     EFFECTS
  ================================ */

  useEffect(() => {
    fetchOverviewAndInsights();
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  /* ===============================
     INFINITE SCROLL
  ================================ */

  const lastProductRef = useCallback(
    (node) => {
      if (isTableLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isTableLoading],
  );

  /* ===============================
     FILTER HANDLER
  ================================ */

  const handleFilterChange = (values) => {
    setFilters((prev) => {
      const isSame =
        prev.corridor === values.corridor &&
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

            <button
              className="tp-btn-outline tp-overview-filter-btn"
              onClick={() => setFilterOpen(true)}
            >
              <FiSliders />
              Filters
            </button>
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
          {isOverviewLoading ? (
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
                  Most Imported Product (Selected Corridor)
                </p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.totalProducts || "-"}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">
                  Fastest Growing Demand (Selected Corridor)
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

            <div className="tp-table-search">
              <UniversalFilter
                showCorridor
                showProduct
                showTimeRange
                showRiskLevel
                productOptions={allProducts}
                defaultValues={{
                  corridor: corridorId || "",
                  product: "",
                  timeRange: "90d",
                  riskLevel: "",
                }}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="product-table-wrapper">
            <div className="product-table">
              <div className="product-row product-head">
                <span>Product</span>
                <span className="text-center">
                  Avg Export Price (Origin → UK)
                </span>
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

                {products.map((item, index) => {
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
                })}

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
              Most Imported Product (Selected Corridor)
            </p>
            <h3 className="tp-overview-text">
              {productData?.productInsight?.most_traded?.split(",")?.[0]}
            </h3>
          </div>

          <div className="tp-card">
            <p className="tp-muted">
              Highest Price Volatility (Selected Corridor)
            </p>
            <h3 className="tp-overview-text">
              {productData?.productInsight?.largest_product?.split(",")?.[0]}
            </h3>
          </div>
        </div>
      </div>

      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}
    </section>
  );
};

export default DashboardProduct;
