import CustomsDutyRates from '../../components/overview/CustomsDutyRates.jsx';
import LatestTradeNews from '../../components/overview/LatestTradeNews.jsx';
import MarketOverview from '../../components/overview/MarketOverview.jsx';


function Overview() {


  return (
    <>
      <LatestTradeNews />
      <MarketOverview />
      <CustomsDutyRates />
    </>
  );
}

export default Overview;
