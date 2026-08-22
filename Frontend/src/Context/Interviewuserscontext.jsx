import { createContext, useContext, useState } from "react";

// contextname

const Sessiondatacontext = createContext();

export function Sessionprovider({ children }) {
  const [sessionData, setsessionData] = useState({});
  const [allsessionsData, setallsessionData] = useState({});

  const Humanquemode = async (sessionid) => {
    const res = await fetch(`https://iwproject1.onrender.com/api/session/${sessionid}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setsessionData(data);
    return data;
  };
  // for interviewer..
  const endsessionfeedback = async (payload, sessionid) => {
    try {
      const res = await fetch(
        `https://iwproject1.onrender.com/api/interview/feedback/${sessionid}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const sessionbyuserIds = async () => {
    const res = await fetch("https://iwproject1.onrender.com/api/sessionsdata", {
      method: "GET",
      credentials: "include",
    });
    if (res) {
      const data = await res.json();

      setallsessionData(data);
      return data;
    }
  };

  const checkinglastseen = async (sessionid) => {
    const res = await fetch(`https://iwproject1.onrender.com/api/lastseenAt/${sessionid}`, {
      method: "GET",
      credentials: "include",
    });
    if (res) {
      const data = await res.json();
      return data;
    }
  };

  return (
    <Sessiondatacontext.Provider
      value={{
        Humanquemode,
        sessionData,
        setsessionData,
        endsessionfeedback,
        allsessionsData,
        setallsessionData,
        sessionbyuserIds,
        checkinglastseen,
      }}
    >
      {children}
    </Sessiondatacontext.Provider>
  );
}

export const useSessiondata = () => useContext(Sessiondatacontext);
