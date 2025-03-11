import {DataTypes} from "sequelize"
import sequelize from "../config/database.js";



const Report = sequelize.define('Report', {
    Report_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 99000, // Starting from 99XXX
        max: 99999  // Report ID range as specified
      }
    },
    USER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'User_ID'
      }
    },
    Type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Date_Range: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'report',
    timestamps: false
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'USER_ID'
    });
  };
  

export default Report;