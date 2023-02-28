import { ThemeProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import React from "react";

import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import "./index.css";
import router from "./routes";
import theme from "./theme";

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
