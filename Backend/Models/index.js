import sequelize from '../Config/Db.js';

import UserModel from './User.js';
import ProjectModel from './Project.js';
import UsersProjectsModel from './UsersProjects.js';
import BugModel from './Bug.js';

const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const UsersProjects = UsersProjectsModel(sequelize);
const Bug = BugModel(sequelize);

User.hasMany(UsersProjects, { foreignKey: 'user_id' });
UsersProjects.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Project, { foreignKey: 'created_by' });
Project.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
Project.hasMany(UsersProjects, { foreignKey: 'project_id' });
UsersProjects.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Bug, { foreignKey: 'project_id' });
Bug.belongsTo(Project, { foreignKey: 'project_id' });
Bug.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
User.hasMany(Bug, { as: 'assignedBugs', foreignKey: 'assigned_to' });
Bug.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Bug, { as: 'createdBugs', foreignKey: 'created_by' });

export {
  sequelize,
  User,
  Project,
  UsersProjects,
  Bug,
};