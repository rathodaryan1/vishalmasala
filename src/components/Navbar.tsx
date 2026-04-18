import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingCart, User, X, LayoutDashboard } from "lucide-react";
import logo from "@/assets/logo.png";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Offers", href: "/offers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cartCount, wishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?q=${encodeURIComponent(search.trim())}`);
    setSearchOpen(false);
    setSearch("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Vishal Masala" className="h-10 md:h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className="font-body text-sm font-medium text-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 text-foreground hover:text-primary transition-colors"
            title="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
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
        <div className="border-t border-border bg-background">
          <div className="container py-3 flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              placeholder="Search products..."
              className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={handleSearch} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
              Search
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-body text-base font-medium text-foreground hover:text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
