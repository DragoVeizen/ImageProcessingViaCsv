module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        request_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Product;
};
