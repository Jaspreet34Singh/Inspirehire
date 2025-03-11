import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SecurityQuestion = sequelize.define('SecurityQuestion', {
  Question_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    validate: {
      min: 96000, // Starting from 96XXX
      max: 96999  // Security Question ID range
    }
  },
  Question: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'security_question',
  timestamps: false
});

SecurityQuestion.associate = (models) => {
  SecurityQuestion.hasMany(models.SecurityAns, {
    foreignKey: 'Security_Question_ID'
  });
};

export default SecurityQuestion;
