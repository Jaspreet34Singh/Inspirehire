import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"
import { application } from "express";
    
    
    
    const Application = sequelize.define('Application', {
      Application_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
          min: 40000, // Starting from 4XXXX
          max: 49999  // Application ID range
        }
      },
      Job_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'job_post',
          key: 'JOB_ID'
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
      Resume: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      CoverLetter: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Applied_Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      ScreeningDetails: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'application',
      timestamps: false
    });
  
    Application.associate = (models) => {
      Application.belongsTo(models.User, {
        foreignKey: 'User_ID'
      });
      Application.belongsTo(models.JobPost, {
        foreignKey: 'Job_ID'
      });
      Application.hasMany(models.AIScreening, {
        foreignKey: 'Application_ID'
      });
      Application.hasMany(models.Notification, {
        foreignKey: 'Application_ID'
      });
    }



    export default Application;
  