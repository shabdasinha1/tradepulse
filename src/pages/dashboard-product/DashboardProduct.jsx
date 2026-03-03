import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  DashboardProductInsights,
  DashboardProductList,
  DashboardProductOverview,
} from "../../services/DashboardService";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import VerticalScroll from "../../components/common/VerticalScroll";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { FiSliders } from "react-icons/fi";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel";
import PageDisclaimer from "../../components/common/PageDisclaimer";

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
  const [filterOpen, setFilterOpen] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [productData, setProductData] = useState({
    productOverview: [],
    productList: [],
    productInsight: [],
  });

  /* ===============================
     INITIAL PAGE LOAD (Corridor Scoped)
  ================================= */
  useEffect(() => {
    if (!corridorId) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          DashboardProductOverview({ corridor_id: corridorId }),
          DashboardProductList({ corridor_id: corridorId }),
          DashboardProductInsights({ corridor_id: corridorId }),
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
  }, [corridorId]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "" && hasSearched && !isTableLoading) {
      setIsTableLoading(true);
      setError("");

      try {
        const listRes = await DashboardProductList({
          corridor_id: corridorId,
        });

        setProductData((prev) => ({
          ...prev,
          productList: listRes?.data || [],
        }));

        setHasSearched(false);
      } catch (err) {
        setError(GetApiErrorMessage(err));
      } finally {
        setIsTableLoading(false);
      }
    }
  };

  /* ===============================
     TABLE SEARCH (Corridor Scoped)
  ================================= */
  const handleSearch = async () => {
    if (isTableLoading) return;

    const trimmed = searchValue.trim();

    setIsTableLoading(true);
    setError("");

    try {
      let params = {
        corridor_id: corridorId,
      };

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

      setHasSearched(true);
    } catch (err) {
      setError(GetApiErrorMessage(err));
    } finally {
      setIsTableLoading(false);
    }
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
<PageDisclaimer/>
        {isLoading && <ProductOverviewSkeleton />}

        {!isLoading && (
          <>
            <div className="tp-grid tp-product-overview-grid">
              <div className="tp-card">
                <p className="tp-muted">
                  Most Imported Product (Selected Corridor)
                </p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.totalProducts}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">
                  Fastest Growing Demand (Selected Corridor)
                </p>
                <h3 className="tp-overview-text">
                  {productData?.productOverview?.activeProducts}
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Price Volatility</p>
                <h3 className="tp-text-up">
                  {
                    productData?.productOverview?.topValueProduct?.split(
                      ","
                    )?.[0]
                  }
                </h3>
              </div>

              <div className="tp-card">
                <p className="tp-muted">Highest Risk Product</p>
                <h3 className="tp-text-down">
                  {
                    productData?.productOverview?.lowestValueProduct?.split(
                      ","
                    )?.[0]
                  }
                </h3>
              </div>
            </div>

            <div className="tp-card">
              <div className="tp-table-header">
                <h3 className="tp-table-title">Product List</h3>

                <div className="tp-table-search">
                  <input
                    type="text"
                    className="tp-input"
                    placeholder="Search by HS Code or Product"
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />

                  <button
                    className="tp-btn tp-btn-primary"
                    onClick={handleSearch}
                    disabled={!searchValue.trim() || isTableLoading}
                  >
                    {isTableLoading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>

              <div className="product-table-wrapper">
                <div className="product-table">
                  <div className="product-row product-head">
                    <span>Product</span>
                    <span className="text-center">
                      Avg Export Price (Origin → UK)
                    </span>
                    <span className="text-center">
                      UK Import Demand Trend
                    </span>
                    <span className="text-center">
                      Export Activity Level
                    </span>
                    <span className="text-center">Volatility Risk</span>
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
          </>
        )}
       
      </div>
       {filterOpen && (
  <GlobalFilterPanel onClose={() => setFilterOpen(false)} />
)}
    </section>
  );
};

export default DashboardProduct;