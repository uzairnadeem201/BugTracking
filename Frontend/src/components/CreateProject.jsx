import { useState, useRef } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import axios from "axios"
import styles from "./CreateProject.module.css"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

function CreateProject({ open, onClose, onProjectCreated }) {
  const [picturePreview, setPicturePreview] = useState(null)
  const [pictureUrl, setPictureUrl] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const validationSchema = Yup.object({
    title: Yup.string().min(3, "At least 3 characters").required("Project name is required")
  })

  const handlePictureClick = () => {
    fileInputRef.current.click()
  }

  const handlePictureChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPicturePreview(reader.result)
      }
      reader.readAsDataURL(file)
      await uploadImage(file)
    }
  }

  const uploadImage = async (file) => {
    setUploadingImage(true)
    try {
      const fakeImageUrl = `https://example.com/images/${encodeURIComponent(file.name)}`
      setPictureUrl(fakeImageUrl)
      console.log("Image uploaded successfully:", fakeImageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCancel = () => {
    setPicturePreview(null)
    setPictureUrl(null)
    onClose()
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const projectData = {
        ...values,
        picture: pictureUrl,
      }

      const response = await axios.post("http://localhost:3000/api/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setPicturePreview(null)
        setPictureUrl(null)
        onProjectCreated(response.data.data)
        onClose()
      } else {
        console.error("Failed to create project:", response.data.message)
      }
    } catch (err) {
      console.error("Error creating project:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>
        Add new Project
        <IconButton aria-label="close" onClick={handleCancel} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={{ title: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, touched }) => (
          <Form>
            <DialogContent className={styles.dialogContent}>
              <Box className={styles.formContainer}>
                <Box className={styles.formFields}>
                  <Box className={styles.formField}>
                    <Typography variant="body1" className={styles.fieldLabel}>
                      Project name
                    </Typography>
                    <Field
                      as={TextField}
                      name="title"
                      fullWidth
                      placeholder="Enter project name"
                      variant="outlined"
                      size="small"
                      error={touched.title && Boolean(ErrorMessage)}
                      helperText={<ErrorMessage name="title" />}
                    />
                  </Box>

                  <Box className={styles.formField}>
                    <Typography variant="body1" className={styles.fieldLabel}>
                      Short details
                    </Typography>
                    <Field
                      as={TextField}
                      name="description"
                      fullWidth
                      placeholder="Enter details here"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      error={touched.description && Boolean(ErrorMessage)}
                      helperText={<ErrorMessage name="description" />}
                    />
                  </Box>
                </Box>

                <Box className={styles.uploadContainer} onClick={handlePictureClick}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePictureChange}
                    style={{ display: "none" }}
                  />
                  {uploadingImage ? (
                    <Box className={styles.uploadingContainer}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" className={styles.uploadingText}>
                        Uploading...
                      </Typography>
                    </Box>
                  ) : picturePreview ? (
                    <>
                      <img
                        src={picturePreview || "/placeholder.svg"}
                        alt="Project preview"
                        className={styles.previewImage}
                      />
                      {pictureUrl && (
                        <Box className={styles.uploadedIndicator}>
                          <Typography variant="caption">✓ Uploaded</Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon className={styles.uploadIcon} />
                      <Typography variant="body2" className={styles.uploadText}>
                        Upload project photo
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions className={styles.dialogActions}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={uploadingImage || isSubmitting || !isValid}
                className={styles.addButton}
              >
                Add
              </Button>
              <Button variant="outlined" onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default CreateProject

