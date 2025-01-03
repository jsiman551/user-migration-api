import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    age?: number;
    role: 'user' | 'admin';
    password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public age?: number;
    public role!: 'user' | 'admin';
    public password!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Hash password
    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    // Verify password
    public async verifyPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 1,
            },
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

User.addHook('beforeSave', async (user: User) => {
    if (user.changed('password')) {
        user.password = await User.hashPassword(user.password);
    }
});

export default User;
