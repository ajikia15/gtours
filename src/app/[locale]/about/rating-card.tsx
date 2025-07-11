type RatingCardProps = {
  title?: string;
  review?: string;
  author?: string;
  number?: string;
};

export default function RatingCard({ 
  title = "rating.title", 
  review = "rating.review Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, quo? rating.review Lorem ipsum dolor sit amet consectetur adipisicing elit.", 
  author = "rating.author",
  number = "01"
}: RatingCardProps) {
  return (
    <div className="aspect-square rounded-xl bg-[#fcf5f6] flex flex-col justify-center relative p-8 max-w-[300px]">
      <h3 className="font-bold w-full">{title}</h3>
      <p className="w-full mt-2 text-gray-500">
        {review}
      </p>
      <p className="text-end w-full mt-4 font-semibold">{author}</p>
      <span className="text-7xl text-rose-200 italic font-semibold absolute left-0 bottom-0 px-8 pb-2 ">
        {number}
      </span>
    </div>
  );
}
