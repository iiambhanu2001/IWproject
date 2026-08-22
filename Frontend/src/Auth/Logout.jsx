import React from "react";
import { useAuth } from "../Context/Authcontext/Authcontext";

import { Navigate } from "react-router-dom";
function logout() {
  const { logout } = useAuth();

  logout();

  return (
    <div>
      return <Navigate to="/login" replace />;
    </div>
  );
}

export default logout;
