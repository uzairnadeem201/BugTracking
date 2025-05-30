import { useState } from "react"
import ProjectBar from "../components/ProjectBar"
import Projects from "../components/Projects"
import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "./ProjectsPage.module.css"

function ProjectsPage() {
  const [newProject, setNewProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleProjectCreated = (project) => {
    setNewProject(project)
    setSearchTerm("")
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }


  return (
    <div className={styles.pageContainer}>
      <Header background="#f8f9fa"/>
      <ProjectBar onProjectCreated={handleProjectCreated} onSearch={handleSearch} />
      <Projects
        newProject={newProject}
        searchTerm={searchTerm}
      />
      <Footer />
    </div>
  )
}

export default ProjectsPage
