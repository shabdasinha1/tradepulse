import { useEffect, useState } from "react";
import {
  DashboardProductInsights,
  DashboardProductList,
  DashboardProductOverview,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import VerticalScroll from "../../components/common/VerticalScroll";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";

/* ===============================
   SKELETON COMPONENTS
================================ */
const Skeleton = ({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
);

const ProductOverviewSkeleton = () => {
  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack tp-skeleton-opacity">
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // page load
  const [isTableLoading, setIsTableLoading] = useState(false); // table only
  const [searchValue, setSearchValue] = useState("");

  const [productData, setProductData] = useState({
    productOverview: [],
    productList: [],
    productInsight: [],
  });

  /* ===============================
     INITIAL PAGE LOAD
  ================================= */
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          DashboardProductOverview(),
          DashboardProductList(),
          DashboardProductInsights(),
        ]);

        const [overviewRes, listRes, insightRes] = results;

        setProductData({
          productOverview:
            overviewRes.status === "fulfilled" ? overviewRes.value.data : [],
          productList:
            listRes.status === "fulfilled" ? listRes.value.data : [],
          productInsight:
            insightRes.status === "fulfilled" ? insightRes.value.data : [],
        });
      } catch (err) {
        setError(GetApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /* ===============================
     TABLE SEARCH
  ================================= */
  const handleSearch = async () => {
    setIsTableLoading(true);
    setError("");

    try {
      let params = {};
      const trimmed = searchValue.trim();

      if (trimmed) {
        if (/^\d+$/.test(trimmed)) {
          params.hs = trimmed;
        } else {
          params.q = trimmed;
        }
      }

      const listRes = await DashboardProductList(params);

      setProductData((prev) => ({
        ...prev,
        productList: listRes?.data || [],
      }));
    } catch (err) {
      setError(GetApiErrorMessage(err));
    } finally {
      setIsTableLoading(false);
    }
  };

  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <h1 className="tp-section-title">
            Products <span>Overview</span>
          </h1>
          <p className="tp-section-sub">
            Tradable instruments and current market snapshot
          </p>
        </header>

        {/* FULL PAGE SKELETON */}
        {isLoading && <ProductOverviewSkeleton />}

        {!isLoading && (
          <>
            {/* KPI CARDS */}
            <div className="tp-grid tp-product-overview-grid">
              <div className="tp-card">
                <p className="tp-muted">Total Products</p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.totalProducts}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Active Products</p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.activeProducts}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Top Gainer</p>
                <h3 className="tp-text-up">
                  {productData?.productOverview?.topValueProduct?.split(",")?.[0]}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Top Loser</p>
                <h3 className="tp-text-down">
                  {productData?.productOverview?.lowestValueProduct?.split(",")?.[0]}
                </h3>
              </div>
            </div>

            {/* PRODUCT TABLE */}
            <div className="tp-card">
              <div className="tp-table-header">
                <h3 className="tp-table-title">Product List</h3>

                <div className="tp-table-search">
                  <input
                    type="text"
                    className="tp-input"
                  placeholder="Search by HS Code or Product"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />

                  <button
                    className="tp-btn tp-btn-primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="product-table-wrapper">
                <div className="product-table">
                  <div className="product-row product-head">
                    <span>Product</span>
                    <span className="text-center">Price Range</span>
                    <span className="text-center">Demand Trend</span>
                    <span className="text-center">Supply</span>
                    <span className="text-center">Risk</span>
                  </div>

                 <VerticalScroll>
  {isTableLoading ? (
    [...Array(6)].map((_, i) => (
      <div className="product-row" key={i}>
        {[...Array(5)].map((_, j) => (
          <Skeleton key={j} className="sk-table-cell" />
        ))}
      </div>
    ))
  ) : productData?.productList?.data?.length === 0 ? (
    <div className="product-row tp-empty-row">
      <span className="tp-muted tp-empty-text">
        Product not found
      </span>
    </div>
  ) : (
    productData?.productList?.data?.map((item, index) => (
      <div className="product-row" key={index}>
        <span>{item.product?.split(",")[0]}</span>

        <span className="tp-muted text-center">
          {item.priceRange}
        </span>

        <span className="text-center">
          {item.demandTrend?.direction === "UP" ? (
            <IoIosTrendingUp className="tp-trend-logo tp-text-up" />
          ) : (
            <IoIosTrendingDown className="tp-trend-logo tp-text-down" />
          )}
          {item.demandTrend?.percent}%
        </span>

        <span className="text-center">
          <span
            className={`tp-pill ${
              item.supply === "Stable"
                ? "tp-pill-success"
                : "tp-pill-warning"
            }`}
          >
            {item.supply}
          </span>
        </span>

        <span className="text-center">
          <span
            className={`tp-pill ${
              item.risk === "Low"
                ? "tp-pill-success"
                : "tp-pill-warning"
            }`}
          >
            {item.risk}
          </span>
        </span>
      </div>
    ))
  )}
</VerticalScroll>

                </div>
              </div>
            </div>

            {/* INSIGHTS */}
            <div
              className="tp-grid tp-insight-grid"
              style={{ marginTop: "1rem" }}
            >
              <div className="tp-card">
                <p className="tp-muted">Most Traded Product</p>
                <h3 className="tp-overview-text">
                  {productData?.productInsight?.most_traded?.split(",")?.[0]}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Volatility</p>
                <h3 className="tp-overview-text">
                  {productData?.productInsight?.largest_product?.split(",")?.[0]}
                </h3>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DashboardProduct;
