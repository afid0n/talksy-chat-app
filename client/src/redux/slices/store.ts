// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // buraya başqa slice-lar da əlavə edə bilərsən
  },
});

// RootState və AppDispatch tip export-u
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
