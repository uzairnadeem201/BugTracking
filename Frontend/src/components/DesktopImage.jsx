import Left from "../images/Left.png"
import styles from "./DesktopImage.module.css"

function DesktopImage() {
  return (
    <div className={styles.imageContainer}>
      <img
        src={Left || "/placeholder.svg"}
        alt="Desk setup with monitor, iPad, and phone"
        className={styles.responsiveImage}
      />
    </div>
  );
}

export default DesktopImage