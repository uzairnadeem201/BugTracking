import { Box } from "@mui/material"
import Left from "../images/Left.png"

function DesktopImage() {
  return (
    <Box
      sx={{
        width: "30%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        "@media (max-width: 768px)": {
          width: "100%",
          height: "30vh",
          position: "relative",
        },
      }}
    >
      <Box
        component="img"
        src= {Left}
        alt="Desk setup with monitor, iPad, and phone"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </Box>
  )
}

export default DesktopImage