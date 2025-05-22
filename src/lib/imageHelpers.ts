export const getImageUrl = (image?: string) =>
  image
    ? `https://firebasestorage.googleapis.com/v0/b/gtours-fcd56.firebasestorage.app/o/${encodeURIComponent(
        image
      )}?alt=media`
    : "/HorseRiding.svg";
