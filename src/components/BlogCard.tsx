export default function BlogCard() {
  return (
    <div className="flex w-full flex-col gap-6 mb-20">
      <div className="flex">
        <div className="w-5/6 aspect-video">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F0f%2F85%2F67%2F0f856728e78c91f00e9b9d4c9c3db825.jpg&f=1&nofb=1&ipt=0a23196d29391f7a091a3ddbf2c21bd18e9a5a5d8f7928fb10b4622ccb7f7b35"
            alt=""
            className="rounded-sm w-full h-full object-cover"
          />
        </div>
        <ul className="grid w-1/6 grid-rows-3 px-6">
          <li className="grid place-items-center border-t border-zinc-300 font-bold">
            09
          </li>
          <li className="font grid place-items-center border-y border-zinc-300">
            05
          </li>
          <li className="font grid place-items-center border-b border-zinc-300">
            2025
          </li>
        </ul>
      </div>
      <div className="flex w-4/5 flex-col gap-4 px-6">
        <h2 className="text-xl font-bold text-zinc-800">
          რა უნდა მეწყოს სალაშქრო ჩანთაში
        </h2>
        <p className="line-clamp-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
          deserunt totam neque, culpa fugiat excepturi sunt enim vitae
          repellendus nisi?
        </p>
        <p className="text-sm font-semibold text-red-500">
          წაიკითხე ბოლომდე &gt;
        </p>
      </div>
    </div>
  );
}
