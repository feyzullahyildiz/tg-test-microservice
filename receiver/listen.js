require('dotenv').config()
const queue = 'locations';
const amqplib = require('amqplib');
const mongoose = require('mongoose');
const { locationSchema } = require('./model')
let index = 0;
const start = async () => {

    console.log('STARTED')
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log('MONGODB_CONNECTION', process.env.MONGODB_CONNECTION);
    console.log('DB CONNECTED')
    const LocationModel = mongoose.model('Location', locationSchema);
    await LocationModel.createCollection();
    console.log('createCollection')



    console.log('RABBITMQ_CONNECTION', process.env.RABBITMQ_CONNECTION);
    const conn = await amqplib.connect(process.env.RABBITMQ_CONNECTION, {
        clientProperties: {
            connection_name: 'location_writer'
        }
    })
    console.log('Rabbitmq CONNECTED')
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);

    // Listener
    ch1.consume(queue, async (msg) => {
        if (msg !== null) {
            index++;
            const { id, date, location } = JSON.parse(msg.content);
            await LocationModel.create({
                courierId: id,
                location: {
                    type: 'Point',
                    coordinates: location
                },
                date
            })
            ch1.ack(msg);
        } else {
            console.log('Consumer cancelled by server');
        }
    });
    setInterval(() => {
        console.log('Rec', index);
    }, 5 * 1000)

}

start();