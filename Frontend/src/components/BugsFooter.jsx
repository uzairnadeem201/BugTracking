import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

import styles from "./BugsFooter.module.css"

export default function BugsFooter({
  totalEntries = 0,
  entriesPerPage = 10,
  currentPage = 1,
  onPageChange,
  onEntriesPerPageChange,
}) {
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const startEntry = totalEntries > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries)

  const handleEntriesChange = (event) => {
    const newEntriesPerPage = event.target.value
    if (onEntriesPerPageChange) {
      onEntriesPerPageChange(newEntriesPerPage)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(null, currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(null, currentPage + 1)
    }
  }
  if (totalEntries === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <Typography variant="body2">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </Typography>

      <div className={styles.rightControls}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select size="small" value={entriesPerPage} onChange={handleEntriesChange} className={styles.select}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        <Typography variant="body2">
          {currentPage} - {totalPages} of {totalPages}
        </Typography>
        <IconButton size="small" disabled={currentPage <= 1} onClick={handlePrevPage}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" disabled={currentPage >= totalPages} onClick={handleNextPage}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  )
}


