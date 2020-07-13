## ---- MONGODB

docker exec -it mongodb \
    mongo --host localhost -u admin -p admin --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'alex', pwd: 'alex', roles: [{role: 'readWrite', db: 'herois'}]})"
    
docker exec -it mongodb \
   mongo --host localhost -u alex -p alex --authenticationDatabase herois
   
## Create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

## Read
db.herois.find()
db.herois.find().pretty()
db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1}) -- Digitar 'it' para passar a página

## Update
db.herois.update({ nome: 'Flash' }, { nome: 'Mulher maravilha' })

db.herois.update({ nome: 'Flash' }, { nameofhero: 'Mulher maravilha' })

db.herois.update({nome: 'Flash'}, { $set: { nome: 'Mulher maravilha' } })

db.herois.update({nome: 'Flash'}, { $set: { nome: 'Mulher maravilha' } }, { multi: true })

## Delete
db.herois.remove({})
db.herois.remove({ nome: 'Flash' })
