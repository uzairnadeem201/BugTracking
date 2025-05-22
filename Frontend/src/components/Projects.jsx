import { useState, useEffect } from "react"
import { Typography, Box, Card, Grid, CircularProgress, Alert, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./Projects.module.css"

function Projects({ newProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const defaultIcon = "📋"
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

      if (!token) {
        throw new Error("Authentication token not found")
      }
      const response = await axios.get("http://localhost:3000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setProjects(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch projects")
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
      <Box className={styles.loadingContainer}>
        <CircularProgress size={50} />
        <Typography variant="h6" className={styles.loadingText}>
          Loading projects...
        </Typography>
      </Box>
    )
  }
  if (error) {
    return (
      <Alert severity="error" className={styles.errorAlert}>
        {error}
      </Alert>
    )
  }
  if (projects.length === 0) {
    return (
      <Box className={styles.emptyContainer}>
        <Typography variant="h5" className={styles.emptyText}>
          No projects yet
        </Typography>
        <Typography variant="body1" className={styles.emptySubtext}>
          Projects you create or are assigned to will appear here
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Grid container spacing={4} className={styles.projectsGrid}>
        {projects.map((project) => {
          const tasksDone = Math.floor(Math.random() * 30) + 1
          const tasksTotal = Math.floor(Math.random() * 50) + 30

          return (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card className={styles.projectCard} onClick={() => handleProjectClick(project.id)}>
                {project.picture ? (
                  <Box className={styles.projectIconContainer}>
                    <img
                      src={project.picture || "/placeholder.svg"}
                      alt={project.title}
                      className={styles.projectIconImage}
                    />
                  </Box>
                ) : (
                  <Box className={styles.projectIcon} style={{ backgroundColor: defaultColor }}>
                    {defaultIcon}
                  </Box>
                )}
                <Typography variant="h6" className={styles.projectTitle}>
                  {project.title}
                </Typography>
                <Typography variant="body1" className={styles.projectDescription}>
                  {project.description}
                </Typography>
                <Typography variant="body2" className={styles.projectTasks}>
                  Task Done: {String(tasksDone).padStart(2, "0")}/{tasksTotal}
                </Typography>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default Projects