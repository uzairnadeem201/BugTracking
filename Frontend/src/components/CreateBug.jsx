import { useState, useEffect, useRef } from "react";
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
  Avatar,
  Menu,
  ListItemText,
  ListItemAvatar,
  Divider,
  Popper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./CreateBug.module.css";
import Calendar from "../images/Calendar.png";
import Cross from "../images/cross.png";

const bugTypes = ["Feature", "Bug"];
const formatDateForAPI = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function CreateBug({ open, onClose, projectId, onBugCreated }) {
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const calendarIconRef = useRef(null);

  const today = new Date();

  const validationSchema = Yup.object({
    title: Yup.string()
      .transform((value) => value.trim())
      .required("Bug title is required")
      .min(5, "Bug title must be at least 5 characters"),
    description: Yup.string().trim(),
    deadline: Yup.date()
      .required("Due date is required")
      .min(today, "Due date cannot be in the past"),
    bugType: Yup.string().required("Bug type is required"),
    assignedTo: Yup.string().required("Please select a developer"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      deadline: null,
      bugType: "",
      assignedTo: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const bugData = {
          projectId: projectId,
          bugData: {
            title: values.title.trim(),
            type: values.bugType,
            status: "Open",
            description: values.description.trim(),
            deadline: formatDateForAPI(values.deadline),
            screenshot: uploadedFile,
            assigned_to: selectedDeveloper.id,
          },
        };

        const response = await axios.post(
          "http://localhost:3000/api/projects/bugs/createbugs",
          bugData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          formik.resetForm();
          setSelectedDeveloper(null);
          setUploadedFile(null);
          setFilePreview(null);
          if (onBugCreated && response.data.data) {
            onBugCreated(response.data.data);
          }
          onClose();
        } else {
          alert(response.data.message || "Failed to create bug");
        }
      } catch (error) {
        alert(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while creating the bug"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (open && projectId) {
      fetchDevelopers();
    }
  }, [open, projectId]);

  const fetchDevelopers = async () => {
    setLoadingDevelopers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get(
        `http://localhost:3000/api/projects/${projectId}/developers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDevelopers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      setLoadingDevelopers(false);
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeveloperSelect = (developer) => {
    setSelectedDeveloper(developer);
    formik.setFieldValue("assignedTo", developer.id);
    setAnchorEl(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Please select a JPEG or PNG image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFile(e.target.result);
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (newDate) => {
    formik.setFieldValue("deadline", newDate);
    setDatePickerOpen(false);
  };

  const handleCalendarClick = () => {
    setDatePickerOpen(true);
  };

  const handleSubmitForm = () => {
    formik.setTouched({
      title: true,
      description: true,
      deadline: true,
      bugType: true,
      assignedTo: true,
    });
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.submitForm();
      }
    });
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedDeveloper(null);
    setUploadedFile(null);
    setFilePreview(null);
    setAnchorEl(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>
          <IconButton onClick={handleClose} className={styles.closeButton}>
            <img src={Cross} alt="Close" style={{ width: 26, height: 26
             }} />
          </IconButton>
        </DialogTitle>
        <Box className={styles.addBugTitle}>
          <Typography variant="h5">Add new bug</Typography>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.assignSection}>
            <Box className={styles.assignTo}>
              <Typography variant="body2" className={styles.assignLabel}>
                Assign to
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {selectedDeveloper ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar onClick={handleAvatarClick} src="/placeholder.svg">
                      {selectedDeveloper.name.charAt(0)}
                    </Avatar>
                  </Box>
                ) : (
                  <Avatar
                    onClick={handleAvatarClick}
                    sx={{ cursor: "pointer", bgcolor: "#f0f0f0" }}
                  >
                    +
                  </Avatar>
                )}
                {loadingDevelopers && <CircularProgress size={16} />}
              </Box>
              {formik.touched.assignedTo && formik.errors.assignedTo && (
                <Typography variant="caption" color="error">
                  {formik.errors.assignedTo}
                </Typography>
              )}
            </Box>

            <Box className={styles.dueDateButton}>
              <Typography variant="body2" className={styles.assignLabel}>
                Add due date
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img
                  src={Calendar}
                  alt="Select Date"
                  ref={calendarIconRef}
                  onClick={handleCalendarClick}
                  style={{ cursor: "pointer", width: 36, height: 36 }}
                />
              </Box>

              <Popper
                open={datePickerOpen}
                anchorEl={calendarIconRef.current}
                placement="bottom-start"
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                >
                  <DatePicker
                    open
                    value={formik.values.deadline}
                    onChange={handleDateChange}
                    onClose={() => setDatePickerOpen(false)}
                    minDate={today}
                    slotProps={{
                      textField: { style: { display: "none" } },
                    }}
                  />
                </Box>
              </Popper>

              {formik.touched.deadline && formik.errors.deadline && (
                <Typography variant="caption" color="error">
                  {formik.errors.deadline}
                </Typography>
              )}
              {formik.values.deadline && (
                <Typography variant="caption" sx={{ color: "#666", mt: 0.5 }}>
                  Selected: {formik.values.deadline.toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" className={styles.assignLabel}>
              Bug Type
            </Typography>
            <FormControl
              size="small"
              sx={{width: 110 }}
              error={formik.touched.bugType && Boolean(formik.errors.bugType)}
            >
              <Select
                name="bugType"
                value={formik.values.bugType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select type
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
            InputProps={{ disableUnderline: true }}
          />
          <Typography variant="body2" className={styles.detailsLabel}>
            Bug details
          </Typography>
          <Box className={styles.borderedField}>
            <TextField
              placeholder="Add here"
              variant="standard"
              fullWidth
              multiline
              className={styles.detailsInput}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              InputProps={{ disableUnderline: true }}
            />
          </Box>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <Box
            className={styles.uploadArea}
            onClick={() => document.getElementById("file-upload").click()}
          >
            {filePreview ? (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "4px",
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
                  Click to change image
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadIcon className={styles.uploadIcon} />
                <Typography variant="body2" className={styles.uploadText}>
                  Drop any file here or{" "}
                  <span className={styles.browseLink}>browse</span>
                </Typography>
              </>
            )}
          </Box>
          <Box className={styles.actionContainer}>
            <Button
              variant="contained"
              color="primary"
              className={styles.addButton}
              onClick={handleSubmitForm}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} className={styles.buttonProgress} />
              ) : (
                "Add"
              )}
            </Button>
          </Box>
        </DialogContent>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {developers.map((developer) => (
            <MenuItem
              key={developer.id}
              onClick={() => handleDeveloperSelect(developer)}
            >
              <ListItemAvatar>
                <Avatar src="/placeholder.svg">
                  {developer.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={developer.name}
                secondary={developer.email}
              />
            </MenuItem>
          ))}
          {developers.length === 0 && !loadingDevelopers && (
            <MenuItem disabled>
              <ListItemText primary="No developers found" />
            </MenuItem>
          )}
        </Menu>
      </Dialog>
    </LocalizationProvider>
  );
}

export default CreateBug;
