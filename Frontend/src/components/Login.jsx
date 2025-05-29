import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CryptoJS from "crypto-js";
import axios from "axios";
import styles from "./Login.module.css";

function FloatingLabelInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  InputProps,
  type = "text",
  required = false,
}) {
  const [focused, setFocused] = useState(false);
  const trimmedValue = (value || "").trim();
  const whiteBg = focused || trimmedValue.length > 0;

  return (
    <TextField
      fullWidth
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={(e) => {
        setFocused(false);
        onBlur && onBlur(e);
      }}
      onFocus={() => setFocused(true)}
      label={whiteBg ? label : ""}
      placeholder={whiteBg ? "" : label}
      error={error}
      helperText={helperText}
      type={type}
      required={required}
      InputProps={{
        ...InputProps,
        style: {
          ...(InputProps?.style || {}),
          backgroundColor: whiteBg ? "#ffffff" : "#f1f3f5",
          transition: "background-color 0.3s ease",
        },
        
      }}
      sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ccc", 
        transition: "border-color 0.3s",
      },
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
        borderWidth: 2,
      },
    },
  }}
    />
  );
}

function Login() {
  const ENCRYPTION_KEY = "key";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .transform((value) => value?.trim())
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .test("not-only-spaces", "Password cannot be only spaces", (value) =>
        value === undefined ? false : value.trim().length > 0
      )
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const encryptedPassword = CryptoJS.AES.encrypt(
          values.password.trim(),
          ENCRYPTION_KEY
        ).toString();

        const trimmedValues = {
          email: values.email.trim().toLowerCase(),
          password: encryptedPassword,
        };

        const response = await axios.post(
          "http://localhost:3000/api/login",
          trimmedValues
        );

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/projects");
        } else {
          setError(
            response.data.message ||
              "Login failed. Please check your credentials."
          );
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred during login. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Login
        </Typography>

        <Typography variant="body1" className={styles.subtitle}>
          Please enter your login details
        </Typography>

        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className={styles.formField}>
            <FloatingLabelInput
              name="email"
              label="E-mail"
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
              type="email"
              required
            />
          </div>

          <div className={styles.formField}>
            <FloatingLabelInput
              name="password"
              label="Password"
              type="password"
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
            endIcon={
              <Typography
                variant="h6"
                component="span"
                style={{ fontWeight: "bold", color: "inherit" }}
              >
                &gt;
              </Typography>
            }
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Divider />

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
  );
}

export default Login;


