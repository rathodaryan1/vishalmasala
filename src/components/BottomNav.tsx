import { Home, ShoppingBag, ShoppingCart, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "@/context/ShopContext";

const BottomNav = () => {
  const location = useLocation();
  const { cartItems } = useShop();
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Shop", path: "/products" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: User, label: "Profile", path: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
      {/* Curved Center Button Background */}
      <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-[0_-8px_20px_rgba(0,0,0,0.05)] border-t border-slate-50" />
      
      {/* Navigation Bar */}
      <div className="relative bg-white border-t border-slate-100 h-16 px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-[#be1e2d]" : "text-slate-400"}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Cart-FAB Style Button */}
        <div className="relative -top-3">
          <Link to="/cart" className="w-14 h-14 bg-[#be1e2d] rounded-full flex items-center justify-center text-white shadow-xl shadow-red-200 active:scale-95 transition-transform">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#facc15] text-[#78350f] text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-[#be1e2d]" : "text-slate-400"}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
