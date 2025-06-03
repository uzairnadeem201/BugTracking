import { useState, useEffect } from "react"
import { Typography, TextField, Button, InputAdornment, Box, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import CreateProject from "./CreateProject"
import styles from "./ProjectBar.module.css"
import ProjectIcon from "../images/ProjectIcon.png"

function ProjectBar({ onProjectCreated, onSearch }) {
  const [userRole, setUserRole] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const userString = localStorage.getItem("user")
    if (userString) {
      try {
        const userData = JSON.parse(userString)
        if (userData.role) {
          setUserRole(userData.role)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleAddProject = () => {
    setCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setCreateModalOpen(false)
  }

  const handleProjectCreated = (newProject) => {
    if (onProjectCreated) {
      onProjectCreated(newProject)
    }
    setSearchTerm("")
  }

  return (
    <>
      <Box className={styles.projectBar}>
        <Box className={styles.titleSection}>
          <Typography variant="h5" className={styles.title}>
            Projects
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Hi {userRole || "User"}, welcome to ManageBug
          </Typography>
        </Box>

        <Box className={styles.actionsSection}>
          <TextField
            placeholder="Search for Projects here"
            variant="outlined"
            size="small"
            className={styles.searchField}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={styles.searchIcon} />
                </InputAdornment>
              ),
            }}
          />

          {userRole.toLowerCase() === "manager" && (
            <Button variant="contained" startIcon={<AddIcon />} className={styles.addButton} onClick={handleAddProject}>
              Add New Project
            </Button>
          )}

          <Box className={styles.dropdownsContainer}>
            <Button className={styles.sortButton} endIcon={<KeyboardArrowDownIcon />}>
              Sort by
            </Button>

            <Button className={styles.projectButton} endIcon={<KeyboardArrowDownIcon />}>
              My Project
            </Button>

            <IconButton className={styles.IconButton}>
              <img src={ProjectIcon || "/placeholder.svg"} alt="Project Icon" className={styles.customIcon} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <CreateProject open={createModalOpen} onClose={handleCloseModal} onProjectCreated={handleProjectCreated} />
    </>
  )
}

export default ProjectBar
