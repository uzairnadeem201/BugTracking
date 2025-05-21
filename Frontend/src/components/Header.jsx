import { AppBar, Toolbar, Typography, Button, Avatar, Badge, Box, Menu, MenuItem, Divider } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import EmailIcon from "@mui/icons-material/Email"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import LogoutIcon from "@mui/icons-material/Logout"
import { useState } from "react"
import styles from "./Header.module.css"
import { Link, useNavigate } from "react-router-dom"

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
    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Close the menu
    handleUserMenuClose()

    // Redirect to login page
    navigate("/login")
  }

  return (
    <AppBar position="fixed" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <div className={styles.logoContainer}>
          <Typography variant="h6" className={styles.logo}>
            <span className={styles.manage}>Manage</span>
            <span className={styles.bug}>Bug</span>
          </Typography>
        </div>

        <div className={styles.navLinks}>
          <Button
            component={Link}
            to="/projects"
            className={`${styles.navButton} ${styles.active}`}
            startIcon={<span className={styles.navIcon}>🔍</span>}
          >
            Projects
          </Button>
          <Button
            component={Link}
            to="/tasks"
            className={styles.navButton}
            startIcon={<span className={styles.navIcon}>📋</span>}
          >
            Tasks
          </Button>
          <Button
            component={Link}
            to="/manage"
            className={styles.navButton}
            startIcon={<span className={styles.navIcon}>🔧</span>}
          >
            Manage
          </Button>
          <Button
            component={Link}
            to="/users"
            className={styles.navButton}
            startIcon={<span className={styles.navIcon}>👥</span>}
          >
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
            <Avatar className={styles.avatar}>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</Avatar>
            <Typography variant="body2" className={styles.userName}>
              {user?.role || "Dev."}
            </Typography>
            <KeyboardArrowDownIcon className={styles.dropdownIcon} />
          </Box>

          {/* User Menu */}
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
            <MenuItem className={styles.menuItem}>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem className={styles.menuItem}>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
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

