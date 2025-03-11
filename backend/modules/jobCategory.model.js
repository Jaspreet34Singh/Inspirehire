import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"

const JobCategory = sequelize.define('JobCategory', {
    Category_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 1,
        max: 199 // Category ID range: 001XX
      }
    },
    Category_Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'job_category',
    timestamps: false
  });

  JobCategory.associate = (models) => {
    JobCategory.hasMany(models.JobPost, {
      foreignKey: 'Category_ID'
    });
    JobCategory.hasMany(models.JobPreference, {
      foreignKey: 'Category_ID'
    });
  };


  export default JobCategory