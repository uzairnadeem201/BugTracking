const BugConstants = Object.freeze({
  ALLOWED_TYPES: ["Bug", "Feature"],
  ALLOWED_STATUSES: ["open","pending", "in progress", "closed"],

  MESSAGES: {
    BUG_CREATED: "Bug created successfully",
    BUG_STATUS_UPDATED: "Bug status updated successfully",
    BUG_DELETED: "Bug deleted successfully",
    BUGS_RETRIEVED: "Bugs retrieved successfully",
    SEARCH_RESULTS: "Search results retrieved",
    NO_BUGS_FOUND: "No bugs found",
    NO_MATCHING_BUGS: "No bugs found matching your search",
    INTERNAL_ERROR: "Internal server error",
  },

  ERRORS: {
    INVALID_USER_OR_PROJECT: "Invalid user or project",
    INVALID_PAGINATION: "Invalid pagination parameters",
    INVALID_ROLE: "Invalid user role",
    INVALID_PROJECT_ID: "Invalid project ID",
    INVALID_BUG_ID: "Invalid bug ID",
    NOT_ASSIGNED: "You are not assigned to this project",
    DUPLICATE_TITLE: "Bug title must be unique within the project.",
    INVALID_TYPE: (types) => `Type must be one of: ${types.join(", ")}`,
    STATUS_REQUIRED: "Status is required.",
    INVALID_STATUS: (statuses) => `Status must be one of: ${statuses.join(", ")}`,
    INVALID_SCREENSHOT: "Invalid screenshot image format",
    STATUS_UPDATE_RESTRICTED: "Only developers can update bug status",
    DELETE_RESTRICTED: "Only QA can delete bugs",
    BUG_NOT_FOUND: "Bug not found",
  },
})

export default BugConstants


