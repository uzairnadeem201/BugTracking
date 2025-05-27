import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SiAlby } from "react-icons/si"
import axios from "axios"
import styles from "./Projects.module.css"

function Projects({ newProject, searchTerm}) {
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
      setProjects((prev) => [newProject, ...prev])
    }
  }, [newProject])

  useEffect(() => {
    if (searchTerm !== undefined) {
      handleSearch(searchTerm)
    }
  }, [searchTerm])

  const fetchProjects = async (search = null) => {
    const showLoading = !search
    if (showLoading) {
      setLoading(true)
    }

    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {},
      }

      if (search && search.trim() !== "") {
        config.params.search = search.trim()
      }

      const response = await axios.get("http://localhost:3000/api/projects", config)

      if (response.data.success) {
        setProjects(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch projects")
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err.response?.data?.message || err.message || "Failed to load projects")
      setProjects([])
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const handleSearch = async (search) => {
    await fetchProjects(search)
  }

  const handleRefresh = () => {
    fetchProjects()
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
        <button onClick={handleRefresh} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    const isSearchResult = searchTerm && searchTerm.trim() !== ""
    return (
      <div className={styles.emptyContainer}>
        <h2 className={styles.emptyText}>{isSearchResult ? "No projects found" : "No projects yet"}</h2>
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




