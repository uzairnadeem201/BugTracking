import { Sequelize } from 'sequelize';
import config from './Config.js';  // note the .js extension in ESM

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(config[env]);

export default sequelize;