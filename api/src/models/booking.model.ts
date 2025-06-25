import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface BookingAttributes {
  id?: number;
  userId: string;
  service: string;
  date: string;
  time: string;
  status?: string;
  details?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingCreationAttributes = Optional<BookingAttributes, 'id' | 'status' | 'details'>

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public userId!: string;
  public service!: string;
  public date!: string;
  public time!: string;
  public status!: string;
  public details?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initBookingModel = (sequelize: Sequelize) => {
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    },
    details: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings'
  });
};
