import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define('Role', {
  Role_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3]] // Only allow these specific Role IDs
    }
  },
  RoleName: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'role',
  timestamps: false
});

Role.associate = (models) => {
  Role.hasMany(models.User, {
    foreignKey: 'Role_ID'
  });
};

export default Role;
