import { Button, Checkbox, Label, TextInput, Card } from "flowbite-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/Authcontext/Authcontext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("Please fill all fields");
    }
    setError("");
    try {
      await login(form);
      navigate("/humaniw");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9F7] px-4">
      <Card className="w-full max-w-md border border-[#E6ECE6] shadow-sm">
        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-[#1F2A24]">Welcome back</h1>
          <p className="text-sm text-[#6A7A72] mt-1">
            Continue your interview practice journey
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <TextInput
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <TextInput
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              required
            />
          </div>

          {/* REMEMBER */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.remember}
              onChange={(e) =>
                setForm((p) => ({ ...p, remember: e.target.checked }))
              }
            />
            <Label>Remember me</Label>
          </div>

          {/* BUTTON */}
          <Button type="submit" color="success">
            Login
          </Button>
        </form>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm mt-4 text-[#6A7A72]">
          Don’t have an account?
          <Link to="/getstarted" className="text-[#4E9B7A] hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}
