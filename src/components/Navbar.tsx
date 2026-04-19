import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingCart, User, X, LayoutDashboard, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { cartCount, wishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Nav Categories Error:", err));
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?q=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
    setSearch("");
  };

  const openSearch = () => {
    if (window.innerWidth < 768) {
      navigate("/search");
    } else {
      setSearchOpen(!searchOpen);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Vishal Masala" className="h-10 md:h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">Home</Link>
          <div className="relative group h-20 flex items-center">
            <button className="flex items-center gap-1 font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">
              Our Spices <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 min-w-[240px] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
              <div className="grid gap-1">
                {categories.length > 0 ? categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest text-slate-600 hover:text-[#be1e2d] transition-all"
                  >
                    {cat.name}
                  </Link>
                )) : (
                  <Link to="/products" className="px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest text-slate-600">Browse All</Link>
                )}
              </div>
            </div>
          </div>
          <Link to="/about" className="font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">About Us</Link>
          <Link to="/offers" className="font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">Offers</Link>
          <Link to="/blog" className="font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">Blog</Link>
          <Link to="/contact" className="font-body text-sm font-bold text-foreground hover:text-primary transition-all uppercase tracking-widest">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 text-foreground hover:text-primary transition-colors"
            title="Search"
            onClick={openSearch}
          >
            <Search className="w-5 h-5" />
          </button>
          <Link to={user ? "/account" : "/login"} className="p-2 text-foreground hover:text-primary transition-colors" title="Account">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors" title="Wishlist">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" title="Cart">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-md">
              <LayoutDashboard className="w-4 h-4" /> Admin Portal
            </Link>
          )}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="container py-6">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for spices, blends, or recipes..."
                className="w-full h-16 pl-16 pr-6 bg-slate-50 border-2 border-transparent focus:border-[#be1e2d]/20 focus:bg-white rounded-2xl outline-none font-display text-xl font-bold text-slate-800 transition-all shadow-inner"
              />
              {search && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 z-[100] animate-in fade-in zoom-in-95">
                   <div className="grid gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#be1e2d]">Quick Results</p>
                      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {search.length > 2 && products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5).map(p => (
                          <Link 
                            key={p.id} 
                            to={`/products/${p.id}`} 
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                          >
                            <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                               <img src={getImageUrl(p.image)} className="w-full h-full object-contain p-2" alt={p.name} />
                            </div>
                            <div>
                               <p className="font-bold text-slate-800 group-hover:text-[#be1e2d] transition-colors">{p.name}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.category}</p>
                            </div>
                          </Link>
                        ))}
                        {search.length > 2 && products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                          <p className="py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No spices found for "{search}"</p>
                        )}
                        {search.length <= 2 && (
                          <p className="py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Keep typing to see results...</p>
                        )}
                      </div>
                      <button 
                        onClick={handleSearch}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#be1e2d] transition-all"
                      >
                        View All Results
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
          <div className="container py-6 flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 px-4">Home</Link>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#be1e2d] px-4 mb-3">Categories</p>
              <div className="grid gap-1 px-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="px-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 active:bg-red-50 active:text-[#be1e2d]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-4">
              <Link to="/offers" onClick={() => setMobileOpen(false)} className="block px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Offers</Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="block px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Blog</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Contact</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
