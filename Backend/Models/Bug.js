import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Bug = sequelize.define('Bug', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'projects', key: 'id' }
    },
    title: { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      
    },
    type: {  
      type: DataTypes.ENUM('Bug', 'Feature'),
      allowNull: false,
    },
    status: { 
      type: DataTypes.STRING(11),
      allowNull: false,
      
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    deadline: { 
      type: DataTypes.DATEONLY, 
      allowNull: false 
    },
    screenshot: { 
      type: DataTypes.BLOB, 
      allowNull: true 
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  }, {
    tableName: 'bugs',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'title']
      }
    ],
  });
  return Bug;
}