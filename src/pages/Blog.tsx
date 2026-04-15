import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const blogs = [
  {
    title: "How to store spices for longer freshness",
    excerpt: "Simple kitchen-friendly methods to preserve aroma, color, and potency of your masalas.",
  },
  {
    title: "5 must-have masalas in every Indian kitchen",
    excerpt: "The essential spice picks that power daily cooking from tadka to festive meals.",
  },
  {
    title: "Difference between whole and powdered spices",
    excerpt: "Understand when to use whole seeds, fresh grinds, and ready blends for best flavor.",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-muted border-b border-border">
        <div className="container py-12 text-center">
          <h1 className="font-display text-4xl font-bold">Vishal Masala Blog</h1>
          <p className="text-muted-foreground mt-3">Tips, guides, and stories from our spice journey.</p>
        </div>
      </div>
      <div className="container py-8 grid md:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <article key={blog.title} className="border border-border rounded-xl p-5">
            <h2 className="font-display text-xl font-bold">{blog.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{blog.excerpt}</p>
            <button className="mt-4 text-primary text-sm font-semibold">Read more</button>
          </article>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
