import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { listProducts, createProduct, updateProduct, deleteProduct, type Product, type ProductVariant } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { useShop } from "@/context/ShopContext";

const AdminProducts = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { refreshProducts } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data.map((c: any) => c.name));
      }
    } catch (err) {
      console.error("Failed to load categories for dropdown");
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await listProducts();
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  const sanitizeImageUrl = (url: string) => {
    if (!url) return "";
    
    // Robust Google Drive ID extraction
    // Matches formats: /file/d/ID/..., ?id=ID, /d/ID/...
    const driveRegex = /(?:d\/|id=|file\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(driveRegex);
    
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    
    return url;
  };

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct?.category || !editingProduct?.variants?.length) {
      toast({ title: "Validation Error", description: "Please fill required fields and add at least one variant.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const sanitizedProduct = {
      ...editingProduct,
      image: sanitizeImageUrl(editingProduct.image || "")
    };

    const result = editingProduct.id 
      ? await updateProduct(editingProduct.id, sanitizedProduct)
      : await createProduct(sanitizedProduct);

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Product ${editingProduct.id ? "updated" : "created"} successfully.` });
      setShowModal(false);
      setEditingProduct(null);
      loadProducts();
      refreshProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    const { error } = await deleteProduct(id);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Product deleted." });
      loadProducts();
      refreshProducts();
    }
    setLoading(false);
  };

  const addVariant = () => {
    const variants = [...(editingProduct?.variants || []), { weight: "1KG", price: 0, originalPrice: 0 }];
    setEditingProduct(prev => ({ ...prev, variants }));
  };

  const removeVariant = (index: number) => {
    const variants = editingProduct?.variants?.filter((_, i) => i !== index);
    setEditingProduct(prev => ({ ...prev, variants }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold">Manage Products</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or remove products from the catalog.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => { setEditingProduct({ highlights: [], variants: [] }); setShowModal(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" /> Add Product
            </button>
            <button onClick={logout} className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors">Logout</button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display text-xl text-muted-foreground">Loading catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 bg-muted/50 p-6">
                  <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`/products/${product.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-white/90 backdrop-blur rounded-lg text-emerald-600 shadow-sm hover:bg-emerald-50"
                      title="View on Store"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button onClick={() => { setEditingProduct(product); setShowModal(true); }} className="p-2 bg-white/90 backdrop-blur rounded-lg text-blue-600 shadow-sm hover:bg-blue-50" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 shadow-sm hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">{product.category}</span>
                    <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[100px]" title={product.image}>{product.image.split('/').pop()}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold truncate mt-1">{product.name}</h3>
                  <div className="mt-2 p-1.5 bg-muted/30 rounded text-[10px] text-muted-foreground font-mono truncate">
                    URL: {product.image}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">₹ {product.variants[0]?.price}</span>
                    <span className="text-xs text-muted-foreground">{product.variants.length} variants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
            <p className="font-display text-2xl text-muted-foreground">Catalog is empty</p>
            <button 
              onClick={() => { setEditingProduct({ highlights: [], variants: [] }); setShowModal(true); }}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Start by adding your first product
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-card/80 backdrop-blur border-b border-border p-6 flex justify-between items-center z-10">
              <h2 className="font-display text-2xl font-bold">{editingProduct?.id ? "Edit Spices" : "Add New Spices"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Product Name</label>
                  <input 
                    value={editingProduct?.name || ""} 
                    onChange={e => setEditingProduct(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Kashmiri Chilli Powder"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                  <select 
                    value={editingProduct?.category || ""} 
                    onChange={e => setEditingProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Media Manager</label>
                  {loading && <span className="text-[10px] font-black text-[#be1e2d] animate-pulse">PROCESSING...</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Area */}
                  <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-[#be1e2d] hover:bg-white transition-all group overflow-hidden">
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
                          // Show toast for cold start awareness
                          toast({ title: "Connecting to server...", description: "Please wait while we wake up the image processor. This may take a minute on initial upload." });
                          
                          const res = await fetch(`${API_URL}/api/upload`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${user?.token}`,
                            },
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.success) {
                            setEditingProduct(p => ({ ...p, image: data.url }));
                            toast({ title: "Image Uploaded", description: "Compressed successfully (WebP)" });
                          } else {
                            throw new Error(data.message);
                          }
                        } catch (err: any) {
                          toast({ title: "Upload Failed", description: "The server took too long to respond. Please try again in 30 seconds as the server is now waking up.", variant: "destructive" });
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center">
                      {uploading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-[#be1e2d] border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-[10px] font-black text-[#be1e2d] animate-pulse">WAKING SERVER...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 text-slate-300 group-hover:text-[#be1e2d] mb-2" />
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-[#be1e2d]">UPLOAD PHOTO</span>
                        </>
                      )}
                    </div>
                    {editingProduct?.image && (
                      <div className="absolute inset-0 bg-white">
                        <img src={getImageUrl(editingProduct.image)} className="w-full h-full object-contain p-2" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black text-white px-2 py-1 border border-white rounded">CHANGE PHOTO</span>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Manual URL Input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 ml-1">Or Paste URL</label>
                    <input 
                      value={editingProduct?.image || ""} 
                      onChange={e => setEditingProduct(p => ({ ...p, image: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all font-mono text-[10px]"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-[9px] text-slate-400 italic px-1">Supports Google Drive links.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Short Description</label>
                <textarea 
                  value={editingProduct?.description || ""} 
                  onChange={e => setEditingProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 h-20 focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Appears on product cards..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Long Description</label>
                <textarea 
                  value={editingProduct?.longDescription || ""} 
                  onChange={e => setEditingProduct(p => ({ ...p, longDescription: e.target.value }))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 h-32 focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Detailed description for the product page..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Highlights</label>
                  <button 
                    onClick={() => setEditingProduct(p => ({ ...p, highlights: [...(p?.highlights || []), ""] }))}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    + Add Highlight
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct?.highlights?.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        value={h} 
                        onChange={e => {
                          const highlights = [...(editingProduct.highlights || [])];
                          highlights[i] = e.target.value;
                          setEditingProduct(p => ({ ...p, highlights }));
                        }}
                        className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-primary/20 outline-none"
                        placeholder="e.g. 100% Pure & Traditional"
                      />
                      <button 
                        onClick={() => setEditingProduct(p => ({ ...p, highlights: p?.highlights?.filter((_, idx) => idx !== i) }))}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Variants & Pricing</label>
                  <div className="flex flex-wrap gap-2">
                    {["100g", "200g", "500g", "1kg"].map(w => (
                      <button 
                        key={w}
                        onClick={() => {
                          const variants = [...(editingProduct?.variants || [])];
                          if (!variants.some(v => v.weight.toLowerCase() === w.toLowerCase())) {
                            variants.push({ weight: w, price: 0, originalPrice: 0 });
                            setEditingProduct(p => ({ ...p, variants }));
                          }
                        }}
                        className="text-[10px] font-bold px-2 py-1 bg-muted hover:bg-primary/10 hover:text-primary rounded-md transition-colors border border-border"
                      >
                        + {w}
                      </button>
                    ))}
                    <button onClick={addVariant} className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all font-display">+ Custom</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {editingProduct?.variants?.map((v, i) => (
                    <div key={i} className="flex gap-3 items-end bg-muted/20 p-4 rounded-2xl border border-border">
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground">Weight</span>
                        <input value={v.weight} onChange={e => {
                          const variants = [...(editingProduct.variants || [])];
                          variants[i].weight = e.target.value;
                          setEditingProduct(p => ({ ...p, variants }));
                        }} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground">Original (₹)</span>
                        <input type="number" value={v.originalPrice} onChange={e => {
                          const val = Number(e.target.value);
                          const variants = [...(editingProduct.variants || [])];
                          variants[i].originalPrice = val;
                          setEditingProduct(p => ({ ...p, variants }));
                        }} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-primary">Off %</span>
                        <input type="number" placeholder="%" onChange={e => {
                          const off = Number(e.target.value);
                          if (off >= 0 && off <= 100) {
                            const variants = [...(editingProduct.variants || [])];
                            const original = variants[i].originalPrice || 0;
                            variants[i].price = Math.round(original * (1 - off / 100));
                            setEditingProduct(p => ({ ...p, variants }));
                          }
                        }} className="w-full bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-sm text-primary font-bold" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground">Final Price (₹)</span>
                        <input type="number" value={v.price} onChange={e => {
                          const variants = [...(editingProduct.variants || [])];
                          variants[i].price = Number(e.target.value);
                          setEditingProduct(p => ({ ...p, variants }));
                        }} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-emerald-600" />
                      </div>
                      <button onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSave} 
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-transform disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {loading ? "Saving Spices..." : "Save Product Details"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminProducts;
