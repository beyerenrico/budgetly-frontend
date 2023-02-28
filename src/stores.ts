import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSelectedPlannerStore = create<SelectedPlannerStoreState>()(
  persist(
    (set) => ({
      planner: null,
      setPlanner: (planner) => set({ planner }),
    }),
    {
      name: "selected-planner",
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
