module.exports = (sequelize, DataTypes) => {
    const User_has_role = sequelize.define('User_has_role', {
    }, {
        timestamps: true,
    });
    User_has_role.associate = function(models) {
        User_has_role.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'cascade',
            constraints: false
        });
        User_has_role.belongsTo(models.Role, {
            foreignKey: 'role_id',
            onDelete: 'cascade',
            constraints: false
        });
    };

    return User_has_role;
};
