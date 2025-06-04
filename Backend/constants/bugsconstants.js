const BugConstants = Object.freeze({
  ALLOWED_TYPES: ['Bug', 'Feature'],
  ALLOWED_STATUSES: ['Open', 'In Progress', 'Resolved'],

  ERRORS: {
    INVALID_PROJECT_ID: 'Invalid project ID',
    NOT_ASSIGNED: 'You are not assigned to this project',
    DUPLICATE_TITLE: 'Bug title must be unique within the project.',
    INVALID_TYPE: types => `Type must be one of: ${types.join(', ')}`,
    STATUS_REQUIRED: 'Status is required.',
    INVALID_STATUS: statuses => `Status must be one of: ${statuses.join(', ')}`,
    INVALID_SCREENSHOT: 'Invalid screenshot image format',
  }
});

export default BugConstants;
