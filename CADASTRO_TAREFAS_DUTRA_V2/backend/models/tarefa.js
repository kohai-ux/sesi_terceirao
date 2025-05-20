const{DataTypes} = require('sequelize');
const sequelize = require('../database/db');

const Tarefa = sequelize.define('Tarefa', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pendente'
    },
})