import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"



const WorkExp = sequelize.define('WorkExp', {
    WorkExp_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 81000, // Starting from 81XXX
        max: 81999  // Work Experience ID range as specified
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
    CompanyName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    EndDate: {
      type: DataTypes.DATEONLY
    },
    JobDescription: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'work_exp',
    timestamps: false
  });

  WorkExp.associate = (models) => {
    WorkExp.belongsTo(models.User, {
      foreignKey: 'USER_ID'
    });
  };

export default WorkExp;