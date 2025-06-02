import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectIcon1 from '../images/ProjectsIcon/1.png';
import ProjectIcon2 from '../images/ProjectsIcon/2.png';
import ProjectIcon3 from '../images/ProjectsIcon/3.png';
import ProjectIcon4 from '../images/ProjectsIcon/4.png';
import ProjectIcon5 from '../images/ProjectsIcon/5.png';
import ProjectIcon6 from '../images/ProjectsIcon/6.png';

import styles from "./Projects.module.css";

const imageIcons = [
  ProjectIcon1,
  ProjectIcon2,
  ProjectIcon3,
  ProjectIcon4,
  ProjectIcon5,
  ProjectIcon6,
];

function Projects({ newProject, searchTerm }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const navigate = useNavigate();

  const projectImages = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      if (!map.has(project.id)) {
        const index = Math.floor(Math.random() * imageIcons.length);
        map.set(project.id, imageIcons[index]);
      }
    });
    return map;
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (newProject) {
      setProjects((prev) => [newProject, ...prev]);
    }
  }, [newProject]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const trimmedTerm = debouncedSearchTerm?.trim();
    if (!trimmedTerm && !debouncedSearchTerm) {
      fetchProjects();
    }
    if (trimmedTerm && trimmedTerm.length > 0) {
      fetchProjects(trimmedTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchProjects = async (search = null) => {
    const showLoading = !search;
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: search?.trim() ? { search: search.trim() } : {},
      };

      const res = await axios.get("http://localhost:3000/api/projects", config);
      if (res.data.success) {
        setProjects(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load projects");
      setProjects([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/bugs`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorAlert}>
        <p className={styles.errorText}>{error}</p>
        <button onClick={() => fetchProjects()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2 className={styles.emptyText}>
          {debouncedSearchTerm?.trim() ? "No projects found" : "No projects yet"}
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          const image = project.picture || projectImages.get(project.id);

          return (
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() => handleProjectClick(project.id)}
            >
              <div className={styles.projectIconContainer}>
                <img
                  src={image}
                  alt={project.title}
                  className={styles.projectIconImage}
                />
              </div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.taskdone}>
                <p>Task Done:</p>
                <p className={styles.projectTasks}>00/0</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;







