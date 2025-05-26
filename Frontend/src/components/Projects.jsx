import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SiAlby } from "react-icons/si"
import styles from "./Projects.module.css"

function Projects({ newProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const defaultIcon = <SiAlby size={30} color="white" />
  const defaultColor = "#4ECDC4"

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (newProject) {
      setProjects((prevProjects) => [newProject, ...prevProjects])
    }
  }, [newProject])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const response = await fetch("http://localhost:3000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setProjects(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch projects")
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err.message || "Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/bugs`)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorAlert}>
        <p className={styles.errorText}>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2 className={styles.emptyText}>No projects yet</h2>
        <p className={styles.emptySubtext}>Projects you create or are assigned to will appear here</p>
      </div>
    )
  }

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => {
          const tasksDone = 0
          const tasksTotal = 0

          return (
            <div key={project.id} className={styles.projectCard} onClick={() => handleProjectClick(project.id)}>
              {project.picture ? (
                <div className={styles.projectIconContainer}>
                  <img
                    src={project.picture || "/placeholder.svg"}
                    alt={project.title}
                    className={styles.projectIconImage}
                  />
                </div>
              ) : (
                <div className={styles.projectIcon} style={{ backgroundColor: defaultColor }}>
                  {defaultIcon}
                </div>
              )}
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <p className={styles.projectTasks}>
                Task Done: {String(tasksDone).padStart(2, "0")}/{tasksTotal}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects


