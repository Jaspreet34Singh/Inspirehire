import {DataTypes} from "sequelize"
import sequelize from "../config/database.js"


const AIScreening = sequelize.define('AIScreening', {
    Screening_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 70000, // Starting from 7XXXX
        max: 79999  // Screening ID range
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
    Screening_Decision: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'ai_screening',
    timestamps: false
  });

  AIScreening.associate = (models) => {
    AIScreening.belongsTo(models.Application, {
      foreignKey: 'Application_ID'
    });
  };




export default AIScreening