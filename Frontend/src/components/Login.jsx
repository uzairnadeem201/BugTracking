import { useState } from "react"
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
} from "@mui/material"
import { useNavigate, Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./Login.module.css"
import CryptoJS from "crypto-js"
import axios from "axios"
import Divider from "@mui/material/Divider"

function Login() {
  const ENCRYPTION_KEY = "key"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().transform((value) => value?.trim())
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .test("not-only-spaces", "Password cannot be only spaces", (value) =>
        value === undefined ? false : value.trim().length > 0
      )
      .min(6, "Password must be at least 6 characters"),
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true)
      setError("")
      const encryptedPassword = CryptoJS.AES.encrypt(values.password.trim(), ENCRYPTION_KEY).toString();
      const trimmedValues = {
        email: values.email.trim().toLowerCase(),
        password: encryptedPassword,
      }
      


      try {
        const response = await axios.post("http://localhost:3000/api/login", trimmedValues)

        console.log("Login Response:", response.data)

        if (response.data.success) {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
          navigate("/projects")
        } else {
          setError(response.data.message || "Login failed. Please check your credentials.")
        }
      } catch (err) {
        console.error("Login error:", err)
        setError(err.response?.data?.message || "An error occurred during login. Please try again.")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Login
        </Typography>

        <Typography variant="body1" className={styles.subtitle}>
          Welcome back! Please enter your details
        </Typography>

        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className={styles.formField}>
            <TextField
              fullWidth
              name="email"
              placeholder="Email"
              variant="outlined"
              className={styles.input}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </div>

          <div className={styles.formField}>
            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="Password"
              variant="outlined"
              className={styles.input}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            className={styles.loginButton}
            endIcon={<ArrowForwardIcon />}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Divider/>

        <div className={styles.signupContainer}>
          <Typography variant="body2" className={styles.accountText}>
            Don't have an account?
          </Typography>
          <Link to="/" className={styles.signupLink}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login


