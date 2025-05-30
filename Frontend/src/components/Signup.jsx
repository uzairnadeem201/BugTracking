import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CryptoJS from "crypto-js";
import styles from "./Signup.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const showLabel = focused || trimmedValue.length > 0;

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
      label={showLabel ? label : ""}
      placeholder={showLabel ? "" : label}
      error={error}
      helperText={helperText}
      type={type}
      required={required}
      InputProps={{
        ...InputProps,
        style: {
          ...(InputProps?.style || {}),
          backgroundColor: showLabel ? "#ffffff" : "#f1f3f5",
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

function Signup() {
  const ENCRYPTION_KEY = "key";
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role");
    const validRoles = ["Manager", "Developer", "QA"];
    const cameFromRoleSelection = location.state?.fromRoleSelection === true;
    const isValidRole = validRoles.includes(roleParam);
    if (!isValidRole && !cameFromRoleSelection) {
      navigate("/", { replace: true });
      return;
    }
    setRole(roleParam);
  }, [location, navigate]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .transform((value) => value?.trim())
      .required("Name is required")
      .test(
        "not-only-spaces",
        "Name cannot be only spaces",
        (value) => value && value.length > 0
      )
      .min(3, "Name must be at least 3 characters"),

    phonenumber: Yup.string()
      .transform((value) => value?.trim())
      .required("Phone number is required")
      .test(
        "not-only-spaces",
        "Phone number cannot be only spaces",
        (value) => value && value.length > 0
      )
      .matches(/^[0-9]{11}$/, "Enter a valid 11-digit phone number"),

    email: Yup.string()
      .transform((value) => value?.trim())
      .required("Email is required")
      .test(
        "no-spaces",
        "Email must not contain spaces",
        (value) => value && !/\s/.test(value)
      )
      .email("Enter a valid email"),

    password: Yup.string()
      .transform((value) => value?.trim())
      .required("Password is required")
      .test(
        "not-only-spaces",
        "Password cannot be only spaces",
        (value) => value && value.length > 0
      )
      .min(6, "Password must be at least 6 characters"),

    role: Yup.string()
      .transform((value) => value?.trim())
      .required("Role is required")
      .test(
        "not-only-spaces",
        "Role cannot be only spaces",
        (value) => value && value.length > 0
      ),
  });

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
      setError("");
      await formik.validateForm();
      formik.setTouched({
        name: true,
        phonenumber: true,
        email: true,
        password: true,
        role: true,
      });

      if (Object.keys(formik.errors).length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const encryptedPassword = CryptoJS.AES.encrypt(
          values.password,
          ENCRYPTION_KEY
        ).toString();

        const postData = {
          ...values,
          name: values.name.trim(),
          email: values.email.toLowerCase().trim(),
          password: encryptedPassword,
          role: values.role.trim(),
          phonenumber: values.phonenumber.trim(),
        };

        const response = await axios.post(
          "http://localhost:3000/api/signup",
          postData
        );

        if (response.data.success) {
          navigate("/login");
        } else {
          setError(response.data.message || "Signup failed. Please try again.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred during signup. Please try again."
        );
        alert(
          err.response?.data?.message ||
            "An error occurred during signup. Please try again."
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
          Sign Up
        </Typography>

        <Typography variant="body1" className={styles.subtitle}>
          Please fill your information below
        </Typography>

        {error && (
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className={styles.formField}>
            <FloatingLabelInput
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </div>

          <div className={styles.formField}>
            <FloatingLabelInput
              name="phonenumber"
              label="Mobile number"
              value={formik.values.phonenumber}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                formik.setFieldValue("phonenumber", digitsOnly);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phonenumber && Boolean(formik.errors.phonenumber)
              }
              helperText={
                formik.touched.phonenumber && formik.errors.phonenumber
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon className={styles.fieldIcon} />
                  </InputAdornment>
                ),
                inputMode: "numeric",
              }}
              required
            />
          </div>

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
            className={styles.signupButton}
            disabled={loading}
            endIcon={
              <Typography
                variant="h6"
                component="span"
                style={{ fontWeight: "bold", color: "inherit" }}
              >
                &gt;
              </Typography>
            }
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <Divider className={styles.divider} />

          <div className={styles.loginContainer}>
            <Typography variant="body2" color="text.secondary" className={styles.accountText}>
              Already have an account?{" "}
            </Typography>
            <Link
              to={`/login?role=${role}`}
              state={{ fromSignup: true }}
              className={styles.loginLink}
            >
              Login to your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
