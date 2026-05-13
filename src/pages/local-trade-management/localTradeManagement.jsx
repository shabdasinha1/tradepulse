


import React, { useState, useEffect } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import { FiX } from "react-icons/fi";
import {
  CreateTradeObservation,
  GetTradeObservations,
} from "../../services/DashboardService";

const LocalTradeManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    product_name: "",
    hs_code: "",
    market_location: "",
    origin_country_iso3: "",
    destination_country_iso3: "",
    price_quoted: "",
    availability: "",
    demand_level: "",
    supply_condition: "",
    market_sentiment: "",
    confidence_score: "",
    interaction_type: "",
    volume_estimate: "",
    reason: "",
  });

  /* ===============================
     FETCH DATA
  ================================ */
 const fetchObservations = async () => {
  try {
    setLoading(true);
    const res = await GetTradeObservations();

    const apiData = res?.data|| [];
    

    const mapDemand = (val) => {
      if (val >= 0.7) return "High";
      if (val >= 0.4) return "Medium";
      return "Low";
    };

    const mapSupply = (val) => {
      if (val < 0.4) return "Scarce";
      if (val < 0.7) return "Balanced";
      return "Surplus";
    };

    const mapSentiment = (val) => {
      if (val >= 0.7) return "Strong";
      if (val >= 0.4) return "Neutral";
      return "Weak";
    };

    const transformed = apiData.map((item) => {
      const [origin, destination] = item.corridor?.split("-") || ["", ""];

      return {
        product_name: item.product,
        hs_code: item.hsCode,
        origin_country_iso3: origin,
        destination_country_iso3: destination,
        price_quoted: item.price,
        demand_level: mapDemand(item.demand),
        supply_condition: mapSupply(item.supply),
        market_sentiment: mapSentiment(item.sentiment),
        confidence_score: item.observations,
      };
    });

    setObservations(transformed);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchObservations();
  }, []);

  /* ===============================
     FORM
  ================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await CreateTradeObservation({
        ...formData,
        price_quoted: Number(formData.price_quoted),
        confidence_score: Number(formData.confidence_score),
        volume_estimate: Number(formData.volume_estimate),
      });

      setOpenModal(false);
      fetchObservations(); // 🔥 refresh table
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     HELPERS
  ================================ */
  const getDemandClass = (val) => {
    if (val === "High") return "tp-pill-success";
    if (val === "Medium") return "tp-pill-warning";
    return "tp-pill-danger";
  };

  const getSupplyClass = (val) => {
    if (val === "Scarce") return "tp-pill-danger";
    if (val === "Balanced") return "tp-pill-warning";
    return "tp-pill-success";
  };

  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* HEADER */}
        <header>
          <div className="tp-overview-sub-row">
            <div>
              <h1 className="tp-section-title">
                Local Trade <span>Management</span>
              </h1>

              <p className="tp-section-sub">
                Capture real-time market observations and trade signals.
              </p>
            </div>

            <button
              className="tp-btn-primary"
              onClick={() => setOpenModal(true)}
            >
              Add Local Trade Data
            </button>
          </div>
        </header>

        {/* ===============================
            TABLE
        ================================ */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Trade Observations</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper">
            <div className="tp-table">
              <div className="tp-table-head tp-table-trade">
                <span>Product</span>
                <span>HS Code</span>
                <span>Route</span>
                <span>Price</span>
                <span>Demand</span>
                <span>Supply</span>
                <span>Sentiment</span>
                <span>Confidence</span>
              </div>

              {loading ? (
                <div className="tp-empty-state">
                  <p className="tp-empty-text">Loading...</p>
                </div>
              ) : observations.length === 0 ? (
                <div className="tp-empty-state">
                  <p className="tp-empty-text">No trade observations found</p>
                </div>
              ) : (
                observations.map((item, i) => (
                  <div key={i} className="tp-table-row tp-table-trade">
                    <span className="tp-text-strong">
                      {item.product_name}
                    </span>

                    <span className="tp-font-data">{item.hs_code}</span>

                    <span>
                      {item.origin_country_iso3} →{" "}
                      {item.destination_country_iso3}
                    </span>

                    <span className="tp-font-data">{item.price_quoted}</span>

                    <span>
                      <span
                        className={`tp-pill ${getDemandClass(
                          item.demand_level,
                        )}`}
                      >
                        {item.demand_level}
                      </span>
                    </span>

                    <span>
                      <span
                        className={`tp-pill ${getSupplyClass(
                          item.supply_condition,
                        )}`}
                      >
                        {item.supply_condition}
                      </span>
                    </span>

                    <span>
                      <span className="tp-pill tp-pill-primary">
                        {item.market_sentiment}
                      </span>
                    </span>

                    <span className="tp-font-data">{item.confidence_score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TradePulseCard>

        {/* ===============================
            MODAL (unchanged)
        ================================ */}
        {openModal && (
          <div className="tp-modal-overlay" onClick={() => setOpenModal(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tp-supplier-modal-header">
                <h3 className="tp-section-title">Add Trade Observation</h3>

                <button
                  className="tp-filter-close"
                  onClick={() => setOpenModal(false)}
                >
                  <FiX />
                </button>
              </div>

                 {/* FORM */}
             <form className="tp-form-grid" onSubmit={handleSubmit}>
  {/* Product Name */}
  <div className="tp-form-group">
    <label>Product Name</label>
    <input
      name="product_name"
      className="tp-input"
      placeholder="e.g. Steel Rod, Wheat, Crude Oil"
      value={formData.product_name}
      onChange={handleChange}
    />
  </div>

  {/* HS Code */}
  <div className="tp-form-group">
    <label>HS Code</label>
    <input
      name="hs_code"
      className="tp-input tp-font-data"
      placeholder="e.g. 7214"
      value={formData.hs_code}
      onChange={handleChange}
    />
  </div>

  {/* Market Location */}
  <div className="tp-form-group">
    <label>Market Location</label>
    <input
      name="market_location"
      className="tp-input"
      placeholder="e.g. Dubai Market, Mumbai Port"
      value={formData.market_location}
      onChange={handleChange}
    />
  </div>

  {/* Origin Country */}
  <div className="tp-form-group">
    <label>Origin Country</label>
    <input
      name="origin_country_iso3"
      className="tp-input tp-font-data"
      placeholder="ISO3 (e.g. IND, USA)"
      value={formData.origin_country_iso3}
      onChange={handleChange}
    />
  </div>

  {/* Destination Country */}
  <div className="tp-form-group">
    <label>Destination Country</label>
    <input
      name="destination_country_iso3"
      className="tp-input tp-font-data"
      placeholder="ISO3 (e.g. ARE, UK)"
      value={formData.destination_country_iso3}
      onChange={handleChange}
    />
  </div>

  {/* Price */}
  <div className="tp-form-group">
    <label>Price Quoted</label>
    <input
      name="price_quoted"
      type="number"
      className="tp-input tp-font-data"
      placeholder="e.g. 520 (USD/ton)"
      value={formData.price_quoted}
      onChange={handleChange}
    />
  </div>

  {/* Availability */}
  <div className="tp-form-group">
    <label>Availability</label>
    <select
      name="availability"
      className="tp-input tp-select"
      value={formData.availability}
      onChange={handleChange}
    >
      <option value="">Select availability</option>
      <option>In Stock</option>
      <option>Out of Stock</option>
    </select>
  </div>

  {/* Demand */}
  <div className="tp-form-group">
    <label>Demand Level</label>
    <select
      name="demand_level"
      className="tp-input tp-select"
      value={formData.demand_level}
      onChange={handleChange}
    >
      <option value="">Select demand level</option>
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
  </div>

  {/* Supply */}
  <div className="tp-form-group">
    <label>Supply Condition</label>
    <select
      name="supply_condition"
      className="tp-input tp-select"
      value={formData.supply_condition}
      onChange={handleChange}
    >
      <option value="">Select supply condition</option>
      <option>Scarce</option>
      <option>Balanced</option>
      <option>Surplus</option>
    </select>
  </div>

  {/* Sentiment */}
  <div className="tp-form-group">
    <label>Market Sentiment</label>
    <select
      name="market_sentiment"
      className="tp-input tp-select"
      value={formData.market_sentiment}
      onChange={handleChange}
    >
      <option value="">Select market sentiment</option>
      <option>Strong</option>
      <option>Neutral</option>
      <option>Weak</option>
    </select>
  </div>

  {/* Confidence */}
  <div className="tp-form-group">
    <label>Confidence Score</label>
    <input
      name="confidence_score"
      type="number"
      step="0.01"
      className="tp-input tp-font-data"
      placeholder="0 to 1 (e.g. 0.85)"
      value={formData.confidence_score}
      onChange={handleChange}
    />
  </div>

  {/* Interaction */}
  <div className="tp-form-group">
    <label>Interaction Type</label>
    <input
      name="interaction_type"
      className="tp-input"
      placeholder="e.g. Buyer, Seller, Trader"
      value={formData.interaction_type}
      onChange={handleChange}
    />
  </div>

  {/* Volume */}
  <div className="tp-form-group">
    <label>Volume Estimate</label>
    <input
      name="volume_estimate"
      type="number"
      className="tp-input tp-font-data"
      placeholder="e.g. 100 (tons)"
      value={formData.volume_estimate}
      onChange={handleChange}
    />
  </div>

  {/* Reason */}
  <div className="tp-form-group tp-form-span-2">
    <label>Reason</label>
    <textarea
      name="reason"
      className="tp-input"
      placeholder="Explain market situation (e.g. Port delays causing shortage)"
      value={formData.reason}
      onChange={handleChange}
    />
  </div>

  {/* Submit */}
  <div className="tp-form-group tp-form-span-2 tp-actions">
    <button type="submit" className="tp-btn-primary">
      Submit Observation
    </button>
  </div>
</form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocalTradeManagement;