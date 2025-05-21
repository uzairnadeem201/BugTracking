import { useState, useEffect, useRef } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Avatar,
  AvatarGroup,
  Chip,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import axios from "axios"
import styles from "./Bugs.module.css"

function Bugs({ projectId, newBug }) {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBug, setSelectedBug] = useState(null)

  // Get user role from localStorage (basic safe parse)
  const userRole = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return user?.role || ""
    } catch {
      return ""
    }
  })()

  // Ref to track which bug is being updated
  const updatingBugRef = useRef(null)

  useEffect(() => {
    if (projectId) {
      fetchBugs(projectId)
    }
  }, [projectId])

  // Effect to add new bug when it's created
  useEffect(() => {
    if (newBug) {
      setBugs((prevBugs) => [newBug, ...prevBugs])
    }
  }, [newBug])

  const fetchBugs = async (id) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const response = await axios.get(`http://localhost:3000/api/projects/${id}/bugs`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setBugs(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch bugs")
      }
    } catch (err) {
      setError(err.message || "Failed to load bugs")
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (event, bug) => {
    setAnchorEl(event.currentTarget)
    setSelectedBug(bug)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedBug(null)
  }

  const handleStatusChange = async (status) => {
    if (!selectedBug || !projectId) return

    setStatusLoading(true)
    updatingBugRef.current = selectedBug.id

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const data = {
        projectId: Number.parseInt(projectId),
        bugId: selectedBug.id,
        status,
      }

      const response = await axios.put("http://localhost:3000/api/projects/bugs/status", data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug.id === selectedBug.id ? response.data.data : bug))
        )
      } else {
        throw new Error(response.data.message || "Failed to update bug status")
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating the bug status")
    } finally {
      setStatusLoading(false)
      updatingBugRef.current = null
      handleActionClose()
    }
  }

  const handleDeleteBug = async () => {
    if (!selectedBug || !projectId) return

    if (!window.confirm("Are you sure you want to delete this bug?")) {
      handleActionClose()
      return
    }

    setStatusLoading(true)
    updatingBugRef.current = selectedBug.id

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token not found")

      const data = { projectId, bugId: selectedBug.id }

      const response = await axios.delete("http://localhost:3000/api/projects/bugs/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data,
      })

      if (response.data.success) {
        setBugs((prevBugs) => prevBugs.filter((bug) => bug.id !== selectedBug.id))
      } else {
        throw new Error(response.data.message || "Failed to delete bug")
      }
    } catch (err) {
      alert(err.message || "An error occurred while deleting the bug")
    } finally {
      setStatusLoading(false)
      updatingBugRef.current = null
      handleActionClose()
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#ff6b6b"
      case "in progress":
        return "#4dabf7"
      case "closed":
      case "resolved":
        return "#51cf66"
      case "open":
        return "#ff9f43"
      default:
        return "#adb5bd"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#fff5f5"
      case "in progress":
        return "#e7f5ff"
      case "closed":
      case "resolved":
        return "#ebfbee"
      case "open":
        return "#fff4e6"
      default:
        return "#f8f9fa"
    }
  }

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={50} />
        <Typography variant="h6" className={styles.loadingText}>
          Loading bugs...
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

  if (bugs.length === 0) {
    return (
      <Box className={styles.emptyContainer}>
        <Typography variant="h5" className={styles.emptyText}>
          No bugs found
        </Typography>
        <Typography variant="body1" className={styles.emptySubtext}>
          This project doesn't have any bugs or tasks yet
        </Typography>
      </Box>
    )
  }

  return (
    <Box className={styles.bugsContainer}>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table aria-label="bugs table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell>
              <TableCell className={styles.detailsCell}>DETAILS</TableCell>
              <TableCell className={styles.typeCell}>STATE</TableCell>
              <TableCell className={styles.statusCell}>STATUS</TableCell>
              <TableCell className={styles.dateCell}>DUE DATE</TableCell>
              <TableCell className={styles.assignedCell}>ASSIGNED TO</TableCell>
              <TableCell className={styles.actionCell}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bugs.map((bug) => (
              <TableRow key={bug.id} className={styles.bugRow}>
                <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell className={styles.detailsCell}>
                  <Box className={styles.bugDetails}>
                    <Box
                      className={styles.statusDot}
                      style={{ backgroundColor: getStatusColor(bug.status) }}
                    ></Box>
                    <Typography variant="body2" className={styles.bugTitle}>
                      {bug.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className={styles.typeCell}>
                  <Typography variant="body2">{bug.type}</Typography>
                </TableCell>
                <TableCell className={styles.statusCell}>
                  {updatingBugRef.current === bug.id && statusLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Chip
                      label={bug.status}
                      size="small"
                      className={styles.statusChip}
                      style={{
                        backgroundColor: getStatusBgColor(bug.status),
                        color: getStatusColor(bug.status),
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className={styles.dateCell}>
                  <Typography variant="body2">
                    {bug.deadline ? new Date(bug.deadline).toLocaleDateString() : "-"}
                  </Typography>
                </TableCell>
                <TableCell className={styles.assignedCell}>
                  <AvatarGroup max={2} className={styles.avatarGroup}>
                    <Avatar className={styles.avatar}>U1</Avatar>
                    <Avatar className={styles.avatar}>U2</Avatar>
                  </AvatarGroup>
                </TableCell>
                <TableCell className={styles.actionCell}>
                    <IconButton
                      size="small"
                      className={styles.actionButton}
                      onClick={(e) => handleActionClick(e, bug)}
                      disabled={statusLoading && updatingBugRef.current === bug.id}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu with role-based options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        className={styles.statusMenu}
      >
        {userRole === "QA" && (
          <MenuItem onClick={handleDeleteBug} className={styles.menuItem}>
            Delete
          </MenuItem>
        )}

        {userRole === "Developer" && (
          <>
            <MenuItem onClick={() => handleStatusChange("Pending")} className={styles.menuItem}>
              Pending
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange("In progress")} className={styles.menuItem}>
              In progress
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange("Resolved")} className={styles.menuItem}>
              Resolved
            </MenuItem>
          </>
        )}

        {/* Managers have no menu options */}
      </Menu>
    </Box>
  )
}

export default Bugs




