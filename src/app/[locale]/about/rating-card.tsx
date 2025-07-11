export default function RatingCard() {
  return (
    <div className="aspect-square rounded-xl bg-rose-50 flex flex-col justify-center relative p-8 max-w-[300px]">
      <h3 className="font-bold w-full">rating.title</h3>
      <p className="w-full mt-2 text-gray-500">
        rating.review Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Ad, quo? rating.review Lorem ipsum dolor sit amet consectetur
        adipisicing elit.
      </p>
      <p className="text-end w-full mt-4 font-semibold">rating.author</p>
      <span className="text-7xl text-rose-200 italic font-semibold absolute left-0 bottom-0 px-8 pb-2 ">
        01
      </span>
    </div>
  );
}
