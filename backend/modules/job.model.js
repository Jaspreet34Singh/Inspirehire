import { DataTypes} from "sequelize"
import sequelize from "../config/database.js";


const JobPost = sequelize.define('JobPost', {
    JOB_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 50000, // Starting from 5XXXX
        max: 59999  // Job ID range
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
    Job_Title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Job_Type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Job_Location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Job_Contact_Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    Min_EduReq: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Job_Description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Min_WorkExp: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    Posted_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Job_Deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'job_post',
    timestamps: false
  });

  JobPost.associate = (models) => {
    JobPost.belongsTo(models.User, {
      foreignKey: 'USER_ID'
    });
    JobPost.belongsTo(models.JobCategory, {
      foreignKey: 'Category_ID',
      as: "JobCategory"
    });
    JobPost.hasMany(models.Application, {
      foreignKey: 'Job_ID'
    });
  };



  export default JobPost