import { sequelize } from '../Models/index.js';
import { QueryTypes } from 'sequelize';

const getUsersByProjectAndRole = async (projectId, role) => {
  const users = await sequelize.query(
    `
    SELECT u.id, u.name, u.email
    FROM users u
    JOIN users_projects up ON u.id = up.user_id
    WHERE up.project_id = :projectId
      AND u.role = :role
    `,
    {
      replacements: { projectId, role },
      type: QueryTypes.SELECT,
    }
  );

  return users;
};

export default {
  getUsersByProjectAndRole,
};

