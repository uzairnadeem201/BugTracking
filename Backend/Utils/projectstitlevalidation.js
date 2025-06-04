function normalizeTitle(title) {
  return title.replace(/\s+/g, "").toLowerCase();
}

export default normalizeTitle;