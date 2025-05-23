import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage.jsx';
import BugsPage from './pages/BugsPage.jsx';
import Project from "./pages/ProjectsPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import PrivateRoute from './components/PrivateRoute'; 
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Project />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects/:projectId/bugs"
        element={
          <PrivateRoute>
            <BugsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;


