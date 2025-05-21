import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UsersProjects = sequelize.define('UsersProjects', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'users', key: 'id' }
    },
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'projects', key: 'id' }
    }
  }, {
    tableName: 'users_projects',
    timestamps: false
  });

  return UsersProjects;
};