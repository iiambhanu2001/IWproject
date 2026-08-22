
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Authcontext/Authcontext";


function Protectedroutes({allowedroles}) {
 const { user,loading } = useAuth();

if(loading) return <div>...loading!! please wait!!1</div>
  if (!user) return <Navigate to={"/login"} replace /> ;

  if(allowedroles && !allowedroles.includes(user.role)) return <Navigate to={"/unauthorized"} replace />;
  
    

  return <Outlet />;
}

export default Protectedroutes;
