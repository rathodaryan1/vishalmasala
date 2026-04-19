import { useState } from "react";
import { Grid2X2, Grid3X3, List, ChevronDown } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

const Products = () => {
  const { products, loadingProducts } = useShop();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(["All", ...data.map((c: any) => c.name)]);
        }
      });
  }, []);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);
  const [sortBy, setSortBy] = useState("Featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showSort, setShowSort] = useState(false);

  const filteredByCategory =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const filtered = searchQuery
    ? filteredByCategory.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
      )
    : filteredByCategory;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.variants[0].price - b.variants[0].price;
    if (sortBy === "Price: High to Low") return b.variants[0].price - a.variants[0].price;
    return 0;
  });

  const gridClass =
    gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridCols === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="container py-6">
        {/* Breadcrumbs */}
        <nav className="flex text-xs font-medium text-slate-500 mb-6 px-1">
          <Link to="/" className="hover:text-primary transition-colors font-bold uppercase tracking-widest">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-bold uppercase tracking-widest">{selectedCategory}</span>
        </nav>

        {/* Category Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
          <div className="container py-12 md:py-16 text-center max-w-5xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-[#be1e2d] mb-4">
              {selectedCategory === "All" ? "Our Collection" : selectedCategory}
            </h1>
            <p className="font-display text-2xl font-bold text-slate-800 mb-6">
              Savour the love, delight your senses!
            </p>
            <div className="w-16 h-1 bg-[#be1e2d] mx-auto mb-8"></div>
            <p className="font-body text-base text-slate-600 leading-relaxed max-w-4xl mx-auto px-4">
              Delight your senses with Vishal Masala's finest spices, where each blend is made with care. 
              Savour the love in every bite and enjoy the promise of flavour, quality, and authenticity. 
              The {selectedCategory.toLowerCase()} spices that we provide especially for Indian kitchens include 
              Turmeric Powder, Red Chilli Powder, Garam Masala, Coriander Powder, Cumin Powder, and more, 
              crafted to bring heritage and taste to your daily cooking.
            </p>
            {searchQuery && (
              <p className="mt-6 text-sm text-[#be1e2d] font-bold tracking-wide uppercase px-4 py-2 bg-[#be1e2d]/5 rounded-full inline-block animate-in fade-in zoom-in">
                Search results for: "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Unified Category Tabs & Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 mb-8 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40">
           <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? "bg-[#be1e2d] text-white shadow-md shadow-red-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-6 px-4 border-l border-slate-100">
             <div className="flex items-center gap-1.5 border-r border-slate-100 pr-4 mr-2 hidden lg:flex">
                <button onClick={() => setGridCols(2)} className={`p-2 rounded-lg transition-colors ${gridCols === 2 ? "bg-slate-100 text-[#be1e2d]" : "text-slate-400 hover:text-slate-600"}`}><Grid2X2 className="w-4 h-4" /></button>
                <button onClick={() => setGridCols(3)} className={`p-2 rounded-lg transition-colors ${gridCols === 3 ? "bg-slate-100 text-[#be1e2d]" : "text-slate-400 hover:text-slate-600"}`}><Grid3X3 className="w-4 h-4" /></button>
                <button onClick={() => setGridCols(4)} className={`p-2 rounded-lg transition-colors ${gridCols === 4 ? "bg-slate-100 text-[#be1e2d]" : "text-slate-400 hover:text-slate-600"}`}><List className="w-4 h-4" /></button>
             </div>

             <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-700 hover:text-[#be1e2d] transition-colors"
                >
                  Sort by: <span className="text-[#be1e2d]">{sortBy}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`} />
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-3 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 min-w-[220px] p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSort(false); }}
                        className={`block w-full text-left px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${
                          sortBy === opt ? "bg-[#be1e2d] text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="py-2">
          {loadingProducts ? (
            <div className="text-center py-32">
              <div className="w-12 h-12 border-4 border-[#be1e2d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-display text-xl text-slate-400 animate-pulse font-bold">Summoning your spices...</p>
            </div>
          ) : (
            <>
              <div className={`grid ${gridClass} gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {sorted.length === 0 && (
                <div className="text-center py-32 bg-white border border-slate-200 rounded-3xl animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <List className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-display text-3xl text-slate-800 font-bold mb-3">No products found</p>
                  <p className="font-body text-slate-500 max-w-sm mx-auto font-medium">
                    We couldn't find any spices in this category. Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
