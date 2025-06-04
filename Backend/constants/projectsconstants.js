const ProjectConstants = Object.freeze({
  ROLES: Object.freeze({
    MANAGER: 'manager',
    QA: 'qa',
    DEVELOPER: 'developer',
  }),

  ERROR_MESSAGES: Object.freeze({
    INVALID_USER_DATA: "Invalid User data.",
    INVALID_ROLE: "Invalid role",
    PROJECT_NOT_FOUND_OR_UNAUTHORIZED: "Project not found or unauthorized access",
    TITLE_REQUIRED: "Title is required",
    PROJECT_TITLE_EXISTS: "Project with this title already exists.",
    NOT_AUTHORIZED_TO_CREATE: "Not authorized to create projects",
    INVALID_PAGINATION: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100",
  }),

  SUCCESS_MESSAGES: Object.freeze({
    USER_ASSIGNED_TO_PROJECT: "User successfully assigned to project",
  }),
});

export default ProjectConstants;
