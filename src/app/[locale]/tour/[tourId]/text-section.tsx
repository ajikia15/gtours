import ReactMarkdown from "react-markdown";
export default async function TextSection({
  description,
}: {
  description: string;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold">About the Tour</h1>
      <div className="tour-description">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </>
  );
}
