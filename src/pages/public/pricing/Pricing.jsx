const Pricing = () => {
  return (
   <>
   {/*================== hero section ============== */}
   <section className="tp-section tp-section--hero tp-pricing-hero">
  <div className="tp-container">

    <div className="tp-pricing-hero-content">

      <span className="tp-badge tp-badge-primary">
        TradePulse Pricing
      </span>

      <h1 className="tp-pricing-title">
        Simple Pricing for
        <br />
        <span>Smarter cross-border Trade Decisions</span>
      </h1>

      <p className="tp-pricing-subtitle">
        Choose a plan designed for your scale — from early insights to
        enterprise-grade cross-border trade intelligence powered by AI.
      </p>

      <div className="tp-pricing-hero-actions">
        <button className="tp-btn-primary">
          Request Demo
        </button>

        <button className="tp-btn-outline">
          Join Early Access
        </button>
      </div>

    </div>

  </div>
</section>

 {/*============= PRICING PHILOSOPHY ================= */}
<section className="tp-section tp-section--tight tp-pricing-philosophy">
  <div className="tp-container">

    <div className="tp-section-header">
      <h2>
        How TradePulse
        <span> Pricing Works</span>
      </h2>

      <p>
        TradePulse pricing is designed around intelligence usage, regional
        coverage, and decision volume — so you pay only for the insights you
        need, without hidden costs or rigid plans.
      </p>
    </div>

    <div className="tp-grid tp-grid-2 tp-pricing-principles">

      <div className="tp-card tp-pricing-principle">
        <h4>Usage-Based Intelligence</h4>
        <p>
          Access market insights, supplier data, and AI models based on how
          frequently your team analyzes and acts on trade intelligence.
        </p>
      </div>

      <div className="tp-card tp-pricing-principle">
        <h4>Regional Coverage</h4>
        <p>
          Scale across countries and trade corridors as your business grows,
          without paying for unnecessary regions upfront.
        </p>
      </div>

      <div className="tp-card tp-pricing-principle">
        <h4>Flexible Growth</h4>
        <p>
          Upgrade or customize your plan as your intelligence needs evolve —
          from early exploration to enterprise-scale operations.
        </p>
      </div>

      <div className="tp-card tp-pricing-principle">
        <h4>No Hidden Fees</h4>
        <p>
          Clear pricing, predictable billing, and early access benefits — with
          full transparency across plans.
        </p>
      </div>

    </div>

  </div>
</section>

{/*=============== PRICING PLANS ============ */}
<section className="tp-section tp-section--spacious tp-pricing-plans">
  <div className="tp-container">

    <div className="tp-section-header">
      <h2>
        Choose the Right
        <span> Intelligence Plan</span>
      </h2>

      <p>
        Plans designed to support your cross-border trade decisions — from essential
        insights to enterprise-grade intelligence platforms.
      </p>
    </div>

    <div className="tp-grid tp-grid-2 tp-pricing-grid">

      {/* Starter Plan */}
      <div className="tp-card tp-pricing-card">
        <div className="tp-pricing-card-header">
          <h3>Starter</h3>
          <span className="tp-pill tp-pill-primary">Early Access</span>
        </div>

        <p className="tp-pricing-desc">
          Essential trade insights to help small teams understand cross-border
          markets and make informed early decisions.
        </p>

        <ul className="tp-pricing-features">
          <li>Basic market intelligence</li>
          <li>Price & demand signals (limited regions)</li>
          <li>Standard trade reports</li>
          <li>Email alerts</li>
          <li>1 user seat</li>
        </ul>

        <button className="tp-btn-outline tp-pricing-cta">
          Join Early Access
        </button>
      </div>

      {/* Professional Plan */}
      <div className="tp-card tp-pricing-card tp-pricing-card--highlight">
        <div className="tp-pricing-card-header">
          <h3>Professional</h3>
          <span className="tp-pill tp-pill-success">Recommended</span>
        </div>

        <p className="tp-pricing-desc">
          Advanced AI-powered intelligence for growing import and export teams
          managing multiple markets and suppliers.
        </p>

        <ul className="tp-pricing-features">
          <li>Everything in Starter</li>
          <li>AI-driven insights & trends</li>
          <li>Supplier intelligence & verification</li>
          <li>Risk & anomaly detection</li>
          <li>Custom alerts & dashboards</li>
          <li>Up to 5 user seats</li>
        </ul>

        <button className="tp-btn-primary tp-pricing-cta">
          Request Demo
        </button>
      </div>

      {/* Enterprise Plan */}
      <div className="tp-card tp-pricing-card">
        <div className="tp-pricing-card-header">
          <h3>Enterprise</h3>
        </div>

        <p className="tp-pricing-desc">
          A fully customized intelligence platform built for large-scale cross-border
          trade operations and analytics teams.
        </p>

        <ul className="tp-pricing-features">
          <li>Everything in Professional</li>
          <li>Full cross-border coverage</li>
          <li>Advanced AI models & forecasting</li>
          <li>Historical trade analytics</li>
          <li>API access & integrations</li>
          <li>Unlimited user seats</li>
        </ul>

        <button className="tp-btn-outline tp-pricing-cta">
          Contact Sales
        </button>
      </div>

    </div>

  </div>
</section>

 {/*============ PRICING COMPARISON TABLE ====================== */}

 <section className="tp-section tp-section--tight tp-pricing-compare">
  <div className="tp-container">

    <div className="tp-section-header">
      <h2>
        Compare
        <span> Plan Capabilities</span>
      </h2>

      <p>
        A clear breakdown of intelligence, risk coverage, and AI capabilities
        across each plan.
      </p>
    </div>

    <div className="tp-pricing-table">

      {/* Header */}
      <div className="tp-pricing-row tp-pricing-row--header">
        <div>Capabilities</div>
        <div>Starter</div>
        <div>Professional</div>
        <div>Enterprise</div>
      </div>

      {/* Market Intelligence */}
      <div className="tp-pricing-row">
        <div>Market intelligence</div>
        <div>Basic</div>
        <div>Advanced</div>
        <div>Full coverage</div>
      </div>

      <div className="tp-pricing-row">
        <div>Price & demand signals</div>
        <div>Limited regions</div>
        <div>Multi-region</div>
        <div>cross-border</div>
      </div>

      <div className="tp-pricing-row">
        <div>AI-driven insights</div>
        <div>—</div>
        <div>✔</div>
        <div>✔</div>
      </div>

      <div className="tp-pricing-row">
        <div>Supplier intelligence & verification</div>
        <div>—</div>
        <div>✔</div>
        <div>✔</div>
      </div>

      <div className="tp-pricing-row">
        <div>Risk & anomaly detection</div>
        <div>—</div>
        <div>✔</div>
        <div>✔</div>
      </div>

      <div className="tp-pricing-row">
        <div>Historical trade analytics</div>
        <div>—</div>
        <div>Limited</div>
        <div>✔</div>
      </div>

      <div className="tp-pricing-row">
        <div>API access</div>
        <div>—</div>
        <div>—</div>
        <div>✔</div>
      </div>

      <div className="tp-pricing-row">
        <div>Dedicated onboarding & support</div>
        <div>—</div>
        <div>—</div>
        <div>✔</div>
      </div>

    </div>

  </div>
</section>

  {/*================= PRICING FINAL CTA==================== */}
  <section className="tp-section tp-section--cta tp-pricing-cta">
  <div className="tp-container">

    <div className="tp-pricing-cta-inner">

      <h2 className="tp-pricing-cta-title">
        Explore the Right
        <span> Intelligence Plan</span>
        <br />
        for Your Business
      </h2>

      <p className="tp-pricing-cta-sub">
        Talk to our team to see how TradePulse can help you reduce risk,
        uncover opportunities, and make smarter cross-border trade decisions.
      </p>

      <div className="tp-pricing-cta-actions">
        <button className="tp-btn-primary">
          Request Demo
        </button>

        <button className="tp-btn-outline">
          Join Early Access
        </button>
      </div>

    </div>

  </div>
</section>

   </> 
    
  )
};

export default Pricing;
