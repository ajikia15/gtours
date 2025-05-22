import ReactMarkdown from "react-markdown";
import fakeTimeOutForSkeletons from "@/lib/fakeTimeoutForSkeletons";
export default async function TextSection({
  description,
}: {
  description: string;
}) {
  await fakeTimeOutForSkeletons();
  return (
    <>
      <h1 className="text-2xl font-bold">About the Tour</h1>
      <div className="tour-description">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </>
  );
}
