const  { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "env inválida");

const configPath = join(__dirname, '../config', `.env.${env}`);

config({
    path: configPath,
});

const MongoDB = require('./db/mongodb/mongodb');
const DBStrategy = require('./db/databaseStrategy');
const HeroiSchema = require('./db/mongodb/schemas/heroiSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoute');
const Postgres = require('./db/postgres/postgres');
const TableUsuario = require('./db/postgres/model/usuario');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package.json');
const HapiJwt = require('hapi-auth-jwt2')

const JWT_SECRET = process.env.JWT_SECRET

const app = new Hapi.Server({
    port: process.env.PORT
});

function mapRoute(instance, methods) {
    return methods.map(method => instance[method]());
}

async function init() {
    const connection = MongoDB.connect();
    const heroisSchema = new DBStrategy(new MongoDB(connection, HeroiSchema))

    const connectionPg = Postgres.connect();
    const model = await Postgres.defineModel(connectionPg, TableUsuario);
    const tableUsuario = new DBStrategy(new Postgres(connectionPg, model));

    app.route([
        ...mapRoute(new HeroRoute(heroisSchema), HeroRoute.methods()),
        ...mapRoute(new AuthRoute(JWT_SECRET, tableUsuario), AuthRoute.methods())
    ]);

    const swaggerOptions = {
        info: {
            title: 'API Herois',
            version: Pack.version,
        }
    }

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }

    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 300
        // },
        validate: async (usuario) => {
            try {
                const [user] = await tableUsuario.read({username: usuario.username.toLowerCase()});
                return {
                    isValid: user ? true : false
                }
            } catch (e) {
                console.error(e)
            };
        }

    });

    app.auth.default('jwt')

    await app.start();
    console.log('Server is running on port: %s', app.info.port);

    return app;
}

module.exports = init();