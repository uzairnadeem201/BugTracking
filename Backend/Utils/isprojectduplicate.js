import normalizeTitle from "./projectstitlevalidation.js";
function isDuplicateTitle(title, projects) {
  return projects.some((project) =>
    normalizeTitle(project.title) === title
  );
}

export default isDuplicateTitle