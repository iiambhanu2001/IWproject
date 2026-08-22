import { Button, Checkbox, Label, TextInput, Radio, Card } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [usersign, setusersign] = useState({
    role: "",
    name: "",
    email: "",
    profession: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState("");

  async function sendsignupdata(e) {
    e.preventDefault();

    // VALIDATION
    if (!usersign.role) return setError("Select role (Interviewer or Interviewee)");
    if (usersign.password !== usersign.cpassword)
      return setError("Passwords do not match");
    if (usersign.password.length < 6)
      return setError("Password must be at least 6 characters");

    setError("");

    const res = await fetch("https://iwproject.onrender.com/auth/getstarted", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(usersign),
    });

    if (res.ok) {
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9F7] px-4">

      <Card className="w-full max-w-md shadow-sm border border-[#E6ECE6]">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#1F2A24]">
            Create your Interview Profile
          </h2>
          <p className="text-sm text-[#6A7A72] mt-1">
            Join structured interview practice system
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={sendsignupdata} className="flex flex-col gap-4">

          {/* ROLE */}
          <div className="flex gap-4">
           <label htmlFor="role">Choose your role: </label>
            <div className="flex items-center gap-2">
              <Radio
                id="interviewer"
                name="type"
                value="interviewer"
                checked={usersign.role === "interviewer"}
                onChange={(e) =>
                  setusersign((p) => ({ ...p, role: e.target.value }))
                }
              />
              <Label htmlFor="interviewer">Interviewer</Label>
            </div>

            <div className="flex items-center gap-2">
              <Radio
                id="interviewee"
                name="type"
                value="interviewee"
                checked={usersign.role === "interviewee"}
                onChange={(e) =>
                  setusersign((p) => ({ ...p, role: e.target.value }))
                }
              />
              <Label htmlFor="interviewee">Interviewee</Label>
            </div>

          </div>

          {/* NAME */}
          <TextInput
            placeholder="Your name"
            value={usersign.name}
            onChange={(e) =>
              setusersign((p) => ({ ...p, name: e.target.value }))
            }
            required
          />

          {/* EMAIL */}
          <TextInput
            type="email"
            placeholder="Email"
            value={usersign.email}
            onChange={(e) =>
              setusersign((p) => ({ ...p, email: e.target.value }))
            }
            required
          />

          {/* PROFESSION */}
          <TextInput
            placeholder="Profession (e.g. SDE)"
            value={usersign.profession}
            onChange={(e) =>
              setusersign((p) => ({ ...p, profession: e.target.value }))
            }
            required
          />

          {/* PASSWORD */}
          <TextInput
            type="password"
            placeholder="Password"
            value={usersign.password}
            onChange={(e) =>
              setusersign((p) => ({ ...p, password: e.target.value }))
            }
            required
          />

          {/* CONFIRM PASSWORD */}
          <TextInput
            type="password"
            placeholder="Confirm password"
            value={usersign.cpassword}
            onChange={(e) =>
              setusersign((p) => ({ ...p, cpassword: e.target.value }))
            }
            required
          />

          {/* TERMS */}
          <div className="flex items-center gap-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree" className="text-sm">
              I agree to the terms
            </Label>
          </div>

          {/* BUTTON */}
          <Button type="submit" color="success">
            Create Account
          </Button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-4 text-[#6A7A72]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4E9B7A] hover:underline">
            Login
          </Link>
        </p>

      </Card>
    </div>
  );
}

export default Signup;