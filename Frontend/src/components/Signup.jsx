import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { TextField, Button, Typography, InputAdornment, Alert } from "@mui/material"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone"
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import styles from "./Signup.module.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

function Signup() {
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const roleParam = queryParams.get("role")
    if (!roleParam || !location.state?.fromRoleSelection) {
      navigate("/login", { replace: true })
      return
    }

    setRole(roleParam)
  }, [location, navigate])

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .test("not-only-spaces", "Name cannot be only spaces", (value) => value && value.trim().length > 0)
      .min(3, "Name must be at least 3 characters"),

    phonenumber: Yup.string()
      .required("Phone number is required")
      .test("not-only-spaces", "Phone number cannot be only spaces", (value) => value && value.trim().length > 0)
      .matches(/^[0-9]{11}$/, "Enter a valid 11-digit phone number"),

    email: Yup.string()
      .required("Email is required")
      .test("no-spaces", "Email must not contain spaces", (value) => value && !/\s/.test(value))
      .email("Enter a valid email"),

    password: Yup.string()
      .required("Password is required")
      .test("not-only-spaces", "Password cannot be only spaces", (value) =>
        value === undefined ? false : value.trim().length > 0
      )
      .min(6, "Password must be at least 6 characters"),

    role: Yup.string()
      .required("Role is required")
      .test("not-only-spaces", "Role cannot be only spaces", (value) => value && value.trim().length > 0),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      phonenumber: "",
      email: "",
      password: "",
      role: role || "",
    },
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setError("")

      await formik.validateForm()
      formik.setTouched({
        name: true,
        phonenumber: true,
        email: true,
        password: true,
        role: true,
      })

      if (Object.keys(formik.errors).length > 0) {
        return
      }

      setLoading(true)

      try {
        const trimmedValues = {
          name: values.name.trim(),
          phonenumber: values.phonenumber.trim(),
          email: values.email.trim(),
          password: values.password.trim(),
          role: values.role.trim(),
        }

        const response = await axios.post("http://localhost:3000/api/signup", trimmedValues)
        if (response.data.success) {
          alert("User created successfully!")
          navigate("/login")
        } else {
          setError(response.data.message || "Signup failed. Please try again.")
        }
      } catch (err) {
        console.error("Signup error:", err)
        setError(err.response?.data?.message || "An error occurred during signup. Please try again.")
        alert(err.response?.data?.message || "An error occurred during signup. Please try again.")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Sign Up
        </Typography>

        <Typography variant="body1" className={styles.subtitle}>
          Please fill your information below
        </Typography>
        {formik.values.role && <div className={styles.roleIndicator}>Signing up as: {formik.values.role}</div>}

        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className={styles.formField}>
            <TextField
              fullWidth
              name="name"
              placeholder="Name"
              variant="outlined"
              className={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              required
            />
          </div>

          <div className={styles.formField}>
            <TextField
              fullWidth
              name="phonenumber"
              placeholder="Mobile number"
              variant="outlined"
              className={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              value={formik.values.phonenumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
              helperText={formik.touched.phonenumber && formik.errors.phonenumber}
              required
            />
          </div>

          <div className={styles.formField}>
            <TextField
              fullWidth
              name="email"
              placeholder="E-mail"
              variant="outlined"
              className={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              type="email"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            className={styles.signupButton}
            endIcon={<ArrowForwardIcon />}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <div className={styles.loginContainer}>
          <Typography variant="body2" className={styles.accountText}>
            Already have an account?
          </Typography>
          <Typography variant="body2" component={Link} to="/login" className={styles.loginLink}>
            Login to your account
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Signup



