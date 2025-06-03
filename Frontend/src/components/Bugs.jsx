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
  Card,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import axios from "axios"
import styles from "./Bugs.module.css"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"

function Bugs({ projectId, newBug, searchTerm, currentPage, entriesPerPage, onPaginationUpdate }) {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedBug, setSelectedBug] = useState(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  const userRole = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return user?.role || ""
    } catch {
      return ""
    }
  })()

  const updatingBugRef = useRef(null)

  console.log("Bugs component props:", { projectId, searchTerm, currentPage, entriesPerPage })
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])
  useEffect(() => {
    if (projectId) {
      fetchBugs()
    }
  }, [projectId, debouncedSearchTerm, currentPage, entriesPerPage])
  useEffect(() => {
    if (newBug) {
      console.log("New bug added, refetching...")
      fetchBugs()
    }
  }, [newBug])

  const fetchBugs = async () => {

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      console.log("Token exists:", !!token)

      if (!token) throw new Error("Authentication token not found")

      const params = {
        page: currentPage,
        limit: entriesPerPage,
      }

      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim()
      }

      console.log("API Request params:", params)

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }

      console.log("Making API call to:", `http://localhost:3000/api/projects/${projectId}/bugs`)

      const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/bugs`, config)

      if (response.data.success) {
        console.log("Bugs data:", response.data.data)
        console.log("Pagination data:", response.data.pagination)

        setBugs(response.data.data || [])
        if (onPaginationUpdate && response.data.pagination) {
          onPaginationUpdate(response.data.pagination)
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch bugs")
      }
    } catch (err) {

      setError(err.response?.data?.message || err.message || "Failed to load bugs")
      setBugs([])
      if (onPaginationUpdate) {
        onPaginationUpdate({
          total: 0,
          page: 1,
          limit: entriesPerPage,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        })
      }
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
        setBugs((prevBugs) => prevBugs.map((bug) => (bug.id === selectedBug.id ? response.data.data : bug)))
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
        fetchBugs()
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
        return "#ebfbee"
      case "open":
        return "#fff4e6"
      default:
        return "#f8f9fa"
    }
  }

  console.log("Current state:", { loading, error, bugsCount: bugs.length })

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
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </details>
        </div>
      </Alert>
    )
  }

  if (bugs.length === 0) {
    const isSearchResult = debouncedSearchTerm && debouncedSearchTerm.trim() !== ""
    return (
      <Box className={styles.emptyContainer}>
        <Typography variant="h5" className={styles.emptyText}>
          {isSearchResult ? "No bugs found" : "No bugs found"}
        </Typography>
        <Typography variant="body1" className={styles.emptySubtext}>
          {isSearchResult
            ? `No bugs match "${debouncedSearchTerm}". Try a different search term.`
            : "This project doesn't have any bugs or tasks yet"}
        </Typography>
      </Box>
    )
  }

  return (
    <Box className={styles.bugsContainer}>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table aria-label="bugs table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
                    <Box className={styles.statusDot} style={{ backgroundColor: getStatusColor(bug.status) }}></Box>
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
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <AvatarGroup max={2} className={styles.avatarGroup}>
                      <Avatar className={styles.avatar}>U1</Avatar>
                      <Avatar className={styles.avatar}>U2</Avatar>
                    </AvatarGroup>
                  </Box>
                </TableCell>
                <TableCell className={styles.actionCell}>
                  <IconButton
                    size="small"
                    className={styles.actionButton}
                    onClick={(e) => handleActionClick(e, bug)}
                    disabled={userRole.toLowerCase() === "manager" || (statusLoading && updatingBugRef.current === bug.id)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={styles.cardView}>
        {bugs.map((bug) => (
          <Card key={bug.id} className={styles.bugCard}>
            <Box className={styles.cardHeader}>
              <Box className={styles.cardTitle}>
                <Box className={styles.statusDot} style={{ backgroundColor: getStatusColor(bug.status) }}></Box>
                <Typography variant="body1" className={styles.cardTitleText}>
                  {bug.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                className={styles.actionButton}
                onClick={(e) => handleActionClick(e, bug)}
                disabled={userRole.toLowerCase() === "manager" || (statusLoading && updatingBugRef.current === bug.id)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box className={styles.cardContent}>
              <Box className={styles.cardRow}>
                <Typography variant="body2" className={styles.cardLabel}>
                  STATE
                </Typography>
                <Typography variant="body2" className={styles.cardValue}>
                  {bug.type}
                </Typography>
              </Box>

              <Box className={styles.cardRow}>
                <Typography variant="body2" className={styles.cardLabel}>
                  STATUS
                </Typography>
                {updatingBugRef.current === bug.id && statusLoading ? (
                  <CircularProgress size={16} />
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
              </Box>

              <Box className={styles.cardRow}>
                <Typography variant="body2" className={styles.cardLabel}>
                  DUE DATE
                </Typography>
                <Typography variant="body2" className={styles.cardValue}>
                  {bug.deadline ? new Date(bug.deadline).toLocaleDateString() : "-"}
                </Typography>
              </Box>
            </Box>

            <Box className={styles.cardFooter}>
              <Box>
                <Typography variant="body2" className={styles.cardLabel}>
                  ASSIGNED TO
                </Typography>
                <AvatarGroup max={2} className={styles.cardAvatarGroup}>
                  <Avatar className={styles.avatar}>U1</Avatar>
                  <Avatar className={styles.avatar}>U2</Avatar>
                </AvatarGroup>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleActionClose} className={styles.statusMenu}>
        {userRole.toLowerCase() === "qa" && (
          <MenuItem onClick={handleDeleteBug} className={styles.menuItem} sx={{ color: "red" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: "16px",
              }}
            >
              <Typography>Delete</Typography>
              <DeleteOutlineIcon sx={{ color: "red" }} />
            </Box>
          </MenuItem>
        )}

        {userRole.toLowerCase() === "developer" && (
          <>
            <MenuItem className={styles.menuItem} disableRipple sx={{ cursor: "default", pointerEvents: "none" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Change Status
                </Typography>
                <SettingsOutlinedIcon fontSize="small" />
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleStatusChange("Pending")} className={styles.menuItem}>
              <Box
                sx={{
                  backgroundColor: "#fff5f5",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  display: "inline-block",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <Typography sx={{ color: "red", fontSize: "0.75rem", fontWeight: "small" }}>Pending</Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleStatusChange("In progress")} className={styles.menuItem}>
              <Box
                sx={{
                  backgroundColor: "#E0F7FA",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  display: "inline-block",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <Typography sx={{ color: "blue", fontSize: "0.75rem", fontWeight: "small" }}>In progress</Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleStatusChange("Closed")} className={styles.menuItem}>
              <Box
                sx={{
                  backgroundColor: "#E6F4EA",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  display: "inline-block",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <Typography sx={{ color: "green", fontSize: "0.75rem", fontWeight: "100" }}>Closed</Typography>
              </Box>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}

export default Bugs
