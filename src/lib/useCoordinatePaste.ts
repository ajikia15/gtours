import { useCallback } from "react";

export function useCoordinatePaste(
  onLatChange: (value: number) => void,
  onLngChange: (value: number) => void
) {
  const handlePaste = useCallback(
    (
      event: React.ClipboardEvent<HTMLInputElement>,
      isLatitudeField: boolean
    ) => {
      const pastedText = event.clipboardData.getData("text/plain").trim();

      // Check if the pasted text contains a comma (coordinate pair)
      if (pastedText.includes(",")) {
        event.preventDefault(); // Prevent default paste behavior

        const parts = pastedText.split(",").map((part) => part.trim());

        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);

          // Validate that both parts are valid numbers
          if (!isNaN(lat) && !isNaN(lng)) {
            // Validate coordinate ranges
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
              // Format to 6 decimal places
              const formattedLat = Number(lat.toFixed(6));
              const formattedLng = Number(lng.toFixed(6));

              // Set both values
              onLatChange(formattedLat);
              onLngChange(formattedLng);

              return;
            }
          }
        }
      }

      // If it's not a coordinate pair, check if it's a single valid coordinate
      const singleValue = parseFloat(pastedText);
      if (!isNaN(singleValue)) {
        event.preventDefault();

        // Validate range based on field type
        if (isLatitudeField && (singleValue < -90 || singleValue > 90)) {
          return; // Invalid latitude range
        }
        if (!isLatitudeField && (singleValue < -180 || singleValue > 180)) {
          return; // Invalid longitude range
        }

        // Format to 6 decimal places
        const formattedValue = Number(singleValue.toFixed(6));

        if (isLatitudeField) {
          onLatChange(formattedValue);
        } else {
          onLngChange(formattedValue);
        }
      }
    },
    [onLatChange, onLngChange]
  );

  return { handlePaste };
}
