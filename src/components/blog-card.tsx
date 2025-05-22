import Image from "next/image";
export default function BlogCard() {
  return (
    <div className="flex w-full flex-col gap-6 mb-20">
      <div className="flex">
        <div className="w-5/6 aspect-video">
          <Image
            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2566&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Blog Image"
            width={100}
            height={100}
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
