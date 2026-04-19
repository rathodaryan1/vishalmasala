import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchBlogBySlug, type BlogPost } from "@/lib/blogs";
import { getImageUrl } from "@/lib/utils";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!slug) return;
        const { data } = await fetchBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error("Error loading blog:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-display text-xl text-muted-foreground font-semibold">Simmering your story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Blog Hero */}
      <div className="relative h-[400px] md:h-[600px] bg-muted overflow-hidden">
        <img src={getImageUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="container pb-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Journal
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-8 text-white/90 font-body text-sm font-semibold tracking-wide">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {blog.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> {blog.author}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {blog.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-red max-w-none">
            {blog.content.split("\n").map((para, i) => (
              para ? <p key={i} className="mb-6 text-foreground/80 leading-relaxed font-body text-lg italic">{para}</p> : <br key={i} />
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-display font-bold text-primary">VM</div>
               <div>
                  <p className="text-sm font-bold">Vishal Masala Team</p>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">Authorized Spice Experts</p>
               </div>
            </div>
            <button className="text-primary font-bold hover:underline transition-all">Share Story</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
