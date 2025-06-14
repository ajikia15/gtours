export default function MapPinFill({
  size = 24,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{
        transform: `translate(-${size / 2}px, -${size * 0.85}px)`, // Center horizontally, anchor at pin tip (85% down)
        transformOrigin: "center bottom",
      }}
    >
      <path
        fill={color}
        d="M128 16a88.1 88.1 0 0 0-88 88c0 75.3 80 132.17 83.41 134.55a8 8 0 0 0 9.18 0C136 236.17 216 179.3 216 104a88.1 88.1 0 0 0-88-88m0 56a32 32 0 1 1-32 32a32 32 0 0 1 32-32"
      ></path>
    </svg>
  );
}
