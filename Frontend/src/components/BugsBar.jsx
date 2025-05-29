import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  Box,
  IconButton,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BugsIcon from "../images/Badge.png";
import Link from "@mui/material/Link";

import styles from "./BugsBar.module.css";
import CreateBug from "./CreateBug";

function BugsBar({
  projectName = "Analyst UI System",
  breadcrumbText = "Projects",
  projectId,
  onBugCreated,
  onSearch,
}) {
  const [createBugOpen, setCreateBugOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData.role) setUserRole(userData.role);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleNewTask = () => {
    setCreateBugOpen(true);
  };

  const handleCloseCreateBug = () => {
    setCreateBugOpen(false);
  };

  const handleBugCreated = (newBug) => {
    if (onBugCreated) {
      onBugCreated(newBug);
    }
  };

  const handleViewChange = (viewIndex) => {
    setActiveView(viewIndex);
  };

  return (
    <>
      <Box className={styles.bugsBar}>
        <Box className={styles.breadcrumbContainer}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link underline="hover" color="inherit" href="/projects">
              {breadcrumbText}
            </Link>
            <Typography color="text.primary">{projectName}</Typography>
          </Breadcrumbs>
        </Box>
        <Box className={styles.titleContainer}>
          <Box className={styles.BugsIcon}>
            <Typography variant="h4" className={styles.title}>
              All bugs listing
            </Typography>
            <img
              src={BugsIcon || "/placeholder.svg"}
              alt="Bugs"
              style={{ marginTop: "18px", height: "24px", display: "block" }}
            />
          </Box>

          <Box className={styles.actionButtons}>
            <Button
              aria-label="settings"
              className={styles.iconButton}
              variant="outlined"
              size="small"
            >
              <SettingsIcon />
            </Button>
            <Button
              aria-label="more"
              className={styles.iconButton}
              variant="outlined"
              size="small"
            >
              <MoreHorizIcon />
            </Button>
            {userRole === "QA" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                className={styles.newTaskButton}
                onClick={handleNewTask}
              >
                New Task Bug
              </Button>
            )}
          </Box>
        </Box>
        <Divider className={styles.divider} />
        <Box className={styles.searchFilterContainer}>
          <TextField
            placeholder="Search bugs..."
            variant="outlined"
            size="small"
            className={styles.searchField}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={styles.searchIcon} />
                </InputAdornment>
              ),
            }}
          />
          <Box className={styles.buttonGroup}>
            <Button
              variant="outlined"
              className={styles.filterButton}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Subtasks
            </Button>
            <Button
              variant="outlined"
              className={styles.filterButton}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Me
            </Button>
            <Button
              variant="outlined"
              className={styles.filterButton}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Assignees
            </Button>
          </Box>
          <Box className={styles.viewToggleContainer}>
              <IconButton
                className={`${styles.viewButton} ${styles.middleButton} ${
                  activeView === 1 ? styles.activeView : ""
                }`}
                onClick={() => handleViewChange(1)}
              >
                <ViewCompactIcon />
              </IconButton>
              <IconButton
                className={`${styles.viewButton} ${styles.middleButton} ${
                  activeView === 2 ? styles.activeView : ""
                }`}
                onClick={() => handleViewChange(2)}
              >
                <ViewModuleIcon />
              </IconButton>
              <Box className={styles.viewToggleBox}>
                 <IconButton
                className={`${styles.viewButton} ${styles.lastButton} ${
                  activeView === 3 ? styles.activeView : ""
                }`}
                onClick={() => handleViewChange(3)}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                className={`${styles.viewButton} ${styles.firstButton} ${
                  activeView === 0 ? styles.activeView : ""
                }`}
                onClick={() => handleViewChange(0)}
              >
                <ViewListIcon />
              </IconButton>
              </Box>
             
          </Box>
        </Box>
      </Box>
      <CreateBug
        open={createBugOpen}
        onClose={handleCloseCreateBug}
        projectId={projectId}
        onBugCreated={handleBugCreated}
      />
    </>
  );
}

export default BugsBar;
