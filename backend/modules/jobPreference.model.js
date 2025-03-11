import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"


const JobPreference = sequelize.define('JobPreference', {
    JobPref_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 82000, // Starting from 82XXX
        max: 82999  // Job Preference ID range as specified
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
    Category_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'job_category',
        key: 'Category_ID'
      }
    },
    JobType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    JobLocation: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'job_preference',
    timestamps: false
  });

  JobPreference.associate = (models) => {
    JobPreference.belongsTo(models.User, {
      foreignKey: 'USER_ID'
    });
    JobPreference.belongsTo(models.JobCategory, {
      foreignKey: 'Category_ID'
    });
  };


  export default JobPreference