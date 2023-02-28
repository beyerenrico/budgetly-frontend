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

