import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSelectedReportStore = create<SelectedReportStoreState>()(
  persist(
    (set) => ({
      report: null,
      setReport: (report) => set({ report }),
    }),
    {
      name: "selected-report",
    }
  )
);

export const useTokenStore = create<TokenStoreState>()(
  persist(
    (set) => ({
      tokens: {
        accessToken: "",
        refreshToken: "",
      },
      setTokens: (tokens) => set({ tokens }),
    }),
    {
      name: "tokens",
    }
  )
);

export const useActiveUserStore = create<ActiveUserStoreState>()(
  persist(
    (set) => ({
      activeUser: null,
      setActiveUser: (activeUser) => set({ activeUser }),
    }),
    {
      name: "activeUser",
    }
  )
);
