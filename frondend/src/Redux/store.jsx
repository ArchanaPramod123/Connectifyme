import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Authentication/authenticationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
