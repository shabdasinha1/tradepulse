import TradePulseCard from "../../components/common/TradePulseCard.jsx";


const dataSources = [
  { name: "UK Trade Statistics", status: "active" },
  { name: "Nigeria Customs Service", status: "active" },
  { name: "Bloomberg Market Data", status: "active" },
  { name: "African Trade Database", status: "active" },
  { name: "Port Authority APIs", status: "pending" },
];

const Settings = () => {
  return (

      <section className="">
        <div className="tp-dashboard-container tp-grid-stack">

          {/* ===============================
              PAGE HEADER
          =============================== */}
          <header>
            <h1 className="tp-section-title">
              Account <span>Settings</span>
            </h1>
            <p className="tp-section-sub">
              Manage your profile, data sources, and preferences
            </p>
          </header>

          {/* ===============================
              USER PROFILE
          =============================== */}
          <TradePulseCard
            header={
              <div className="tp-card-header">
                <h3 className="tp-card-title">User Profile</h3>
              </div>
            }
          >
            <div className="tp-form settings-form">

              <div className="tp-form-group">
                <label>Name</label>
                <input className="tp-input" value="KENE" readOnly />
              </div>

              <div className="tp-form-group">
                <label>Email</label>
                <input
                  className="tp-input"
                  value="kene@tradepulse.ai"
                  readOnly
                />
              </div>

              <div className="tp-form-group">
                <label>Company</label>
                <input className="tp-input" value="Vendex" readOnly />
              </div>

              <div className="settings-actions">
                <button className="tp-btn-primary">
                  Save Changes
                </button>
              </div>

            </div>
          </TradePulseCard>

          {/* ===============================
              DATA SOURCES
          =============================== */}
          <TradePulseCard
            header={
              <div className="tp-card-header">
                <h3 className="tp-card-title">Data Sources</h3>
              </div>
            }
          >
            <div className="settings-list">
              {dataSources.map((item, i) => (
                <div key={i} className="settings-row">

                  <span>{item.name}</span>

                  <span
                    className={`tp-pill ${
                      item.status === "active"
                        ? "tp-pill-success"
                        : "tp-pill-warning"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>
              ))}
            </div>
          </TradePulseCard>

          {/* ===============================
              PREFERENCES
          =============================== */}
          <TradePulseCard
            header={
              <div className="tp-card-header">
                <h3 className="tp-card-title">Preferences</h3>
              </div>
            }
          >
            <div className="settings-list">

              <div className="settings-row settings-pref">
                <div>
                  <strong>Email Notifications</strong>
                  <div className="tp-muted">
                    Receive updates about your watchlist
                  </div>
                </div>

                <label className="tp-switch">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div className="settings-row settings-pref">
                <div>
                  <strong>Price Alerts</strong>
                  <div className="tp-muted">
                    Get notified of significant price changes
                  </div>
                </div>

                <label className="tp-switch">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

            </div>
          </TradePulseCard>

        </div>
      </section>
  
  );
};

export default Settings;
