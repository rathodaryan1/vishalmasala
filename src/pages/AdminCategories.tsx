import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useShop } from "@/context/ShopContext";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

const AdminCategories = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const sanitizeImageUrl = (url: string) => {
    if (!url) return "";
    const driveRegex = /(?:d\/|id=|file\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const handleSave = async () => {
    if (!editingCategory?.name || !editingCategory?.image) {
      toast({ title: "Error", description: "Missing name or image.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const sanitizedCategory = {
        ...editingCategory,
        image: sanitizeImageUrl(editingCategory.image || "")
      };

      const method = editingCategory._id ? "PUT" : "POST";
      const url = editingCategory._id 
        ? `${API_URL}/api/categories/${editingCategory._id}` 
        : `${API_URL}/api/categories`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(sanitizedCategory),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Success", description: "Category saved successfully." });
      setShowModal(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category? Products using it won't be deleted but might have breadcrumb issues.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      toast({ title: "Success", description: "Category removed." });
      loadCategories();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black font-display text-slate-800">Spice Categories</h1>
          <div className="flex gap-3">
             <button onClick={() => { setEditingCategory({}); setShowModal(true); }} className="px-6 py-2.5 bg-[#be1e2d] text-white rounded-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Category
             </button>
             <button onClick={logout} className="px-5 py-2.5 rounded-xl border border-border">Logout</button>
          </div>
        </div>

        {loading && categories.length === 0 ? (
          <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Organizing your spices...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 hover:shadow-2xl transition-all group">
                <div className="aspect-square rounded-2xl bg-slate-50 mb-6 overflow-hidden relative">
                   <img src={cat.image} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                </div>
                <h3 className="font-display text-xl font-black text-[#1e1b4b] mb-4 uppercase tracking-tight">{cat.name}</h3>
                <div className="flex gap-2">
                   <button onClick={() => { setEditingCategory(cat); setShowModal(true); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#be1e2d] hover:text-white transition-all">Edit</button>
                   <button onClick={() => handleDelete(cat._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black font-display mb-6">{editingCategory?._id ? "Edit Category" : "New Category"}</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
                <input 
                  value={editingCategory?.name || ""} 
                  onChange={e => setEditingCategory(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 ring-red-100 outline-none transition-all"
                  placeholder="e.g. BLENDED SPICES"
                />
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Media Manager</label>
                  {loading && <span className="text-[10px] font-black text-[#be1e2d] animate-pulse">PROCESSING...</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#be1e2d] transition-all overflow-hidden relative group">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setLoading(true);
                        const formData = new FormData();
                        formData.append("image", file);
                        try {
                          const res = await fetch(`${API_URL}/api/upload`, {
                            method: "POST",
                            headers: { Authorization: `Bearer ${user?.token}` },
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.success) setEditingCategory(p => ({ ...p, image: data.url }));
                        } catch (err) {
                           toast({ title: "Upload Failed", variant: "destructive" });
                        }
                        setLoading(false);
                      }} 
                    />
                    {editingCategory?.image ? (
                        <>
                          <img src={editingCategory.image} className="w-full h-full object-contain p-2" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black text-white px-2 py-1 border border-white rounded uppercase tracking-widest">Change</span>
                          </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-300">
                           <Upload className="w-6 h-6 mb-1" />
                           <span className="text-[8px] font-black uppercase tracking-widest">Upload Photo</span>
                        </div>
                    )}
                  </label>
                  
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-[9px] font-bold text-slate-400 ml-1">OR PASTE IMAGE URL</label>
                    <input 
                      value={editingCategory?.image || ""} 
                      onChange={e => setEditingCategory(p => ({ ...p, image: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-mono focus:ring-2 ring-red-100 outline-none transition-all"
                      placeholder="https://drive.google.com/..."
                    />
                    <p className="text-[8px] text-slate-400 italic px-1">Supports Google Drive direct links.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full py-5 bg-[#be1e2d] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-100 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? "SAVING..." : "SAVE CATEGORY"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminCategories;
