import { Typography, Pagination, Select, MenuItem, Box } from "@mui/material"
import styles from "./Footer.module.css"

function Footer({ totalEntries = 50, entriesPerPage = 10, currentPage = 1, onPageChange, onEntriesPerPageChange }) {
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const startEntry = (currentPage - 1) * entriesPerPage + 1
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries)

  const handlePageChange = (event, value) => {
    if (onPageChange) {
      onPageChange(value)
    }
  }

  const handleEntriesChange = (event) => {
    if (onEntriesPerPageChange) {
      onEntriesPerPageChange(event.target.value)
    }
  }

  return (
    <Box className={styles.footer}>
      <div className={styles.footerContent}>
        <Typography variant="body2" className={styles.entriesInfo}>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </Typography>

        <Box className={styles.paginationContainer}>
          <Box className={styles.displayOptions}>
            <Typography variant="body2" className={styles.displayLabel}>
              Display
            </Typography>
            <Select
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className={styles.entriesSelect}
              size="small"
              variant="outlined"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            className={styles.pagination}
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </div>
    </Box>
  )
}

export default Footer