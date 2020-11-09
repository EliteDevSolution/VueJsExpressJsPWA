module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "/storage/user-data/default-avatar.png",
        },
        accessToken: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        },
        emailConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailConfirmationToken: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
        },
        resetPasswordTokenExpiration: {
            type: DataTypes.DATE
        },
    }, {
        timestamps: true,
    });

    User.associate = (models) => {
        User.hasMany(models.User_has_role, {
            foreignKey: 'user_id',
            onDelete: 'cascade'
        });
    }
    return User;
};
