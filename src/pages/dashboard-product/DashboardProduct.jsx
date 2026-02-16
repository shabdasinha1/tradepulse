import { useEffect, useMemo, useState } from "react";
import {
  DashboardProductInsights,
  DashboardProductList,
  DashboardProductOverview,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import VerticalScroll from "../../components/common/VerticalScroll";

/* ===============================
    SKELETON COMPONENTS
================================ */
const Skeleton = ({ className = "" }) => (
  <div className={`tp-skeleton skeleton ${className}`} />
);

const ProductOverviewSkeleton = () => {
  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack tp-skeleton-opacity ">
        {/* KPI Cards */}
        <div className="tp-grid tp-product-overview-grid">
          {[...Array(4)].map((_, i) => (
            <div className="tp-card" key={i}>
              <Skeleton className="sk-text-sm" />
              <Skeleton className="sk-text-lg" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="tp-card tp-skeleton">
          {[...Array(6)].map((_, i) => (
            <div className="product-row" key={i}>
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="sk-table-cell" />
              ))}
            </div>
          ))}
        </div>

        {/* Insights */}
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
  const [isLoading, setIsLoading] = useState(true);

  const [productData, setProductData] = useState({
    productOverview: [],
    productList: [],
    productInsight: [],
  });

  // ===============================
  // Fetch data
  // ===============================
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
          productList: listRes.status === "fulfilled" ? listRes.value.data : [],
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
  // console.log(productData);
  // ===============================
  // RENDER
  // ===============================
  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack">
        {/* ===============================
              HEADER (ALWAYS VISIBLE)
          =============================== */}
        <header>
          <h1 className="tp-section-title">
            Products <span>Overview</span>
          </h1>
          <p className="tp-section-sub">
            Tradable instruments and current market snapshot
          </p>
        </header>

        {/* ===============================
              SKELETON
          =============================== */}
        {isLoading && <ProductOverviewSkeleton />}

        {/* ===============================
              MAIN CONTENT
          =============================== */}
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
                  {
                    productData?.productOverview?.topValueProduct?.split(
                      ",",
                    )?.[0]
                  }
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Top Loser</p>
                <h3 className="tp-text-down">
                  {
                    productData?.productOverview?.lowestValueProduct?.split(
                      ",",
                    )?.[0]
                  }
                </h3>
              </div>
            </div>

            {/* PRODUCT TABLE */}
            {/* <div className="tp-card">
              <div className="product-table-wrapper">
                <div className="product-table">
                  <div className="product-row product-head">
                    <span>Product</span>
                    <span className="text-center">Category</span>
                    <span className="text-center">Price</span>
                    <span className="text-center">Change</span>
                    <span className="text-center">Status</span>
                  </div>
                  <VerticalScroll>
                    {productData?.productList?.data?.map((item, index) => (
                      <div className="product-row" key={index}>
                        <span>{item.product_name.split(/[,\s]/)[0]}</span>
                        <span className="tp-muted text-center">
                          {item.category}
                        </span>
                        <span className="text-center">
                          {item.unit_price ?? "0"}
                        </span>
                        <span
                          className={
                            item.trend === "up"
                              ? "tp-text-up text-center"
                              : "tp-text-down text-center"
                          }
                        >
                          {item.change ?? "0"}
                        </span>
                        <span className="text-center">
                          <span
                            className={`tp-pill ${
                              item.status === "Active"
                                ? "tp-pill-success"
                                : "tp-pill-warning"
                            }`}
                          >
                            {item.status}
                          </span>
                        </span>
                      </div>
                    ))}
                  </VerticalScroll>
                </div>
              </div>
            </div> */}
            <div className="tp-card">
              <div className="product-table-wrapper">
                <div className="product-table">
                  <div className="product-row product-head">
                    <span>Product</span>
                    <span className="text-center">Price Range</span>
                    <span className="text-center">Demand Trend</span>
                    <span className="text-center">Supply</span>
                    <span className="text-center">Risk</span>
                    {/* <span className="text-center">Margin</span> */}
                  </div>
                  <VerticalScroll>
                    {productData?.productList?.map((item, index) => (
                      <div className="product-row" key={index}>
                        {/* <span>{item.product_name.split(/[,\s]/)[0]}</span> */}
                        <span>{item.product_name.split(",")[0]}</span>
                        <span className="tp-muted text-center">
                          {"0"}
                        </span>
                        <span className="text-center">
                          {item.demand.level}
                        </span>
                        <span
                          className={
                            item.supply.availability === "Moderate"
                              ? "tp-text-up text-center"
                              : "tp-text-down text-center"
                          }
                        >
                          {item.supply.availability}
                        </span>
                        <span className="text-center">
                          <span
                            className={`tp-pill ${
                              item.risk.level === "Low"
                                ? "tp-pill-success"
                                : "tp-pill-warning"
                            }`}
                          >
                            {item.risk.score}
                          </span>
                        </span>
                      </div>
                    ))}
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
                  {
                    productData?.productInsight?.most_traded?.split(
                      ",",
                    )?.[0]
                  }
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Volatility</p>
                <h3 className="tp-overview-text">
                  {
                    productData?.productInsight?.largest_product?.split(
                      ",",
                    )?.[0]
                  }
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
