const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a la base de datos SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Define el modelo de Personaje
const Personaje = sequelize.define('Personaje', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pelicula: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sincroniza el modelo con la base de datos
sequelize.sync();

module.exports = { sequelize, Personaje };
