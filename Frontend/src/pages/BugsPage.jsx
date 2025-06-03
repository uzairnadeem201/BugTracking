import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import BugsFooter from "../components/BugsFooter.jsx"
import BugsBar from "../components/BugsBar"
import Bugs from "../components/Bugs"
import axios from "axios"

function BugsPage() {
  const { projectId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectName, setProjectName] = useState("")
  const [newBug, setNewBug] = useState(null)
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

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:3000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProjectName(res.data.data.title)
      } catch (err) {
        console.error("Error fetching project details", err)
      }
    }
    console.log(projectId)

    if (projectId) fetchProjectDetails()
  }, [projectId])

  const handleBugCreated = (bug) => {
    setNewBug(bug)
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
    <>
      <Header background="#ffffff" />
      <BugsBar
        projectName={projectName}
        projectId={projectId}
        onBugCreated={handleBugCreated}
        onSearch={handleSearch}
      />
      <Bugs
        projectId={projectId}
        newBug={newBug}
        searchTerm={searchTerm}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onPaginationUpdate={handlePaginationUpdate}
      />
      <BugsFooter
        totalEntries={totalEntries}
        entriesPerPage={entriesPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onEntriesPerPageChange={handleEntriesPerPageChange}
      />
    </>
  )
}

export default BugsPage



