import "./loading-animation.css";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "pulse" | "bars";
  message?: string;
  className?: string;
}

export function LoadingAnimation({
  size = "md",
  variant = "spinner",
  message,
  className = "",
}: LoadingAnimationProps) {
  const renderSpinner = () => (
    <div
      className={`spinner ${
        size === "sm" ? "small" : size === "lg" ? "large" : ""
      } ${className}`}
    ></div>
  );

  const renderPulse = () => (
    <div className={`pulse-dots ${className}`}>
      <div className="pulse-dot"></div>
      <div className="pulse-dot"></div>
      <div className="pulse-dot"></div>
    </div>
  );

  const renderBars = () => (
    <div className={`bars ${className}`}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );

  const renderAnimation = () => {
    switch (variant) {
      case "pulse":
        return renderPulse();
      case "bars":
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="loading-container">
      {renderAnimation()}
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

// Convenience components for common use cases
export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="page-loader">
      <LoadingAnimation size="lg" message={message || "Loading..."} />
    </div>
  );
}

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="inline-loader">
      <LoadingAnimation size="sm" message={message} />
    </div>
  );
}

export function FormLoader({ message }: { message?: string }) {
  return (
    <div className="form-loader">
      <LoadingAnimation
        size="md"
        variant="pulse"
        message={message || "Processing..."}
      />
    </div>
  );
}
