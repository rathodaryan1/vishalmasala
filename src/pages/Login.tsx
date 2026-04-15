import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { user, login, signup } = useAuth();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const redirectPath = searchParams.get("redirect") ?? "/account";

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (isSignup && (!firstName.trim() || !lastName.trim() || !mobile.trim())) {
      setLoading(false);
      toast({ title: "Missing details", description: "Please enter first name, last name, and mobile.", variant: "destructive" });
      return;
    }
    const result = isSignup
      ? await signup({
          email,
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          mobile: mobile.trim(),
        })
      : await login(email, password);
    setLoading(false);
    if (result.error) {
      toast({ title: "Authentication failed", description: result.error, variant: "destructive" });
      return;
    }
    toast({
      title: isSignup ? "Signup successful" : "Login successful",
      description: isSignup ? "Check your email if confirmation is enabled." : "Welcome back.",
    });
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-14">
        <div className="max-w-md mx-auto border border-border rounded-xl p-6">
          <h1 className="font-display text-2xl font-bold mb-1">{isSignup ? "Create account" : "Customer login"}</h1>
          <p className="text-sm text-muted-foreground mb-5">Track orders, manage address, and update your profile.</p>
          <form onSubmit={onSubmit} className="space-y-3">
            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="First name" />
                  <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Last name" />
                </div>
                <input value={mobile} onChange={(event) => setMobile(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Mobile number" />
              </>
            )}
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Email" />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-border rounded-lg px-3 py-2" placeholder="Password" />
            <button disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">
              {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
            </button>
          </form>
          <button onClick={() => setIsSignup((prev) => !prev)} className="w-full mt-3 text-sm text-primary font-semibold">
            {isSignup ? "Already have an account? Login" : "New customer? Create account"}
          </button>
          <Link to="/admin/login" className="block mt-3 text-xs text-muted-foreground hover:text-primary text-center">
            Admin login
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
