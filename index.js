const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { sequelize, Personaje } = require('./models/Personaje');

// Definición del esquema GraphQL
const typeDefs = gql`
    type Personaje {
        id: ID!
        nombre: String!
        pelicula: String!
    }

    type Query {
        personajes: [Personaje]
    }

    type Mutation {
        crearPersonaje(nombre: String!, pelicula: String!): Personaje
        actualizarPersonaje(id: ID!, nombre: String, pelicula: String): Personaje
        eliminarPersonaje(id: ID!): Personaje
    }
`;

// Resolver para las queries y mutations
const resolvers = {
    Query: {
        personajes: async () => await Personaje.findAll(),
    },
    Mutation: {
        crearPersonaje: async (_, { nombre, pelicula }) => {
            const nuevoPersonaje = await Personaje.create({ nombre, pelicula });
            return nuevoPersonaje;
        },
        actualizarPersonaje: async (_, { id, nombre, pelicula }) => {
            const personaje = await Personaje.findByPk(id);
            if (personaje) {
                personaje.nombre = nombre !== undefined ? nombre : personaje.nombre;
                personaje.pelicula = pelicula !== undefined ? pelicula : personaje.pelicula;
                await personaje.save();
                return personaje;
            }
            throw new Error("Personaje no encontrado");
        },
        eliminarPersonaje: async (_, { id }) => {
            const personaje = await Personaje.findByPk(id);
            if (personaje) {
                await personaje.destroy();
                return personaje;
            }
            throw new Error("Personaje no encontrado");
        },
    }
};

// Crear el servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Iniciar el servidor Express
const app = express();
server.start().then((response) => {
    server.applyMiddleware({ app });
})

// Sincronizar la base de datos y luego iniciar el servidor
const PORT = 4000;
sequelize.sync().then(() => {
    insertarDatosPrueba();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor listo en http://localhost:${PORT}${server.graphqlPath}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});

async function insertarDatosPrueba() {
    const personajesPrueba = [
        { nombre: 'Mario', pelicula: 'Super Mario Bros' },
        { nombre: 'Luigi', pelicula: 'Super Mario Bros' },
        { nombre: 'Princess Peach', pelicula: 'Super Mario Bros' },
        { nombre: 'Link', pelicula: 'The Legend of Zelda: A Link to the Past' },
        { nombre: 'Zelda', pelicula: 'The Legend of Zelda: Ocarina of Time' },
        { nombre: 'Sonic', pelicula: 'Sonic the Hedgehog' },
        { nombre: 'Tails', pelicula: 'Sonic the Hedgehog' },
        { nombre: 'Pikachu', pelicula: 'Pokémon: Detective Pikachu' },
        { nombre: 'Ash Ketchum', pelicula: 'Pokémon: The First Movie' },
        { nombre: 'Donkey Kong', pelicula: 'Donkey Kong Country' }
    ];
  
    for (const personaje of personajesPrueba) {
        await Personaje.findOrCreate({
            where: { nombre: personaje.nombre, pelicula: personaje.pelicula }
        });
    }
}