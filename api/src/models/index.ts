import { Sequelize } from 'sequelize';
import { initBookingModel, Booking } from './booking.model.js';
import config from '../config/config.js';
import { initUserModel, User } from './user.model.js';

const env = (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    port: +dbConfig.port,
    logging: false
  }
);

initBookingModel(sequelize);
initUserModel(sequelize);

export {
  sequelize,
  Booking,
  User
};
