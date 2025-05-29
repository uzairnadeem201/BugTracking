import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdBugReport, MdDashboard, MdDevices, MdStorage, MdCode } from "react-icons/md";

import styles from "./Projects.module.css";

const iconComponents = [
  MdBugReport,
  MdDashboard,
  MdDevices,
  MdStorage,
  MdCode,
];

function Projects({ newProject, searchTerm }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultColor = "#4ECDC4";
  const projectIcons = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      if (!map.has(project.id)) {
        const index = Math.floor(Math.random() * iconComponents.length);
        map.set(project.id, iconComponents[index]);
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
    if (searchTerm !== undefined) {
      fetchProjects(searchTerm);
    }
  }, [searchTerm]);

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
          {searchTerm?.trim() ? "No projects found" : "No projects yet"}
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          const Icon = projectIcons.get(project.id);
          return (
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() => handleProjectClick(project.id)}
            >
              {project.picture ? (
                <div className={styles.projectIconContainer}>
                  <img
                    src={project.picture}
                    alt={project.title}
                    className={styles.projectIconImage}
                  />
                </div>
              ) : (
                <div className={styles.projectIcon} style={{ backgroundColor: defaultColor }}>
                  <Icon size={30} color="white" />
                </div>
              )}
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.taskdone}>
                  <p>Task Done:</p>
                  <p className={styles.projectTasks}>
                    00/0
                  </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;





