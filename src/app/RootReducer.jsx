import { combineReducers } from "@reduxjs/toolkit";

import PriceReducer from "../features/prices/PriceSlice.jsx";
import NotificationReducer from "../features/notifications/NotificationSlice.jsx";

const RootReducer = combineReducers({
  prices: PriceReducer,
  notifications: NotificationReducer,
});

export default RootReducer;
