const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const BaseRoute = require("./base/baseRoute");
const Jwt = require('jsonwebtoken');
const PasswrodHelper = require('../helper/passwordHelper')

const failAction = (request, headers, error) => {
    throw error;
}

class AuthRoute extends BaseRoute {
    constructor(secret, db) {
        super();
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obtém token de autenticação',
                notes: 'Realiza login',
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }),
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload
                const [usuario] = await this.db.read({username: username.toLowerCase()});

                if (!usuario || !PasswrodHelper.compare(password, usuario.password)) {
                    return Boom.unauthorized('Usuário ou senha incorreta!')  
                } 

                const token = Jwt.sign({
                    username,
                    id: usuario.id,
                }, this.secret);

                return {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoute