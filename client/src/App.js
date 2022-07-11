
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import LogIn from "./components/LogIn";
import Video from "./Pages/Video";
import Video3 from "./Pages/Video3"
import {default as MyVideo}  from "./components/Video";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Screenshare from "./components/Screenshare";
import Dashboard from "./Pages/Dashboard"
import Register from "./Pages/Register";
import {BrowserRouter as Router,Switch,Route,Link,Routes} from 'react-router-dom'
import "./App.css"

function App() {
  return (
   <>

<Router>
    <Routes>
      <Route path="/" exact element={<LogIn />}/>
      <Route path="/dashboard" exact element={<Dashboard />}/>
      <Route path="/register" exact element={<Register/>} />
      <Route exact path="/video/:roomId"  element={<Video3/>} />
      <Route path="/:userId/users/ev/:randomSt" element={ < VerifyEmail />} />
      <Route path="/user/forgotPassword" element={<ForgotPassword />} />
      <Route path="/:userId/users/rp/:randomSt" element={ < ResetPassword />} />
      <Route path="/video" element = {< MyVideo />} />
      <Route exact path="/video/video"  element={<Video/>} />
      <Route exact path="/video/screen"  element={<Screenshare/>} />
    </Routes>
  </Router>
   </>
  );
}

export default App;
