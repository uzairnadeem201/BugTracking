import { useState } from "react"
import ProjectBar from "../components/ProjectBar"
import Projects from "../components/Projects"
import Header from "../components/Header"
import Footer from "../components/Footer"

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
    <div>
      <Header/>
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
