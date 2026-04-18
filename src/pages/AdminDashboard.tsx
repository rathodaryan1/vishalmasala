import { LayoutDashboard, ShoppingBag, ClipboardList, BookOpen, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { listProducts } from "@/lib/products";
import { listOrders } from "@/lib/orders";
import { listBlogs } from "@/lib/blogs";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    blogs: 0,
    revenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [prodRes, orderRes, blogRes] = await Promise.all([
        listProducts(),
        listOrders(),
        listBlogs()
      ]);

      setStats({
        products: prodRes.data?.length || 0,
        orders: orderRes.data?.length || 0,
        blogs: blogRes.data?.length || 0,
        revenue: orderRes.data?.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0) || 0,
        pendingOrders: orderRes.data?.filter((o: any) => o.status === 'pending').length || 0
      });
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Products",
      description: "Manage your spices catalog, pricing, and stock.",
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      link: "/admin/products",
      count: `${stats.products} Items`,
    },
    {
      title: "Categories",
      description: "Manage spice types and update high-quality category images.",
      icon: <LayoutDashboard className="w-8 h-8 text-[#be1e2d]" />,
      link: "/admin/categories",
      count: `Configure Range`,
    },
    {
      title: "Orders",
      description: "Track sales, update shipping status, and view customers.",
      icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
      link: "/admin/orders",
      count: `${stats.orders} Total`,
    },
    {
      title: "Blogs",
      description: "Write and manage spice stories, tips, and kitchen guides.",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      link: "/admin/blogs",
      count: `${stats.blogs} Posts`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700">
              <LayoutDashboard className="w-10 h-10 text-primary" /> Admin Portal
            </h1>
            <p className="text-muted-foreground mt-2 text-lg animate-in fade-in slide-in-from-left duration-1000 delay-200">Central hub for managing Vishal Masala stores.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold transition-colors group shadow-sm hover:shadow-md"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <Link 
              key={card.title} 
              to={card.link}
              className={`group relative bg-card border border-border rounded-4xl p-8 hover:shadow-3xl hover:translate-y-[-4px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-5 duration-700`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:rotate-6 transition-all duration-500">
                {card.icon}
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 h-12">{card.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-primary px-4 py-1.5 bg-primary/10 rounded-full">
                  {card.count}
                </span>
                <span className="text-primary font-bold group-hover:translate-x-2 transition-transform">Manage Portal →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-10 bg-muted/30 border border-border rounded-4xl backdrop-blur-sm shadow-inner animate-in fade-in zoom-in-95 duration-1000">
          <h2 className="font-display text-2xl font-bold mb-8">Business Insights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gross Revenue</p>
              <p className="text-3xl font-display font-bold text-primary">₹ {stats.revenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending Orders</p>
              <p className="text-3xl font-display font-bold text-orange-600 font-mono">{stats.pendingOrders}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live Inventory</p>
              <p className="text-3xl font-display font-bold text-foreground font-mono">{stats.products}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Content Assets</p>
              <p className="text-3xl font-display font-bold text-foreground font-mono">{stats.blogs}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
