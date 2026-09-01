import { createContext, useContext, useEffect, useState } from "react";

//  CreatedContext

const Authcontext = createContext();

export function Authprovider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeUser = async () => {
    try {
      const res = await fetch("/api/auth/getuserinfo", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      
      setUser(data.userinfo);
    } catch (err) {
      setUser(null);
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    storeUser();
  }, []);

  const login = async (form) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",

      body: JSON.stringify(form),
    });

    if (!res.ok) {
      throw new Error("Login Failed!!");
    }

    const data = await res.json();
    await storeUser();
    return data;
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Logout failed");
    }
    const data = await res.json();
    setUser(null);
    return data;
  };

  return (
    <Authcontext.Provider value={{ user, login, logout,loading,setLoading }}>
      {children}
    </Authcontext.Provider>
  );
}

export const useAuth = () => useContext(Authcontext);
