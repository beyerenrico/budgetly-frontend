import { ThemeProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import React from "react";

import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import "./index.css";
import router from "./routes";
import theme from "./theme";

export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    (set, get) => ({
      planner: null,
      setPlanner: (planner) => set({ planner }),
    }),
    {
      name: "selected-planner",
    }
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
