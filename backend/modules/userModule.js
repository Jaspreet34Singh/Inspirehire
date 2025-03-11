import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"




  const User = sequelize.define('User', {
    User_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 10000,  // Starting from 10000
        max: 39999   // Up to 39999
      }
    },
    Role_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'Role_ID'
      },
      validate: {
        isIn: [[1, 2, 3]] // Only valid roles
      }
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    WorkingID: {
      type: DataTypes.INTEGER,
      unique: true,
      validate: {
        min: 90001,
        max: 90999  // Working ID range for HR
      }
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    First_Login: {
      type: DataTypes.BOOLEAN
    },
    DateOfBirth: {
      type: DataTypes.DATEONLY
    },
    Phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'user',
    timestamps: false,
    hooks: {
      beforeCreate: (user) => {
        // Assign appropriate User_ID range based on role
        if (user.Role_ID === 1) { // Admin
          user.User_ID = sequelize.literal(`COALESCE((SELECT MAX(User_ID) FROM user WHERE User_ID BETWEEN 30000 AND 39999), 30000) + 1`);
        } else if (user.Role_ID === 2) { // HR
          user.User_ID = sequelize.literal(`COALESCE((SELECT MAX(User_ID) FROM user WHERE User_ID BETWEEN 20000 AND 29999), 20000) + 1`);
        } else if (user.Role_ID === 3) { // Applicant
          user.User_ID = sequelize.literal(`COALESCE((SELECT MAX(User_ID) FROM user WHERE User_ID BETWEEN 10000 AND 19999), 10000) + 1`);
        }
      }
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'Role_ID'
    });
    User.hasMany(models.Education, {
      foreignKey: 'USER_ID'
    });
    User.hasMany(models.WorkExp, {
      foreignKey: 'USER_ID'
    });
    User.hasMany(models.JobPreference, {
      foreignKey: 'USER_ID'
    });
    User.hasMany(models.JobPost, {
      foreignKey: 'USER_ID'
    });
    User.hasMany(models.Application, {
      foreignKey: 'User_ID'
    });
    User.hasMany(models.Notification, {
      foreignKey: 'User_ID'
    });
    User.hasMany(models.Report, {
      foreignKey: 'USER_ID'
    });
    User.hasMany(models.SecurityAns, {
      foreignKey: 'User_ID'
    });
  };

  export default User;
