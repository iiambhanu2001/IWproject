import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Candidate() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [interviewees, setInterviewees] = useState([]);

  useEffect(() => {
    async function fetchinterviewee() {
      try {
        const res = await fetch("/api/api/sessions", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json(); 
        console.log(data)
        
        setInterviewees(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }

    fetchinterviewee();
  }, [loading]);

  function Navigatetomode(mode,sessionid){
    if(mode==="audio"){
navigate(`/startinterview/sessioniwaudio/${sessionid}`)
    }
    else if(mode==="video"){
navigate(`/startinterview/sessioniwvideo/${sessionid}`)
    }
    else {
navigate(`/startinterview/sessioniw/${sessionid}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#1F2A24] px-6 py-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Select Candidate</h1>
        <p className="text-sm text-[#5C6B63]">
          Choose a candidate to start the interview session.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-sm text-[#7A8A80]">Loading candidates...</p>
        ) : interviewees.length === 0 ? (
          <p className="text-sm text-[#7A8A80]">No candidates found.</p>
        ) : (
          <div className="space-y-3">
            {interviewees.map((user) => (
              <div
                key={user._id}
                onClick={() =>
                  Navigatetomode(user.ivmode,user.sessionid)
                }
                className="flex items-center justify-between bg-white border border-[#E6ECE6] rounded-xl p-4 hover:shadow-sm hover:border-[#cfe0d7] cursor-pointer transition"
              >
                {/* Left side */}
                <div>
                  <p className="font-medium">{user.username || "Unnamed User"}</p>
                  <p className="text-xs text-[#7A8A80]">
                    {user.useremail || "No email provided"}
                  </p>
                    <p className="text-xs text-[#7A8A80]">
                    {user.ivmode || "text"}
                  </p>
                </div>

                {/* Right side badge */}
                <div className="text-xs px-3 py-1 rounded-full bg-[#EEF6F1] text-[#4E9B7A]">
                  Ready
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidate;
