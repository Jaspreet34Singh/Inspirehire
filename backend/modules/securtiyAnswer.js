import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const SecurityAnswer = sequelize.define('SecurityAns', {
    Security_Answer_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        min: 95000, // Starting from 95XXX
        max: 95999  // Security Answer ID range
      }
    },
    Security_Question_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'security_question',
        key: 'Question_ID'
      }
    },
    User_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'User_ID'
      }
    },
    Answer: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'security_ans',
    timestamps: false
  });

  SecurityAnswer.associate = (models) => {
    SecurityAnswer.belongsTo(models.SecurityQuestion, {
      foreignKey: 'Security_Question_ID'
    });
    SecurityAnswer.belongsTo(models.User, {
      foreignKey: 'User_ID'
    });
  };

export default SecurityAnswer;
