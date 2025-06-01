export default function Header(props: { title: string }) {
  return (
    <header className="flex justify-center items-center w-full rounded-lg bg-gray-500 h-42">
      <h1 className="text-white text-4xl font-bold">{props.title}</h1>
    </header>
  );
}
