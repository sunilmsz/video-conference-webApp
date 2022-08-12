
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import LogIn from "./components/LogIn";

import Video3 from "./Pages/Video3"
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./Pages/Dashboard"
import Register from "./Pages/Register";
import {BrowserRouter as Router,Switch,Route,Link,Routes} from 'react-router-dom'
import "./App.css"

function App() {

  document.title ="SK Meet "

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
 
    </Routes>
  </Router>
   </>
  );
}

export default App;
