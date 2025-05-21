import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage.jsx';
import BugsPage from './pages/BugsPage.jsx'
import './App.css';
import Project from "./pages/ProjectsPage.jsx";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projects" element={<Project/>}/>
      <Route path="/projects/:projectId/bugs" element={<BugsPage />} />
    </Routes>
  
    
  );
}


export default App;

