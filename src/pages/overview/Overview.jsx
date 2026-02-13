import CustomsDutyRates from '../../components/overview/CustomsDutyRates.jsx';
import LatestTradeNews from '../../components/overview/LatestTradeNews.jsx';
import MarketOverview from '../../components/overview/MarketOverview.jsx';
import OverviewCharts from '../../components/overview/OverviewCharts.jsx';


function Overview() {


  return (
    <>
      <LatestTradeNews />
      <OverviewCharts/>
      <MarketOverview />
      <CustomsDutyRates />
    </>
  );
}

export default Overview;
