import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RejectionEmailJob = sequelize.define('scheduledemails', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Job_ID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ScheduledDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default RejectionEmailJob;