import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import corridorReducer from "./slices/corridorSlice";
import countryReducer from "./slices/countrySlice";
import fxReducer from "./slices/fxSlice";
import authReducer from "./slices/authSlice";
/* ===============================
   ROOT REDUCER
================================ */
const rootReducer = combineReducers({
  corridor: corridorReducer,
  country: countryReducer,
  fx: fxReducer,
  auth: authReducer,
});

/* ===============================
   PERSIST CONFIG
================================ */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["corridor", "fx", "auth"],// ✅ persist only these
};

/* ===============================
   PERSISTED REDUCER
================================ */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ===============================
   STORE
================================ */
export const store = configureStore({
  reducer: persistedReducer,
});

/* ===============================
   PERSISTOR
================================ */
export const persistor = persistStore(store);