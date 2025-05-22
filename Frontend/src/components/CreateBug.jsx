import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import styles from "./CreateBug.module.css"

function CreateBug({ open, onClose, projectId, onBugCreated }) {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      user_id: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Bug title is required"),
      description: Yup.string().trim(),
      user_id: Yup.number()
        .typeError("User ID must be a number")
        .positive("User ID must be positive")
        .required("User ID is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Authentication token not found")

        const bugData = {
          projectId: projectId,
          bugData: {
            title: values.title,
            type: "Feature",
            status: "Open",
            description: values.description,
            deadline: "2025-06-01", 
            screenshot: null,
            assigned_to: Number.parseInt(values.user_id),
          },
        }

        const response = await axios.post("http://localhost:3000/api/projects/bugs/createbugs", bugData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          formik.resetForm()
          if (onBugCreated && response.data.data) {
            onBugCreated(response.data.data)
          }
          onClose()
        } else {
          throw new Error(response.data.message || "Failed to create bug")
        }
      } catch (err) {
        alert(err.message || "An error occurred while creating the bug")
      } finally {
        setLoading(false)
      }
    },
  })

  const handleClose = () => {
    formik.resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>
        Add new bug
        <IconButton aria-label="close" onClick={handleClose} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <IconButton aria-label="more" className={styles.moreButton}>
          <MoreHorizIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <Box className={styles.assignSection}>
          <Box className={styles.assignTo}>
            <Typography variant="body2" className={styles.assignLabel}>
              Assign to (User ID)
            </Typography>
            <TextField
              placeholder="Enter user ID"
              variant="outlined"
              size="small"
              className={styles.userIdInput}
              name="user_id"
              value={formik.values.user_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.user_id && Boolean(formik.errors.user_id)}
              helperText={formik.touched.user_id && formik.errors.user_id}
              inputProps={{
                style: { padding: "8px 12px" },
              }}
            />
          </Box>

          <Box className={styles.dueDateButton}>
            <Button variant="outlined" className={styles.dateButton} startIcon={<CalendarTodayOutlinedIcon />}>
              Add due date
            </Button>
          </Box>
        </Box>

        <TextField
          placeholder="Add title here"
          variant="standard"
          fullWidth
          className={styles.titleInput}
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          InputProps={{
            disableUnderline: true,
          }}
        />

        <Typography variant="body2" className={styles.detailsLabel}>
          Bug details
        </Typography>

        <TextField
          placeholder="Add here"
          variant="standard"
          fullWidth
          multiline
          rows={2}
          className={styles.detailsInput}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          InputProps={{
            disableUnderline: true,
          }}
        />

        <Box className={styles.uploadArea}>
          <CloudUploadIcon className={styles.uploadIcon} />
          <Typography variant="body2" className={styles.uploadText}>
            Drop any file here or <span className={styles.browseLink}>browse</span>
          </Typography>
        </Box>

        <Box className={styles.actionContainer}>
          <Button
            variant="contained"
            color="primary"
            className={styles.addButton}
            onClick={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} className={styles.buttonProgress} /> : "Add"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBug
