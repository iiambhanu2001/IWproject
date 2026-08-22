import Reactroutes from "./Routes/reactroutes.jsx";

import Header from "./Layout/header.jsx";
import { ThemeInit } from "../.flowbite-react/init";
import { Authprovider } from "./Context/Authcontext/Authcontext.jsx";
import { Sessionprovider } from "./Context/Interviewuserscontext.jsx";

import { Audioprovider } from "./Context/Webrtc/audio.jsx";
function App() {
  return (

  
    <Sessionprovider>

      <Authprovider>
          <Audioprovider> 
       
        <Header />
        <Reactroutes />
         </Audioprovider>
      </Authprovider>
    </Sessionprovider>
  );
}

export default App;
    