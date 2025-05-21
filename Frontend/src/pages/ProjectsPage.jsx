import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProjectBar from "../components/ProjectBar"
import Projects from "../components/Projects"

function ProjectsPage() {
  const [newProject, setNewProject] = useState(null)

  const handleProjectCreated = (project) => {
    setNewProject(project)
  }

  return (
    <>
      <Header />
      <ProjectBar onProjectCreated={handleProjectCreated} />
      <Projects newProject={newProject} />
      <Footer />
    </>
  )
}

export default ProjectsPage