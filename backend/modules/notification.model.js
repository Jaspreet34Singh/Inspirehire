import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Notification = sequelize.define('Notification', {
  Notification_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: {
      min: 60000, // Starting from 6XXXX
      max: 69999  // Notification ID range
    }
  },
  User_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'User_ID'
    }
  },
  Application_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'application',
      key: 'Application_ID'
    }
  },
  Content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Subject: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'notification',
  timestamps: false
});

Notification.associate = (models) => {
  Notification.belongsTo(models.User, {
    foreignKey: 'User_ID'
  });
  Notification.belongsTo(models.Application, {
    foreignKey: 'Application_ID'
  });
};

export default Notification;
 