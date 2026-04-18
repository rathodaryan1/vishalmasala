import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { user, isAdmin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

    if (user && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back", description: "Admin access granted." });
    navigate("/admin/orders");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-14">
        <div className="max-w-md mx-auto border border-border rounded-xl p-6">
          <h1 className="font-display text-2xl font-bold mb-1">Admin Login</h1>
          <p className="text-sm text-muted-foreground mb-5">Login with your administrator credentials.</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Admin email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Password" />
            <button disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
