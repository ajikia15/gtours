export default function Header(props: { title: string }) {
  return (
    <header
      className="flex justify-center items-center w-full rounded-lg bg-gray-500 h-42 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url("/header.jpg")' }}
    >
      <div className="absolute inset-0 bg-gray-800/70 bg-opacity-50 rounded-lg"></div>
      <h1 className="text-white text-4xl font-bold relative z-10">
        {props.title}
      </h1>
    </header>
  );
}
