import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const heroRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const featuresRef = useRef(null);
  const audienceRef = useRef(null);
  const diffRef = useRef(null);
  const visionRef = useRef(null);
  const productRef = useRef(null);
  const supplierRef = useRef(null);
  const aiRef = useRef(null);
  const priceRef = useRef(null);
  const faqRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  const toggleItem = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "What corridors does Tradepulse currently cover?",
      a: `Our Phase 1 focus is UK-Africa trade corridors, with active data across UK↔Nigeria, UK↔Ghana, UK↔Kenya, UK↔South Africa, UK↔Ethiopia, and UK↔Ivory Coast. Enterprise customers can request custom corridors. Intra-Africa and EU-Africa corridors are on the roadmap for Phase 2.`,
    },
    {
      q: "Where does the price and trade data come from?",
      a: `Our data pipeline aggregates from UN Comtrade (trade flows, going back to 2000), UK Trade Info (HMRC), WTO Tariff API (duty rates), World Bank Indicators (macro data), Freightos Index (shipping rates), and Central Bank FX feeds. All sources are attributed on every data point displayed.`,
    },
    {
      q: "Does TradePulse facilitate transactions or connect me to suppliers directly?",
      a: `No. TradePulse is an intelligence platform, not a marketplace. We provide structured reliability signals and verification data to support your sourcing decisions, but we do not process transactions, introductions, or negotiations. This is a deliberate design decision to keep our intelligence objective and unbiased.`,
    },
    {
      q: "How current is the data at TradePulse?",
      a: `Price and trade flow data refreshes on a scheduled basis (typically weekly for commodity prices, monthly for full Comtrade sync). FX rates are near-real-time from Central Bank feeds. News synthesis runs continuously. The platform clearly labels the last-updated timestamp on every data module so you always know how fresh the data is.`,
    },
    {
      q: "Can I export my reports from TradePulse?",
      a: `Yes. All plans include PDF report generation. Pro and Enterprise plans get unlimited reports, and Enterprise customers can white-label reports with their company branding. Reports include all charts, AI insights, supplier data, and source attribution — ready for board or CFO presentation without reformatting.`,
    },
  ];

  const toggleCoreItem = (index) => {
    setActiveCoreIndex((prev) => (prev === index ? null : index));
  };

  useReveal(heroRef, "tp-hero--visible");
  useReveal(problemRef, "tp-problem--visible");
  useReveal(solutionRef, "tp-solution--visible");
  useReveal(featuresRef, "tp-core--visible");
  useReveal(audienceRef, "tp-audience--visible");
  useReveal(diffRef, "tp-diff--visible");
  useReveal(visionRef, "tp-vision--visible");
  useReveal(productRef, "tp-product--visible");
  useReveal(supplierRef, "tp-supplier--visible");
  useReveal(aiRef, "tp-ai--visible");
  useReveal(priceRef, "tp-price--visible");
  useReveal(faqRef, "tp-faq--visible");
  useReveal(aboutRef, "tp-about--visible");
  useReveal(ctaRef, "tp-final-cta--visible");


  const corridors = [
    {
      route: "UK ↔ Nigeria",
      from: {
        country: "United Kingdom",
        code: "Uk",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "Nigeria",
        code: "NG",
        flag_emoji: "🇳🇬",
        flag_url: "https://flagcdn.com/w40/ng.png",
      },
    },
    {
      route: "UK ↔ Ghana",
      from: {
        country: "United Kingdom",
        code: "UK",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "Ghana",
        code: "GH",
        flag_emoji: "🇬🇭",
        flag_url: "https://flagcdn.com/w40/gh.png",
      },
    },
    {
      route: "UK ↔ Kenya",
      from: {
        country: "United Kingdom",
        code: "UK",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "Kenya",
        code: "KE",
        flag_emoji: "🇰🇪",
        flag_url: "https://flagcdn.com/w40/ke.png",
      },
    },
    {
      route: "UK ↔ South Africa",
      from: {
        country: "United Kingdom",
        code: "UK",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "South Africa",
        code: "ZA",
        flag_emoji: "🇿🇦",
        flag_url: "https://flagcdn.com/w40/za.png",
      },
    },
    {
      route: "UK ↔ Ethiopia",
      from: {
        country: "United Kingdom",
        code: "UK",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "Ethiopia",
        code: "ET",
        flag_emoji: "🇪🇹",
        flag_url: "https://flagcdn.com/w40/et.png",
      },
    },
    {
      route: "UK ↔ Ivory Coast",
      from: {
        country: "United Kingdom",
        code: "UK",
        flag_emoji: "UK",
        flag_url: "https://flagcdn.com/w40/gb.png",
      },
      to: {
        country: "Ivory Coast",
        code: "CI",
        flag_emoji: "🇨🇮",
        flag_url: "https://flagcdn.com/w40/ci.png",
      },
    },
  ];
  return (
    <>
      {/* ================= HERO ================= */}
      <section id="home" ref={heroRef} className="tp-section">
        <div className="tp-container">
          <div className="tp-hero-ai-wrap">
            <div className="tp-hero-ai-content">
              <span className="tp-pill tp-pill-primary">
                Cross Border Trade Intelligence Platform
              </span>

              <h1 className="tp-hero-ai-title">
                Cross Border Trade Is Complex.
                <br />
                <span>Decisions Shouldn't Be.</span>
                <br />
                {/* for UK-Africa Trade */}
              </h1>

              <p className="tp-hero-ai-sub">
                {/* TradepulseAI is an AI-Powered trade intelligence and supplier verification platform for importers, exporters and SME’s. */}
                TradePulse gives risk analysts and procurement teams a
                defensible sourcing thesis in under 15 minutes. Backed with
                10-year price trends, verified supplier intelligence, and
                AI-synthesised trade news across UK-Africa corridors.
              </p>

              <p className="tp-hero-ai-support">
                {/* Understand pricing trends, supplier reliability, and trade risks
                before committing capital or entering new markets. */}
                <span>10yr Price history depth</span>{" "}
                <span className="tp-seperator">|</span>
                <span>less than 15min Time to sourcing thesis</span>{" "}
                <span className="tp-seperator">|</span>
                <span>6+ Active corridors</span>
                {/* {
                  "10yr Price history depth | <15min Time to sourcing thesis | 6+ Active corridors"
                } */}
              </p>

              <div className="tp-hero-ai-actions">
                <button
                  className="tp-btn-primary"
                  onClick={() => navigate("/register")}
                >
                  Join Early Access
                </button>

                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/login")}
                >
                  View Platform Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT VISUAL image ================= */}
      <section className="tp-section tp-section--tight tp-product-visual">
        <div className="tp-container tp-product-visual-inner">
          {/* Dark theme image */}
          <img
            src="/images/products-dark.webp"
            alt="TradePulse AI Dashboard"
            className="tp-product-image tp-product-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/products-light.webp"
            alt="TradePulse AI Dashboard"
            className="tp-product-image tp-product-image--light"
          />
        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section
        id="problem"
        ref={problemRef}
        className="tp-section tp-section--spacious tp-problem"
      >
        <div className="tp-container">
          {/* Header */}
          <div className="tp-problem-header">
            <h2 className="tp-problem-title">
              {/* Cross Border Trade Is Complex. */}
              The Old Way Is
              <br />
              <span> Costing You Real Money</span>
              {/* <span>Decisions Shouldn’t Be.</span> */}
            </h2>

            <p className="tp-problem-intro">
              {/* Across cross border trade corridors, businesses face the same
              challenges fragmented data, limited visibility, and growing risk
              regardless of geography, industry, or scale. */}
              UK importers sourcing from Africa are flying blind. Without
              structured intelligence, overpaying for commodities and getting
              burned by unverified suppliers isn't bad luck, it's a process
              failure.
            </p>
          </div>

          {/* Cards */}
          <div className="tp-problem-cards">
            <div className="tp-problem-card">
              {/* <h4>Fragmented Market Data</h4> */}
              <h4>You're sourcing from raw spreadsheets</h4>
              <p>
                {/* Trade intelligence scattered across regions, platforms, and
                inconsistent data sources. */}
                Manually aggregating trade data from UN Comtrade, broker emails,
                and market reports. No trend context. No analyst insight. Just
                numbers.
              </p>
            </div>

            <div className="tp-problem-card">
              {/* <h4>Demand & Pricing Blindspots</h4> */}
              <h4>Supplier due diligence is a gamble</h4>
              <p>
                {/* Limited visibility into real-time demand, pricing signals, and
                market momentum across regions. */}
                Certificates expire. Reliability is word-of-mouth. There's no
                structured way to compare supplier track records across
                corridors before committing capital.
              </p>
            </div>

            <div className="tp-problem-card">
              {/* <h4>Supplier Verification Issues</h4> */}
              <h4>News is noise without decision prompts </h4>
              <p>
                {/* Difficulty validating suppliers, partners, and counterparties
                across borders. */}
                Trade news feeds dump raw links. Your analysts spend hours
                interpreting what it means for your next sourcing decision
                instead of acting on it.
              </p>
            </div>

            <div className="tp-problem-card">
              {/* <h4>Risk, Fraud & Decision Uncertainty</h4> */}
              <h4>A sourcing thesis takes days to build</h4>
              <p>
                {/* Lack of early warnings and reliable data increases fraud risk,
                failures, and costly decisions. */}
                By the time your team assembles data, verifies suppliers, models
                FX impact, and writes it up, the window has often closed.
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="tp-problem-footer">
            <p className="tp-problem-impact">
              These challenges slow growth, increase risk, and prevent
              businesses especially SMEs from making confident, data backed
              trade decisions across borders.
            </p>

            <p className="tp-problem-conclusion">
              <strong>TradePulse AI was built to change that.</strong>
            </p>
          </div>
        </div>
      </section>
      {/* ================= REPORTS VISUAL ================= */}
      <section className="tp-section tp-section--tight tp-reports-visual">
        <div className="tp-container tp-reports-visual-inner">
          {/* Dark theme image */}
          <img
            src="/images/reports-dark.webp"
            alt="TradePulse AI Reports & Analytics"
            className="tp-reports-image tp-reports-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/reports-light.webp"
            alt="TradePulse AI Reports & Analytics"
            className="tp-reports-image tp-reports-image--light"
          />
        </div>
      </section>

      {/* ================= SOLUTION SECTION ================= */}
      <section
        id="solution"
        ref={solutionRef}
        className="tp-section tp-section--spacious tp-solution"
      >
        <div className="tp-container">
          {/* Header */}
          <div className="tp-solution-header">
            <h2 className="tp-solution-title">
              {/* Intelligence Modules for */}
              From Raw Data To
              <br />
              {/* <span>Smarter Cross Border Trade Decisions</span> */}
              <span>defended thesis in 15 minutes</span>
            </h2>

            <p className="tp-solution-sub">
              {/* TradePulse AI transforms fragmented cross border trade data into
              actionable intelligence across markets, suppliers, and risk
              signals. */}
              TradePulse replaces your entire manual research workflow with a
              single, structured intelligence loop.
            </p>
          </div>

          {/* Intelligence Flow */}
          <div className="tp-solution-flow">
            <div className="tp-flow-line" />

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                {/* <h4>Market Intelligence</h4> */}
                <h4>Orient & Explore</h4>
                <p>
                  {/* Pricing trends, demand signals, and trade flows consolidated
                  into a unified cross border market view. */}
                  Select your active trade corridor. TradePulse surfaces the
                  highest-signal products, live price positions, volatility
                  alerts, and AI-synthesised news before you even type a query.
                </p>
                <p className="tp-text-muted">Under 2 minutes</p>
              </div>
            </div>

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                {/* <h4>AI-Driven Insights</h4> */}
                <h4>Verify & Assess</h4>
                <p>
                  {/* AI models identify trends, anomalies, and early signals hidden
                  within complex trade data. */}
                  Drill into product price history against 10-year benchmarks.
                  Check supplier reliability scores, sanctions screening, and
                  certification status — all in one place.
                </p>
                <p className="tp-text-muted">Under 8 minutes</p>
              </div>
            </div>

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                {/* <h4>Supplier Intelligence</h4> */}
                <h4>Decide & Document </h4>
                <p>
                  {/* Verified insights into supplier behavior, reliability, and
                  historical trade performance across regions. */}
                  Let the AI Assistant validate your thesis. Export a fully
                  formatted PDF report — ready to take to your CFO, procurement
                  board, or trading desk. One click.
                </p>
                <p className="tp-text-muted">Under 5 minutes</p>
              </div>
            </div>

            {/* <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                <h4>Risk & Anomaly Detection</h4>
                <p>
                  Early alerts on supply risk, compliance issues, and unusual
                  trade patterns before commitments are made.
                </p>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <p className="tp-solution-footer">
            All delivered through a unified decision-support platform built for
            importers, exporters, and cross border trade operators.
          </p>
        </div>
      </section>

      {/* ================= FORECAST VISUAL ================= */}
      <section className="tp-section tp-section--tight tp-forecast-visual">
        <div className="tp-container tp-forecast-visual-inner">
          {/* Dark theme image */}
          <img
            src="/images/forecast-dark.webp"
            alt="TradePulse AI Forecast & Predictive Analytics"
            className="tp-forecast-image tp-forecast-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/forecast-light.webp"
            alt="TradePulse AI Forecast & Predictive Analytics"
            className="tp-forecast-image tp-forecast-image--light"
          />
        </div>
      </section>

      {/* ================= CORE FEATURES ================= */}
      <section
        id="features"
        ref={featuresRef}
        className="tp-section tp-section--spacious tp-core"
      >
        <div className="tp-container">
          {/* Header */}
          <div className="tp-core-header">
            <h2 className="tp-core-title">
              Intelligence <span>Capabilities</span>
            </h2>
            <p className="tp-core-sub">
              TradePulse AI provides actionable intelligence across markets,
              suppliers, and risk helping teams make informed trade decisions
              before taking action.
            </p>
          </div>

          {/* Accordion */}
          <div className="tp-core-accordion">
            {/* Item 1 */}
            <div
              className={`tp-core-item ${activeCoreIndex === 0 ? "active" : ""}`}
            >
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(0)}
                type="button"
              >
                <span className="tp-core-index">01</span>
                <span className="tp-core-heading">Market Intelligence</span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Understand demand, pricing trends, and market signals across
                  regions.
                </p>
                <ul>
                  <li> Identify emerging demand trends across markets </li>
                  <li>Track pricing movements and volatility </li>
                  <li>Compare regional opportunities before expansion</li>
                </ul>
              </div>
            </div>

            {/* Item 2 */}
            <div
              className={`tp-core-item ${activeCoreIndex === 1 ? "active" : ""}`}
            >
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(1)}
                type="button"
              >
                <span className="tp-core-index">02</span>
                <span className="tp-core-heading">
                  Supplier Intelligence & Verification
                </span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Evaluate who you trade with before committing to a supplier.
                </p>
                <ul>
                  <li>Supplier credibility and profiling </li>
                  <li>Risk indicators derived from trade behavior </li>
                  <li>Visibility into historical supplier performance</li>
                </ul>
              </div>
            </div>

            {/* Item 3 */}
            <div
              className={`tp-core-item ${activeCoreIndex === 2 ? "active" : ""}`}
            >
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(2)}
                type="button"
              >
                <span className="tp-core-index">03</span>
                <span className="tp-core-heading">AI-Generated Insights</span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Turn complex trade data into clear, actionable insights.
                </p>
                <ul>
                  <li>AI-generated trade summaries and signals </li>
                  <li>Pattern recognition across markets and corridors </li>
                  <li>Early detection of anomalies and emerging risks</li>
                </ul>
              </div>
            </div>

            {/* Item 4 */}
            <div
              className={`tp-core-item ${activeCoreIndex === 3 ? "active" : ""}`}
            >
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(3)}
                type="button"
              >
                <span className="tp-core-index">04</span>
                <span className="tp-core-heading">
                  Risk & Anomaly Detection
                </span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Reduce uncertainty in cross-border trade decisions.
                </p>
                <ul>
                  <li>Flag unusual trade and pricing patterns</li>
                  <li>Identify potential compliance or reliability risks </li>
                  <li>Support safer, more informed execution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= PRODUCT INTELLIGENCE ================= */}

      <section ref={productRef} className="tp-section tp-section--spacious tp-product-intelligence">
        <div className="tp-container">

          {/* Header */}
          <div className="tp-product-intelligence-header">
            <h2 className="tp-product-intelligence-title">
              Product <span>Intelligence</span>
            </h2>

            <p className="tp-product-intelligence-sub">
              10 years of price context. Not just today's number.
            </p>

            <p className="tp-product-intelligence-desc">
              Every commodity you track comes with full historical range context,
              AI trend interpretation, and a forward-looking forecast so you always
              know whether today's price is a deal or a trap.
            </p>
          </div>

          {/* Cards */}
          <div className="tp-product-intelligence-grid">

            <div className="tp-card tp-pi-card">
              <h4>10-year price trend charts</h4>
              <p>
                Compare current price against its full historical range. See the
                percentile position at a glance.
              </p>
            </div>

            <div className="tp-card tp-pi-card">
              <h4>Volatility risk scoring</h4>
              <p>
                Know which products are stable vs. volatile before you commit to
                purchase volumes.
              </p>
            </div>

            <div className="tp-card tp-pi-card">
              <h4>AI forecast extension</h4>
              <p>
                12-month forward price projection with confidence band, updated as
                new trade data flows in.
              </p>
            </div>

          </div>

        </div>
      </section>
      {/* ================= SUPPLIER INTELLIGENCE ================= */}
      <section ref={supplierRef} className="tp-section tp-section--spacious tp-supplier-intelligence">
        <div className="tp-container">

          {/* Header */}
          <div className="tp-supplier-intelligence-header">
            <h2 className="tp-supplier-intelligence-title">
              Supplier <span>Intelligence</span>
            </h2>

            <p className="tp-supplier-intelligence-sub">
              Stop trusting gut feelings. Verify first.
            </p>

            <p className="tp-supplier-intelligence-desc">
              Every supplier in TradePulse carries a structured reliability score,
              sanctions screening status, and document verification history so you
              know exactly who you're dealing with before any capital moves.
            </p>
          </div>

          {/* Cards */}
          <div className="tp-supplier-intelligence-grid">

            <div className="tp-card tp-si-card">
              <h4>Verification status & document tracking</h4>
              <p>
                See which certifications are current, expired, or under review for
                every supplier.
              </p>
            </div>

            <div className="tp-card tp-si-card">
              <h4>Sanctions & compliance screening</h4>
              <p>
                Automated sanctions list cross-referencing. Know your supplier's
                compliance status instantly.
              </p>
            </div>

            <div className="tp-card tp-si-card">
              <h4>Reliability scoring (0–100)</h4>
              <p>
                Composite score built from shipment history, document completeness,
                and response rate.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= AIAssistant ================= */}
      <section ref={aiRef} className="tp-section tp-section--spacious tp-ai-assistant">
        <div className="tp-container">

          {/* Header */}
          <div className="tp-ai-assistant-header">
            <h2 className="tp-ai-assistant-title">
              AI <span>Assistant</span>
            </h2>

            <p className="tp-ai-assistant-sub">
              Ask your data anything. Get a decision prompt back.
            </p>

            <p className="tp-ai-assistant-desc">
              The TradePulse AI Assistant doesn't just answer questions, it
              interprets your platform data in real time and translates it into
              actionable sourcing decisions. Every answer is source-attributed.
            </p>
          </div>

          {/* Cards */}
          <div className="tp-ai-assistant-grid">

            <div className="tp-card tp-ai-card">
              <h4>Contextual answers grounded in your data</h4>
              <p>
                Ask about price trends, supplier comparisons, FX timing, or
                corridor risk, all answered against live platform data.
              </p>
            </div>

            <div className="tp-card tp-ai-card">
              <h4>One-click export to report</h4>
              <p>
                Any AI insight can be saved to your sourcing report with source
                attribution intact.
              </p>
            </div>

            <div className="tp-card tp-ai-card">
              <h4>News with decision implications</h4>
              <p>
                Every trade news item is processed into a categorised decision
                prompt: Risk Alert, Opportunity Signal, or Price Impact.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= PRICING PLAN ================= */}
      <section ref={priceRef} className="tp-section tp-section--spacious tp-pricing">
        <div className="tp-container">

          {/* Header */}
          <div className="tp-pricing-header">
            <h2 className="tp-pricing-title">
              Simple <span>Pricing</span>
            </h2>
            <p className="tp-pricing-sub">
              Start free. Upgrade when you're ready to act on real intelligence.
            </p>
          </div>

          {/* Plans */}
          <div className="tp-pricing-grid">

            {/* FREE PLAN */}
            <div className="tp-card tp-pricing-card">
              <h3 className="tp-pricing-plan">Free</h3>

              <div className="tp-pricing-price">
                $0 <span>/forever</span>
              </div>

              <p className="tp-pricing-desc">
                Explore the platform. See what the intelligence looks like before
                you commit.
              </p>

              <ul className="tp-pricing-features">
                <li>1 trade corridor (read-only)</li>
                <li>Product summary view — no trend charts</li>
                <li>Current prices only — no history</li>
                <li>3 supplier entries per corridor</li>
                <li>Today's FX rate only</li>
              </ul>

              <button className="tp-btn-outline">Get Started</button>
            </div>

            {/* PRO PLAN */}
            <div className="tp-card tp-pricing-card tp-pricing-card--pro">
              <div className="tp-pricing-badge">Most Popular</div>

              <h3 className="tp-pricing-plan">Pro</h3>

              <div className="tp-pricing-price">
                $149 <span>/mo</span>
              </div>

              <p className="tp-pricing-desc">
                Full intelligence for analysts and procurement teams ready to act
                on data.
              </p>

              <ul className="tp-pricing-features">
                <li>All trade corridors</li>
                <li>Full product intelligence + trend charts</li>
                <li>10-year historical price data</li>
                <li>Full supplier detail + AI reliability scoring</li>
                <li>FX rate history + forward projections</li>
                <li>Unlimited AI Assistant queries</li>
                <li>Unlimited PDF reports</li>
                <li>Unlimited watchlist & alerts</li>
                <li>Full news synthesis feed</li>
                <li>AI forecast extension (12 months)</li>
              </ul>

              <button className="tp-btn-primary">Upgrade to Pro</button>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section ref={faqRef} className="tp-section tp-section--spacious tp-faq">
        <div className="tp-container">

          {/* Header */}
          <div className="tp-faq-header">
            <h2 className="tp-faq-title">
              Frequently Asked <span>Questions</span>
            </h2>
            <p className="tp-faq-sub">
              Everything you need to know before getting started.
            </p>
          </div>

          {/* Accordion */}
          <div className="tp-faq-accordion">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`tp-faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <button
                  className="tp-faq-trigger"
                  onClick={() => toggleItem(index)}
                >
                  <span className="tp-faq-question">{item.q}</span>
                  <span className="tp-faq-icon">+</span>
                </button>

                <div className="tp-faq-panel">
                  <p className="tp-faq-answer">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* ================= FINAL CTA ================= */}
      <section
        id="contact"
        ref={ctaRef}
        className=" tp-section--cta tp-section--spacious tp-final-cta"
      >
        <div className="tp-container">
          <div className="tp-final-cta-layout">
            <h2 className="tp-final-cta-title">
              {/* Explore the Future of */}
              Your Next Sourcing Decision Deserves
              <br />
              {/* <span>Cross Border Trade Intelligence</span> */}
              <span>Real Intelligence.</span>
            </h2>

            <p className="tp-final-cta-sub">
              {/* TradePulse AI is built for teams that want clarity before
              commitment and intelligence before execution. Join us as we shape
              the platform together. */}
              Join the analysts and procurement teams who have replaced
              spreadsheets, broker guesswork, and supplier roulette with a
              defensible, data-backed thesis. Built in 15 minutes.
            </p>

            <div className="tp-final-cta-actions">
              <button
                className="tp-btn-primary tp-final-cta-primary"
                onClick={() => navigate("/register")}
              >
                Join Early Access
              </button>

              <div className="tp-final-cta-secondary">
                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/contact")}
                >
                  Request a Demo
                </button>

                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/contact")}
                >
                  Share Feedback / Partner
                </button>
                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/roadmap")}
                >
                  View Roadmap
                </button>
              </div>
              <div className="tp-final-cta-secondary">
                <p className="tp-text-muted">
                  No commitment required. We confirm your spot within 48 hours.
                  Questions?
                  <button
                    className="tp-talk-to-us-btn"
                    onClick={() => navigate("/contact")}
                  >
                    Talk to us.
                  </button>
                </p>
              </div>
              <div className="tp-corridor-wrapper">
                <div className="tp-corridor-scroll">
                  {corridors.map((item, index) => (
                    <div
                      key={index}
                      className="tp-pill tp-pill-primary tp-active-corridor-pill"
                    >
                      {/* <span className="tp-flag">{item.from.flag_emoji}</span> */}
                      <img
                        className="tp-active-corridor-flag"
                        src={item.from.flag_url}
                        alt={item.from.flag_emoji}
                      />

                      <span className="tp-text">
                        {item.from.code} ↔ {item.to.country}
                      </span>

                      <img
                        className="tp-active-corridor-flag"
                        src={item.to.flag_url}
                        alt={item.to.flag_emoji}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
