import React from "react";
import TPChart from "../common/TPChart.jsx";
import TPMetricCard from "../common/TPMetricCard.jsx";

const OverviewCharts = () => {
    const priceData = [
        { month: "Jan", value: 45 },
        { month: "Feb", value: 52 },
        { month: "Mar", value: 48 },
        { month: "Apr", value: 61 },
        { month: "May", value: 55 },
        { month: "Jun", value: 68 },
    ];

    const demandData = [
        { month: "Jan", value: 50 },
        { month: "Feb", value: 57 },
        { month: "Mar", value: 60 },
        { month: "Apr", value: 54 },
        { month: "May", value: 67 },
        { month: "Jun", value: 72 },
    ];

    return (
        <section className="tp-section tp-section--tight">
            <div className="tp-container">
                <div className="tp-overview-charts">

                    <TPMetricCard
                        title="Currency Exchange Tracker"
                        value="1.05"
                        unit="USD/NGN (x100)"
                        footerLabel="Naira strengthening"
                        trend={2.3}
                        trendDirection="up"
                    />

                    <TPMetricCard
                        title="Shipping Cost Trend"
                        value="$2,450"
                        unit="per container"
                        footerLabel="Down from last month"
                        trend={5.2}
                        trendDirection="down"
                    />

                    <TPMetricCard
                        title="Product Demand Signal"
                        value="72%"
                        footerLabel="Electronics category"
                        trend={14}
                        trendDirection="up"
                    />

                    <TPMetricCard
                        title="Supplier Trust Score"
                        value="8.7/10"
                        footerLabel="Verified suppliers"
                        trend={1.2}
                        trendDirection="up"
                    />


                    {/* Product Price Trend */}
                    <TPChart
                        title="Product Price Trend"
                        type="line"
                        data={priceData}
                        series={[
                            { key: "value", label: "Price" }
                        ]}
                    />

                    {/* Demand Growth Forecast */}
                    <TPChart
                        title="Demand Growth Forecast"
                        type="area"
                        data={demandData}
                        series={[
                            { key: "value", label: "Demand" }
                        ]}
                    />

                </div>
            </div>
        </section>
    );
};

export default OverviewCharts;
