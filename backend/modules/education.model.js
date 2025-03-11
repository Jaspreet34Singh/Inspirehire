import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"

const Education = sequelize.define('Education', {
    EduDetail_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 80000, // Starting from 80XXX
        max: 80999  // Education ID range as specified
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
    Degree: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Start_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    End_Date: {
      type: DataTypes.DATEONLY
    },
    InstitutionName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Field_Of_Study: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'education',
    timestamps: false
  });

  Education.associate = (models) => {
    Education.belongsTo(models.User, {
      foreignKey: 'USER_ID'
    });
  };

  export default Education