import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters'
        }
      }
    },
    phonenumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Phone number is required' },
        is: {
          args: /^[0-9+\-\s()]+$/i,
          msg: 'Phone number contains invalid characters'
        },
        len: {
          args: [7, 20],
          msg: 'Phone number must be between 7 and 20 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Email address must be unique' },
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Email must be a valid email address' },
        len: {
          args: [5, 100],
          msg: 'Email must be between 5 and 100 characters'
        }
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('Manager', 'QA', 'Developer'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Manager', 'QA', 'Developer']],
          msg: 'Role must be one of Manager, QA, or Developer'
        }
      }
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};
