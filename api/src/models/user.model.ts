import { DataTypes, Sequelize, Model } from 'sequelize';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public roleid!: number;
  public isloggedin!: number; 
  public isActive! : boolean;
  public failedAttempts! : number;
  public role?: Role;
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
      roleid: { type: DataTypes.INTEGER, allowNull: false, references:{model: 'roles' , key: 'roleid'} },
      isloggedin: {
       type: DataTypes.INTEGER,
       allowNull: false,
       defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },
    failedAttempts:{
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
export class Role extends Model {
  public roleid!: number;
  public rolename!: string;
}

export function initRoleModel(sequelize: Sequelize) {
  Role.init(
    {
      roleid: { type: DataTypes.INTEGER,allowNull: false, primaryKey: true, autoIncrement: true },
      rolename: { type: DataTypes.STRING(100), allowNull: false }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      timestamps: false
    }
  );
}
