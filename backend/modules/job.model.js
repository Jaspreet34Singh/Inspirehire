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
    MinFieldRelatedExp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Minimum field-related experience required'
    },
    MinEducationLevel: {
      type: DataTypes.ENUM('Masters', 'Bachelors', 'Diploma', 'Certificate'),
      allowNull: false,
      defaultValue: 'Certificate',
      comment: 'Minimum education level required'
    },
    Job_Description: {
      type: DataTypes.TEXT,
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
    JobPost.belongsTo(User, { 
      foreignKey: 'USER_ID',
      as: 'User', // Optional but recommended
      onDelete: 'CASCADE', // Optional: handles deletion behavior
      onUpdate: 'CASCADE'  // Optional: handles update behavior
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