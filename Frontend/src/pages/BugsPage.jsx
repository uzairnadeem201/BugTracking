import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import BugsBar from "../components/BugsBar"
import Bugs from "../components/Bugs"
import axios from "axios"

function BugsPage() {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState("")
  const [newBug, setNewBug] = useState(null)

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
  }

  return (
    <>
      <Header />
      <BugsBar projectName={projectName} projectId={projectId} onBugCreated={handleBugCreated} />
      <Bugs projectId={projectId} newBug={newBug} />
      <Footer />
    </>
  )
}

export default BugsPage


