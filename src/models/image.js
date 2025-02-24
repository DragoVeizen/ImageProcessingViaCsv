module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        input_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        output_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Image;
};
