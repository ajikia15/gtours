import Image from "next/image";

export default function ImageSectionMember({
  image,
}: {
  image: string | null;
}) {
  if (!image) return null;
  return (
    <div className="flex flex-col gap-4 aspect-[2/1] h-full">
      <div className="relative w-full rounded-xl ">
        <h1>ყლეობანი</h1>
      </div>
      <div className="relative w-full flex-1 rounded-xl bg-black">
        <Image
          src={image}
          alt={image}
          fill
          className="object-cover rounded-xl"
        />
      </div>
    </div>
  );
}
