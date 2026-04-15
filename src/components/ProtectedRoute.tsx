import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return <div className="container py-16 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-3xl font-bold mb-2">Unauthorized</h1>
        <p className="text-muted-foreground">This page is only for admin users.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
