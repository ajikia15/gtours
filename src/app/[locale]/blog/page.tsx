import BlogCard from "@/components/BlogCard";

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <div className="grid grid-cols-3 gap-5 p-6">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </div>
  );
}
