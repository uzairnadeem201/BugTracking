import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import BugsFooter from "../components/BugsFooter.jsx"
import BugsBar from "../components/BugsBar"
import Bugs from "../components/Bugs"
import axios from "axios"

function BugsPage() {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState("")
  const [newBug, setNewBug] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
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
      <Bugs projectId={projectId} newBug={newBug} searchTerm={searchTerm} />
      <BugsFooter />
    </>
  )
}

export default BugsPage



