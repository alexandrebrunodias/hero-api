const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');
const Boom = require('boom')

const failAction = (request, headers, error) => {
    throw error;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();

class HeroRoute extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Lista heróis',
                notes: 'É possível filtrar por nome ou id',
                validate: {
                    failAction,
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                        id: Joi.string()
                    })
                }
            },
            handler: request => {
                try {
                    const { nome, skip, limit, id } = request.query;
                    const query = nome ? { nome: { $regex: `.*${nome}.*` } } : {};
                    
                    if(id) {
                        query._id = id
                    }

                    return this.db.read(query, skip, limit);
                } catch (error) {
                    console.log('DEU ÁGUIA', error);
                    return Boom.internal();
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cria um herói',
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100),
                    })
                }
            },
            handler: async request => {
                try {
                    const { nome, poder } = request.payload
                    const heroi = await this.db.create({nome, poder});
                    
                    return {
                        _id: heroi._id,
                        message: 'Herói cadastrado com sucesso!'
                    }

                } catch (error) {
                    console.log('Deu ruim ', error)
                    return Boom.internal()
                }
            }

        }

    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualiza um herói',
                notes: 'Informe o ID de um herói previamente cadastrado',
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: async request => {
                try {
                    const { id } = request.params
                    let { payload } = request

                    payload = JSON.stringify(payload);
                    payload = JSON.parse(payload);

                    const result = await this.db.update(id, payload);
                    if(result.nModified !== 1) return Boom.preconditionFailed('Héroi não encontrado')
                    
                    return {
                        message: 'Herói atualizado com sucesso!'
                    }

                } catch (error) {
                    console.error('DEU ÁGUA: ', error)
                    return Boom.internal();
                };
            }
        }
    }

    delete() {
        return {
            method: 'DELETE',
            path: '/herois/{id}',
            config: {
                tags: ['api'],
                description: 'Deleta um herói',
                notes: 'Informe o ID de um herói previamente cadastrado',
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async request => {
                try {
                    const { id } = request.params;
                    const result = await this.db.delete(id);

                    if(result.n !== 1) return Boom.preconditionFailed('Héroi não encontrado')

                    return {
                        message: 'Herói removido com sucesso!'
                    }

                } catch(error) {
                    console.error('DEU ÁGUIA: ', error);
                    return Boom.internal();
                };
            }
        }
    }
};

module.exports = HeroRoute;