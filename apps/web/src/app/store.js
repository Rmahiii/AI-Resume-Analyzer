import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import analysisReducer from "../features/analysis/analysisSlice.js";

export const store = configureStore({
  reducer: { auth: authReducer, analysis: analysisReducer }
});
