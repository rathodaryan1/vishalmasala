import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { listBlogs, createBlog, updateBlog, deleteBlog, type BlogPost } from "@/lib/blogs";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

const AdminBlogs = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const loadBlogs = async () => {
    setLoading(true);
    const { data, error } = await listBlogs();
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      setBlogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const sanitizeImageUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)?/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url;
  };

  const handleSave = async () => {
    if (!editingBlog?.title || !editingBlog?.slug || !editingBlog?.content || !editingBlog?.image) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const sanitizedBlog = {
      ...editingBlog,
      image: sanitizeImageUrl(editingBlog.image || "")
    };

    const result = editingBlog._id 
      ? await updateBlog(editingBlog._id, sanitizedBlog)
      : await createBlog(sanitizedBlog);

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Blog post ${editingBlog._id ? "updated" : "created"} successfully.` });
      setShowModal(false);
      setEditingBlog(null);
      loadBlogs();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    
    setLoading(true);
    const { error } = await deleteBlog(id);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Blog post deleted." });
      loadBlogs();
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">Manage Blogs</h1>
            <p className="text-muted-foreground mt-1">Publish spice stories and culinary guides.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => { setEditingBlog({ date: new Date().toLocaleDateString('en-GB'), author: "Vishal Masala Admin" }); setShowModal(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" /> New Post
            </button>
            <button onClick={logout} className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-medium transition-colors">Logout</button>
          </div>
        </div>

        {loading && blogs.length === 0 ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display text-xl text-muted-foreground">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img src={getImageUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingBlog(blog); setShowModal(true); }} className="p-2 bg-white/90 backdrop-blur rounded-lg text-blue-600 shadow-sm"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${blog.isFeatured ? "bg-spice-gold text-spice-brown" : "bg-black/50 text-white"}`}>
                        {blog.isFeatured ? "Featured" : "Standard"}
                     </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{blog.date}</span>
                  <h3 className="font-display text-lg font-bold mt-1 mb-2 line-clamp-1">{blog.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1">{blog.content}</p>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-semibold italic text-muted-foreground">By {blog.author}</span>
                    <button onClick={() => navigate(`/blog/${blog.slug}`)} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                      <Eye className="w-3 h-3" /> View Live
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
            <p className="font-display text-2xl text-muted-foreground">No blog posts yet</p>
            <button 
              onClick={() => { setEditingBlog({ date: new Date().toLocaleDateString(), author: "Vishal Masala Admin" }); setShowModal(true); }}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Write your first article
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-card/80 backdrop-blur border-b border-border p-6 flex justify-between items-center z-10">
              <h2 className="font-display text-2xl font-bold">{editingBlog?._id ? "Edit Article" : "Write Article"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                <input 
                  value={editingBlog?.title || ""} 
                  onChange={e => {
                    const title = e.target.value;
                    setEditingBlog(p => ({ ...p, title, slug: generateSlug(title) }));
                  }}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 ring-primary/20 outline-none transition-all"
                  placeholder="e.g. The Secrets of Granddad's Garam Masala"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Slug</label>
                  <input 
                    value={editingBlog?.slug || ""} 
                    onChange={e => setEditingBlog(p => ({ ...p, slug: e.target.value }))}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-xs focus:ring-2 ring-primary/20 outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Date</label>
                  <input 
                    value={editingBlog?.date || ""} 
                    onChange={e => setEditingBlog(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-xs focus:ring-2 ring-primary/20 outline-none"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Article Imagery</label>
                  {uploading && <span className="text-[10px] font-black text-[#be1e2d] animate-pulse uppercase tracking-[0.2em] transition-all">Waking Server...</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-[#be1e2d] transition-all group overflow-hidden bg-muted/20">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setUploading(true);
                        const formData = new FormData();
                        formData.append("image", file);
                        
                        try {
                          toast({ title: "Connecting to server...", description: "Please wait while we prepare the image processor." });
                          const res = await fetch(`${API_URL}/api/upload`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${user?.token}`,
                            },
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.success) {
                            setEditingBlog(p => ({ ...p, image: data.url }));
                            toast({ title: "Journal Cover Uploaded", description: "Compressed successfully." });
                          } else {
                            throw new Error(data.message);
                          }
                        } catch (err: any) {
                          toast({ title: "Upload Failed", description: "The server is waking up. Please try again in 30 seconds.", variant: "destructive" });
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    {editingBlog?.image ? (
                      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-2">
                        <img src={getImageUrl(editingBlog.image)} className="w-full h-full object-contain mb-2" alt="Preview" />
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingBlog(p => ({ ...p, image: "" })); }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-[#be1e2d] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Plus className="w-6 h-6 text-slate-300 group-hover:text-[#be1e2d] mb-1" />
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-[#be1e2d]">UPLOAD PHOTO</span>
                          </>
                        )}
                      </div>
                    )}
                  </label>

                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Image URL</label>
                    <input 
                      value={editingBlog?.image || ""} 
                      onChange={e => setEditingBlog(p => ({ ...p, image: e.target.value }))}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-xs focus:ring-2 ring-primary/20 outline-none transition-all font-mono"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Content</label>
                <textarea 
                  value={editingBlog?.content || ""} 
                  onChange={e => setEditingBlog(p => ({ ...p, content: e.target.value }))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 h-48 focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Tell your story..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isFeatured"
                  checked={editingBlog?.isFeatured || false}
                  onChange={e => setEditingBlog(p => ({ ...p, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded text-primary border-border"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold cursor-pointer">Feature this post on home page</label>
              </div>

              <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {loading ? "Publishing..." : "Save Article"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminBlogs;
