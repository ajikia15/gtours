import ReactMarkdown from "react-markdown";
import ExpandToggle from "./expand-toggle";

export default async function TextSection({
  description,
  mobile = false,
}: {
  description: string;
  mobile?: boolean;
}) {
  return (
    <div className="relative">
      <div
        id="tour-description"
        className={`tour-description ${
          mobile ? "line-clamp-10 overflow-hidden" : ""
        }`}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
      {mobile && (
        <div className="absolute bottom-0 left-0 right-0">
          <ExpandToggle />
        </div>
      )}
    </div>
  );
}
