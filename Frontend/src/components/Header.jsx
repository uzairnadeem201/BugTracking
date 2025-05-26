import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"                                                      
import EmailIcon from "@mui/icons-material/Email"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import LogoutIcon from "@mui/icons-material/Logout"
import { useState } from "react"
import styles from "./Header.module.css"
import { Link, useNavigate } from "react-router-dom"
import { FaSearch, FaClipboardList, FaTools, FaUsers } from "react-icons/fa"
import MainIcon from "../images/MainIcon.png"

function Header() {
  const navigate = useNavigate()
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    handleUserMenuClose()
    navigate("/login")
  }

  const handleLogoClick = () => {
    navigate("/projects")
  }

  return (
    <AppBar position="fixed" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <div
          className={styles.logoContainer}
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src={MainIcon}
            alt="ManageBug Logo"
            className={styles.logoImage}
          />
        </div>

        <div className={styles.navLinks}>
          <Button
            component={Link}
            to="/projects"
            className={`${styles.navButton} ${styles.active}`}
            startIcon={<FaSearch />}
          >
            Projects
          </Button>
          <Button className={styles.navButton} startIcon={<FaClipboardList />}>
            Tasks
          </Button>
          <Button className={styles.navButton} startIcon={<FaTools />}>
            Manage
          </Button>
          <Button className={styles.navButton} startIcon={<FaUsers />}>
            Users
          </Button>
        </div>

        <div className={styles.userSection}>
          <Badge badgeContent={3} color="error" className={styles.badge}>
            <NotificationsIcon className={styles.icon} />
          </Badge>
          <Badge badgeContent={5} color="error" className={styles.badge}>
            <EmailIcon className={styles.icon} />
          </Badge>
          <Box className={styles.userInfo} onClick={handleUserMenuOpen}>
            <Avatar className={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="body2" className={styles.userName}>
              {user?.role || "Dev."}
            </Typography>
            <KeyboardArrowDownIcon className={styles.dropdownIcon} />
          </Box>
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            className={styles.userMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Divider />
            <MenuItem onClick={handleLogout} className={styles.logoutMenuItem}>
              <LogoutIcon fontSize="small" className={styles.logoutIcon} />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header



