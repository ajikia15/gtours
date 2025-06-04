import { useEffect, useRef } from "react";

interface InitialState {
  selectedDate: Date | undefined;
  travelers: { adults: number; children: number; infants: number };
  selectedActivities: string[];
  initialized: boolean;
}

interface UseCartChangesParams {
  selectedDate: Date | undefined;
  travelers: { adults: number; children: number; infants: number };
  selectedActivities: string[];
}

export function useCartChanges({
  selectedDate,
  travelers,
  selectedActivities,
}: UseCartChangesParams) {
  const initialState = useRef<InitialState>({
    selectedDate: undefined,
    travelers: { adults: 0, children: 0, infants: 0 },
    selectedActivities: [],
    initialized: false,
  });

  // Initialize the state when we have meaningful data
  useEffect(() => {
    if (
      !initialState.current.initialized &&
      selectedDate !== undefined &&
      travelers.adults > 0
    ) {
      initialState.current = {
        selectedDate: selectedDate,
        travelers: { ...travelers },
        selectedActivities: [...selectedActivities],
        initialized: true,
      };
    }
  }, [selectedDate, travelers, selectedActivities]);

  // Reset initial state after successful update (can be called from components)
  const resetInitialState = () => {
    initialState.current = {
      selectedDate: selectedDate,
      travelers: { ...travelers },
      selectedActivities: [...selectedActivities],
      initialized: true,
    };
  };

  return {
    initialState: initialState.current,
    resetInitialState,
  };
}
