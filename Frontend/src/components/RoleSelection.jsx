import { Box, Typography, Paper} from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import BusinessIcon from "@mui/icons-material/Business"
import BugReportIcon from "@mui/icons-material/BugReport"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./RoleSelection.module.css"
import { Link, useNavigate } from "react-router-dom"

function RoleSelection() {
    const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    navigate(`/signup?role=${role}`)
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="body1">
          Already have an account?{" "}
          <Link to="/login" className={styles.signInLink}>
            Sign In
          </Link>
        </Typography>
      </div>

      <div className={styles.formContainer}>
        <Typography variant="h3" component="h1" className={styles.title}>
          Join Us!
        </Typography>

        <Typography variant="body1" className={styles.subtitle}>
          To begin this journey, tell us what type of account you'd be opening
        </Typography>

        <Paper elevation={0} className={styles.optionCard} onClick={() => handleRoleSelect("Manager")}>
          <Box className={styles.iconContainer}>
            <InfoIcon />
          </Box>

          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              Manager
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Sign-in as a manager to manage the tasks and bugs
            </Typography>
          </div>

          <ArrowForwardIcon color="primary" />
        </Paper>

        <Paper elevation={0} className={styles.optionCard} onClick={() => handleRoleSelect("Developer")}>
          <Box className={styles.iconContainer}>
            <BusinessIcon />
          </Box>

          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              Developer
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Sign-in as a Developer to assign the relevant task to QA
            </Typography>
          </div>

          <ArrowForwardIcon color="primary" />
        </Paper>

        <Paper elevation={0} className={styles.optionCard} onClick={() => handleRoleSelect("QA")}>
          <Box className={styles.iconContainer}>
            <BugReportIcon />
          </Box>

          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              QA
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Sign-in as a QA to create the bugs and report in tasks
            </Typography>
          </div>

          <ArrowForwardIcon color="primary" />
        </Paper>
      </div>
    </div>
  )
}

export default RoleSelection
