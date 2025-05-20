const {sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "backend/database/tarefas.sqlite"
});

module.exports = sequelize;
