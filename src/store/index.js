import { create } from "zustand";

export const useStore = create((set) => ({
  breakStatus: 0,
  stateData: {
    progressVal: undefined,
    targetId: undefined,
  },
  setBreakStatus: (val) => set((state) => ({ breakStatus: val })),
  setStateData: (val) =>
    {
        set((state) => ({
            stateData: {
              progressVal: val.progressVal,
              targetId: val.tartgetId,
            },
          }))
    }
}));
