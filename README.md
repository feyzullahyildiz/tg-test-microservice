# [first read here](https://github.com/feyzullahyildiz/nestjs-microservice-case)
# test steps


## create docker service network
- `docker network create tg --driver overlay --attachable`
- in this way, we create a network called `tg`
## install rabbitmq
- `docker run -d --name tg-rabbitmq --network tg -p 5672:5672 -p 5673:5673 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=tg_rabbit_user -e RABBITMQ_DEFAULT_PASS=tg_rabbit_pass rabbitmq:3.8-management`
- this is not service, so we cannot scale horizonatally :(
## install mongo
- `docker run -d --name tg-mongo --network tg -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=tg_mongo_user -e MONGO_INITDB_ROOT_PASSWORD=tg_mongo_pass mongo:5.0.9`
## Listener
### Dockerize
- `cd receiver`
- `docker build . -t tg-listener`

### Create as docker service
```BASH
docker service create --name tg-location-writer \
    --network tg \
    -e RABBITMQ_CONNECTION=amqp://tg_rabbit_user:tg_rabbit_pass@tg-rabbitmq:5672 \
    -e MONGODB_CONNECTION=mongodb://tg_mongo_user:tg_mongo_pass@tg-mongo:27017 \
    tg-listener
```
#### Scale
- `docker service scale tg-location-writer=10`

## Sender
- `cd sender`
- `docker build . -t tg-sender`
### Create as docker service
```
docker service create --name tg-data-sender \
    --network tg \
    -e RABBITMQ_CONNECTION=amqp://tg_rabbit_user:tg_rabbit_pass@tg-rabbitmq:5672 \
    tg-sender
```
### Change sender message delay as ms
docker service update tg-data-sender --env-add DELAY_MS=1 
### Scale sender
docker service scale tg-data-sender=5 
