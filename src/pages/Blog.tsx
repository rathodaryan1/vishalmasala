import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listBlogs, type BlogPost } from "@/lib/blogs";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await listBlogs();
      setBlogs(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-muted border-b border-border">
        <div className="container py-16 md:py-24 text-center">
          <p className="font-body text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-3 duration-700">The Spice Journal</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">Stories, Tips & Guides</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-7 duration-1000">
            Explore the rich heritage of Indian spices, kitchen hacks from our experts, and the journey of Vishal Masala.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-muted rounded-2xl mb-4" />
                <div className="h-6 bg-muted rounded-full w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <Link 
                key={blog._id} 
                to={`/blog/${blog.slug}`}
                className="group flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-700"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-md group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-white font-bold flex items-center gap-2">Read Story <span className="translate-x-0 group-hover:translate-x-2 transition-transform">→</span></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 bg-primary/10 rounded-full">{blog.date}</span>
                  <span className="text-xs text-muted-foreground italic">By {blog.author}</span>
                </div>
                
                <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {blog.content}
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <h2 className="font-display text-2xl font-bold mb-2">No stories yet</h2>
            <p className="text-muted-foreground">Keep checking back for new spice guides and recipes.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
