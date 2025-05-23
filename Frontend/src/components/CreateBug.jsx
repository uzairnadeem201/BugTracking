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
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import styles from "./CreateBug.module.css"

const bugTypes = ["Feature", "Bug"]

function CreateBug({ open, onClose, projectId, onBugCreated }) {
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Bug title is required")
      .min(5, "Bug title must be at least 5 characters"),
    description: Yup.string().trim(),
    user_id: Yup.number()
      .typeError("User ID must be a number")
      .positive("User ID must be positive")
      .required("User ID is required"),
    deadline: Yup.string().required("Due date is required"),
    bugType: Yup.string().required("Bug type is required"),
  })

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      user_id: "",
      deadline: "",
      bugType: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Authentication token not found")

        const bugData = {
          projectId: projectId,
          bugData: {
            title: values.title.trim(), // Trim spaces before sending
            type: values.bugType,
            status: "Open",
            description: values.description.trim(),
            deadline: values.deadline,
            screenshot: null,
            assigned_to: Number.parseInt(values.user_id, 10),
          },
        }

        const response = await axios.post(
          "http://localhost:3000/api/projects/bugs/createbugs",
          bugData,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          formik.resetForm()
          if (onBugCreated && response.data.data) {
            onBugCreated(response.data.data)
          }
          onClose()
        } else {
          alert(response.data.message || "Failed to create bug")
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message)
        } else {
          alert(error.message || "An error occurred while creating the bug")
        }
      } finally {
        setLoading(false)
      }
    },
  })

  const handleSubmitForm = () => {
    formik.setTouched({
      title: true,
      description: true,
      user_id: true,
      deadline: true,
      bugType: true,
    })
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.submitForm()
      }
    })
  }

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
            <Typography variant="body2" className={styles.assignLabel}>
              Due Date
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              size="small"
              className={styles.dateInput}
              name="deadline"
              value={formik.values.deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.deadline && Boolean(formik.errors.deadline)}
              helperText={formik.touched.deadline && formik.errors.deadline}
              inputProps={{
                min: today,
                style: { padding: "8px 12px" },
              }}
              InputProps={{
                startAdornment: <CalendarTodayOutlinedIcon className={styles.calendarIcon} />,
              }}
            />
          </Box>
        </Box>

        <Box className={styles.bugTypeSection} sx={{ mb: 2 }}>
          <Typography variant="body2" className={styles.assignLabel}>
            Bug Type
          </Typography>
          <FormControl fullWidth size="small" error={formik.touched.bugType && Boolean(formik.errors.bugType)}>
            <Select
              name="bugType"
              value={formik.values.bugType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              displayEmpty
              inputProps={{ "aria-label": "Bug type" }}
            >
              <MenuItem value="" disabled>
                Select bug type
              </MenuItem>
              {bugTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.bugType && formik.errors.bugType && (
              <FormHelperText>{formik.errors.bugType}</FormHelperText>
            )}
          </FormControl>
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
            onClick={handleSubmitForm}
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


