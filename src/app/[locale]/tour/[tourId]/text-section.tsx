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
          mobile ? "line-clamp-5 overflow-hidden" : ""
        }`}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
      {mobile && (
        <div className="absolute bottom-0 left-0 right-0   ">
          <div className="bg-gradient-to-t from-white to-transparent pointer-events-none h-8 w-full" />
          <div className="w-full bg-white">
            <ExpandToggle />
          </div>
        </div>
      )}
    </div>
  );
}
