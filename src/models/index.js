const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Request = require('./request')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);

db.Request.hasMany(db.Product, { foreignKey: 'request_id' });
db.Product.belongsTo(db.Request, { foreignKey: 'request_id' });

db.Product.hasMany(db.Image, { foreignKey: 'product_id' });
db.Image.belongsTo(db.Product, { foreignKey: 'product_id' });

module.exports = db;
