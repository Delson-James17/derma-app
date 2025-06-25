import { DataTypes, Sequelize, Model } from 'sequelize';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isloggedin!: number; 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(50), allowNull: false },
      isloggedin: {
       type: DataTypes.INTEGER,
       allowNull: false,
       defaultValue: 0
    }

    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'createdat',
      updatedAt: 'updatedat'
    }
  );
}
