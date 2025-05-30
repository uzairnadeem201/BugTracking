import { Box, Typography, Paper } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeveloperIcon from "../images/briefcase.png";
import QAIcon from "../images/freelance.png";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./RoleSelection.module.css";
import { Link, useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup?role=${role}`, { state: { fromRoleSelection: true } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="body1" className={styles.SignInText}>
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
          To begin this journey, tell us what type of account <br /> you'd be opening.
        </Typography>
        <Paper
          elevation={0}
          className={styles.optionCard}
          onClick={() => handleRoleSelect("Manager")}
        >
          <Box className={styles.iconContainer}>
            <PersonIcon className={styles.managerIcon} />
          </Box>
          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              Manager
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Signup as a manager to manage <br /> the tasks and bugs
            </Typography>
          </div>
          <div className={styles.arrowIcon}>
            <ArrowForwardIcon color="primary" />
          </div>
        </Paper>
        <Paper
          elevation={0}
          className={styles.optionCard}
          onClick={() => handleRoleSelect("Developer")}
        >
          <Box className={styles.iconContainer}>
            <img
              src={DeveloperIcon}
              alt="Developer"
              className={styles.iconImage}
            />
          </Box>
          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              Developer
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Signup as a Developer to <br /> assign the relevant task to QA
            </Typography>
          </div>
          <div className={styles.arrowIcon}>
            <ArrowForwardIcon color="primary" />
          </div>
        </Paper>
        <Paper
          elevation={0}
          className={styles.optionCard}
          onClick={() => handleRoleSelect("QA")}
        >
          <Box className={styles.iconContainer}>
            <img src={QAIcon} alt="QA" className={styles.iconImage} />
          </Box>
          <div className={styles.optionText}>
            <Typography variant="h6" className={styles.optionTitle}>
              QA
            </Typography>
            <Typography variant="body2" className={styles.optionDescription}>
              Signup as a QA to create the <br /> bugs and report in tasks
            </Typography>
          </div>
          <div className={styles.arrowIcon}>
            <ArrowForwardIcon color="primary" />
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default RoleSelection;
