import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from './pages/UserRegister';
import Userlogin from './pages/Userlogin';
import Stores from './pages/Stores';
import Home1 from './pages/Home1';
function App() {

  return (
    
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/home" element={<Home1/>} />

      </Routes>
    </Router>

       </>
  )
}

export default App
