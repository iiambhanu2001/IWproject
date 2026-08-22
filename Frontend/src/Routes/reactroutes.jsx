import { Routes, Route } from "react-router-dom";
import Humaniw from "../Humanmode/Humaniw.jsx";
import Aiiw from "../AImode/Aiiw.jsx";
import Iw from "../iw.jsx";
import Interviewer from "../Interviewer/Interviewer.jsx";

import Signup from "../Auth/Signup.jsx";
import Login from "../Auth/Login.jsx";
import Logout from "../Auth/Logout.jsx";

import Protectedroutes from "./Protectedroutes.jsx";
import { useAuth } from "../Context/Authcontext/Authcontext.jsx";
import Candidate from "../Interviewer/Candidates.jsx";
import InterviewPage from "../Interviewer/Interviewpage.jsx";

import Feedback from "../Interviewer/feedback.jsx";
import Result from "../Humanmode/Result.jsx";
import Dashboard from "../Humanmode/Dashboardhum.jsx";
import Unauthorized from "../Errorpages/Errorunauth.jsx";
import Error404 from "../Errorpages/Error404.jsx";
import Dasboardiv from "../Interviewer/Dashboardiw.jsx";
import Archivechats from "../Humanmode/Archivechats.jsx";

import Aifeedbackrslt from "../AImode/Aifeedbackrslt.jsx"
import Ivmode from "../Humanmode/Ivmode.jsx"
import Audiomode from "../Humanmode/Audiomode.jsx";
import Videomode from "../Humanmode/Videomode.jsx";

import Interviewervideo from "../Interviewer/Interviewervideo.jsx"
import Intervieweraudio from "../Interviewer/Intervieweraudio.jsx"
function Reactroutes() {
  const { user } = useAuth();
  console.log(user);
  return (
    <>
      <Routes>
        <Route path="/" element={<Iw />} />

        {/* <Route path="/logout" element={<Logout />} /> */}
        {!user ? (
          <>
        
            <Route path="/login" element={<Login />} />
            <Route path="/getstarted" element={<Signup />} />{" "}
          </>
        ) : (
          <Route path="/logout" element={<Logout />} />
        )}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/getstarted" element={<Signup />} /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Error404 />} />

        {/* PROTECTED ROUTES */}
        <Route element={<Protectedroutes />}>
          <Route path="/reviewsession/:sessionid" element={<Archivechats />} />
            <Route
            path="/interview/session/result/:sessionid"
            element={<Result />}
          />
        </Route>

        <Route element={<Protectedroutes allowedroles={["interviewee"]} />}>
          <Route path="/aiiw" element={<Aiiw />} />
          <Route path="/ivmode" element={<Ivmode />} />
          
          <Route path="/humaniw" element={<Humaniw />} />
          <Route path="/hum/audomode" element={<Audiomode />} />
           <Route path="/hum/videomode" element={<Videomode />} />

          {/* <Route
            path="/interview/session/result/:sessionid"
            element={<Result />}
          /> */}
          <Route path="/aiiw/session/:sessionid" element={<Aiiw />} />
          <Route
            path="/startinterview/session/:sessionid"
            element={<Humaniw />}
          />
           <Route
            path="/startinterview/audiomode/session/:sessionid"
            element={<Audiomode />}
          />
           <Route
            path="/startinterview/videomode/session/:sessionid"
            element={<Videomode />}
          />
          <Route path="/result/:sessionid" element={<Aifeedbackrslt/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<Protectedroutes allowedroles={["interviewer"]} />}>
          <Route path="/adminsendque" element={<Interviewer />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route
            path="/startinterview/sessioniw/:sessionid"
            element={<InterviewPage />}
          />
           <Route
            path="/startinterview/sessioniwaudio/:sessionid"
            element={<Intervieweraudio />}
          />
           <Route
            path="/startinterview/sessioniwvideo/:sessionid"
            element={<Interviewervideo />}
          />
          <Route path="/iv/dashboard" element={<Dasboardiv />} />
          <Route path="/interview/feedback/:sessionid" element={<Feedback />} />
        </Route>
      </Routes>
    </>
  );
}

export default Reactroutes;
