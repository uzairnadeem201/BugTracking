import { useState, useRef } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import axios from "axios"
import styles from "./CreateProject.module.css"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"

function CreateProject({ open, onClose, onProjectCreated }) {
  const [picturePreview, setPicturePreview] = useState(null)
  const [pictureUrl, setPictureUrl] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const validationSchema = Yup.object({
  title: Yup.string()
    .transform((value) => value.trim())
    .required("Project name is required")
    .min(5, "Project name must be at least 5 characters"),
  description: Yup.string()
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
      if (!token) {
        alert("Unauthorized: No token found")
        return
      }

      const trimmedValues = {
        title: values.title.trim(),
        description: values.description?.trim(),
      }

      const projectData = {
        ...trimmedValues,
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
        alert(`Failed to create project: ${response.data.message || "Unknown error"}`)
      }
    } catch (err) {
      alert(`Error creating project: ${err.response?.data?.message || err.message}`)
      console.error("Error creating project:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth className={styles.dialog}>
      <DialogTitle className={styles.dialogTitle}>
        Add new Project
      </DialogTitle>

      <Formik
        initialValues={{ title: "", description: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, isValid, touched, errors }) => (
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
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
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
                      rows={3}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
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

            <Box className={styles.dialogActions}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={uploadingImage || isSubmitting || !isValid}
                className={styles.addButton}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default CreateProject


