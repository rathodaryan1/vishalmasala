import { useState, useEffect } from "react";
import { Search as SearchIcon, X, ArrowLeft, TrendingUp, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Search = () => {
  const navigate = useNavigate();
  const { products, loadingProducts } = useShop();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const trendingSpices = ["Garam Masala", "Turmeric", "Chili Powder", "Coriander", "Achar Masala"];

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, products]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container py-6 px-4">
        {/* Mobile Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#be1e2d] transition-colors" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="What spice are you looking for?"
              className="w-full h-14 pl-12 pr-12 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-medium text-slate-800 transition-all shadow-sm"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        {query ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="font-display text-xl font-bold text-slate-800">
                {results.length > 0 ? `Found ${results.length} results` : "No results found"}
              </h2>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest px-6">
                  We couldn't find "{query}". Try searching for something else!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 hover:border-[#be1e2d] hover:text-[#be1e2d] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Spices */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-1">
                <TrendingUp className="w-4 h-4 text-[#be1e2d]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Trending Now</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trendingSpices.map((spice) => (
                  <button
                    key={spice}
                    onClick={() => handleSearch(spice)}
                    className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#be1e2d]/30 hover:shadow-lg transition-all text-left group"
                  >
                    <span className="flex-1 text-sm font-bold text-slate-700 group-hover:text-[#be1e2d]">{spice}</span>
                    <SearchIcon className="w-4 h-4 text-slate-300 group-hover:text-[#be1e2d] group-hover:scale-110 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {["Blended Spices", "Whole Spices", "Ground Spices", "Achar Masala"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                    className="h-24 flex items-center justify-center p-4 bg-slate-900 rounded-2xl text-white font-display text-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
