module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false
        },
        comment: DataTypes.STRING
    }, {
        timestamps: true,
    });

    Role.associate = function(models) {
        Role.hasMany(models.User_has_role, {
            foreignKey: 'role_id'
        });
    };
    return Role;
};
