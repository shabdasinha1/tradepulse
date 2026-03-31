import { useEffect, useRef, useState } from "react";
import {
  GetUserByEmail,
  UpdateUser,
  UserDataSources,
} from "../../services/DashboardService";
import { GetCookie } from "../../utils/CookieManager.jsx";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { useToast } from "../../components/common/toast/ToastProvider.jsx";

// const dataSources = [
//   { name: "UK Trade Statistics", status: "active" },
//   { name: "Nigeria Customs Service", status: "active" },
//   { name: "Bloomberg Market Data", status: "active" },
//   { name: "African Trade Database", status: "active" },
//   { name: "Port Authority APIs", status: "pending" },
// ];

const Settings = () => {
  const [dataSources, setDataSources] = useState();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    country: "",
    company_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const handleHeaderScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const fetchDataSource = async () => {
    setLoading(true);
    try {
      const res = await UserDataSources();
      if (res.success === true) {
        setDataSources(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const email = GetCookie("tp_user_email");

      if (!email) return;

      const res = await GetUserByEmail(email);

      if (res?.success) {
        const data = res.data;

        setUser(data);

        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          mobile: data.mobile || "",
          country: data.country || "",
          company_name: data.company_name || "",
          email: data.email || "",
        });
      }
    } catch (err) {
      console.error("User fetch error", err);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchDataSource();
  }, []);
  const isChanged =
    user &&
    (form.first_name !== (user.first_name || "") ||
      form.last_name !== (user.last_name || "") ||
      form.mobile !== (user.mobile || "") ||
      form.country !== (user.country || "") ||
      form.company_name !== (user.company_name || ""));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!user?.id) return;

      await UpdateUser(user.id, {
        first_name: form.first_name,
        last_name: form.last_name,
        mobile: form.mobile,
        country: form.country,
        company_name: form.company_name,
      });

      addToast("Profile updated successfully", "success");
    } catch (err) {
      addToast("Update failed", "error");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
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
              <input
                className="tp-input"
                value={`${form.first_name} ${form.last_name}`}
                readOnly
              />
            </div>

            <div className="tp-form-group">
              <label>Email</label>
              <input className="tp-input" value={form.email} readOnly />
            </div>

            <div className="tp-form-group">
              <label>Company</label>
              <input
                className="tp-input"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
              />
            </div>
            <div className="tp-form-group">
              <label>Mobile</label>
              <input
                className="tp-input"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="tp-form-group">
              <label>Country</label>
              <input
                className="tp-input"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="settings-actions">
            <button
              className="tp-btn tp-btn-primary"
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save Changes
            </button>
          </div>
        </TradePulseCard>

        {/* ===============================
      DATA SOURCES
================================ */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Data Sources</h3>
            </div>
          }
          className="tp-data-sources-card"
        >
          <div className="settings-list">
            <div className="tp-table-wrapper tp-supplier-table">
              <div className="tp-table-wrapper-feedback">
                <div
                  className="tp-table-head-scroll"
                  ref={headerRef}
                  onScroll={handleHeaderScroll}
                >
                  <div className="tp-table-head tp-table-data-source-admin">
                    <span>Source</span>
                    <span className="text-center">Last Updated</span>
                    <span className="text-center">Status</span>
                  </div>
                </div>

                <div
                  className="tp-table-body-scroll tp-data-source-table-body"
                  ref={bodyRef}
                  onScroll={handleBodyScroll}
                >
                  <div className="tp-table">
                    {loading && <EmptyState message="Loading Data Source" />}
                    {!dataSources && !loading && (
                      <EmptyState message="No Data Source Found" />
                    )}
                    {dataSources?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="tp-table-row tp-data-source-table-grid"
                        >
                          <span>{item.name.toUpperCase()}</span>

                          <span className="text-center">
                            {formatDate(item.last_updated)}
                          </span>

                          <span
                            className={`tp-data-source-pill tp-pill ${
                              item.status === "Live"
                                ? "tp-pill-success"
                                : "tp-pill-warning"
                            }`}
                          >
                            {item.status?.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {loading && (
                    <div className="tp-loading-more">Loading more...</div>
                  )}
                </div>
              </div>
            </div>
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
