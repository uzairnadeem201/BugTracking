import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ProjectBar from "../components/ProjectBar"
import Projects from "../components/Projects"
import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "./ProjectsPage.module.css"

function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [newProject, setNewProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page")) || 1)
  const [entriesPerPage, setEntriesPerPage] = useState(Number.parseInt(searchParams.get("limit")) || 10)
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams()

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    }

    if (entriesPerPage !== 10) {
      params.set("limit", entriesPerPage.toString())
    }
    setSearchParams(params, { replace: true })
  }, [searchTerm, currentPage, entriesPerPage, setSearchParams])

  const handleProjectCreated = (project) => {
    setNewProject(project)
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1) 
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage)
    setCurrentPage(1) 
  }

  const handlePaginationUpdate = (paginationData) => {
    setTotalEntries(paginationData.total)
    setTotalPages(paginationData.totalPages)
  }

  return (
    <div className={styles.pageContainer}>
      <Header background="#f8f9fa" />
      <ProjectBar onProjectCreated={handleProjectCreated} onSearch={handleSearch} />
      <Projects
        newProject={newProject}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPaginationUpdate={handlePaginationUpdate}
      />
      <Footer
        totalEntries={totalEntries}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEntriesPerPageChange={handleEntriesPerPageChange}
      />
    </div>
  )
}

export default ProjectsPage

