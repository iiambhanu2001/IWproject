import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Mic, Video, ArrowRight } from "lucide-react";

function Ivmode() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("text");

  const modes = [
    {
      id: "text",
      title: "Text Interview",
      badge: "Recommended",
      icon: MessageSquare,
      description:
        "Answer interview questions through text chat. Ideal for focused communication and slower connections.",
      requirements: ["Keyboard", "Stable Internet"],
    },
    {
      id: "audio",
      title: "Audio Interview",
      badge: "Popular",
      icon: Mic,
      description:
        "Speak directly with the interviewer using your microphone in a live voice conversation.",
      requirements: ["Microphone", "Stable Internet"],
    },
    {
      id: "video",
      title: "Video Interview",
      badge: "Most Realistic",
      icon: Video,
      description:
        "Experience a face-to-face interview with camera and microphone enabled.",
      requirements: ["Camera", "Microphone", "Stable Internet"],
    },
  ];

  const selected = modes.find((m) => m.id === selectedMode);
  console.log(selected.id);
  const handleContinue = async() => {
   

    switch (selectedMode) {
      case "text":
        navigate("/humaniw");
        break;

      case "audio":
        navigate("/hum/audomode");
        break;

      case "video":
        navigate("/hum/videomode");
        break;

      default:
        navigate("/humaniw");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#DFF3EA] blur-[140px] opacity-40 rounded-full" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-[#E8F1FF] blur-[150px] opacity-40 rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-[#E5ECE8] text-sm text-[#4E9B7A] mb-5">
            Human Interview
          </div>

          <h1 className="text-4xl font-bold text-[#1F2A24]">
            Choose Interview Mode
          </h1>

          <p className="text-[#6B7A71] mt-4 max-w-2xl mx-auto">
            Select how you would like to communicate with your interviewer.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const active = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  text-left
                  p-7
                  rounded-3xl
                  border
                  transition-all
                  duration-300
                  ${
                    active
                      ? "bg-[#EAF5EF] border-[#4E9B7A] shadow-lg scale-[1.02]"
                      : "bg-white border-[#E5ECE8] hover:border-[#4E9B7A] hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      active
                        ? "bg-[#4E9B7A] text-white"
                        : "bg-[#F4F7F5] text-[#4E9B7A]"
                    }`}
                  >
                    <Icon size={28} />
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-[#E5ECE8] text-[#4E9B7A]">
                    {mode.badge}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-[#1F2A24]">
                  {mode.title}
                </h3>

                <p className="text-sm text-[#6B7A71] mt-3 leading-6">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Details Panel */}
        <div className="mt-10 bg-white border border-[#E5ECE8] rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#EAF5EF] flex items-center justify-center">
              {(() => {
                const Icon = selected.icon;
                return <Icon size={22} className="text-[#4E9B7A]" />;
              })()}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#1F2A24]">
                {selected.title}
              </h2>

              <p className="text-sm text-[#6B7A71]">Requirements and details</p>
            </div>
          </div>

          <p className="text-[#55635B] leading-7 mb-6">
            {selected.description}
          </p>

          <div>
            <h3 className="font-medium text-[#1F2A24] mb-3">Requirements</h3>

            <div className="flex flex-wrap gap-3">
              {selected.requirements.map((req) => (
                <span
                  key={req}
                  className="px-4 py-2 rounded-xl bg-[#F6FAF8] border border-[#E5ECE8] text-sm text-[#55635B]"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#4E9B7A] text-white font-medium shadow-lg hover:bg-[#3F8063] transition-all duration-200"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ivmode;
