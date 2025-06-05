import { User, UsersProjects, Project } from '../Models/index.js';

class UserHandler {
  static async getUsersByProjectAndRole(projectId, role) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where: { role },
      include: [
        {
          model: UsersProjects,
          attributes: [],
          where: { project_id: projectId },
          include: [
            {
              model: Project,
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });

    return users;
  }
}

export default UserHandler;


