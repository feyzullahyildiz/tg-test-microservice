
const queue = 'locations';



const amqplib = require('amqplib');
const start = async () => {

    console.log('STARTED')
    console.log('RABBITMQ_CONNECTION', process.env.RABBITMQ_CONNECTION);
    const conn = await amqplib.connect(process.env.RABBITMQ_CONNECTION, {
        clientProperties: {
            connection_name: 'location_sender'
        }
    })
    console.log('CONNECTED')
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);

    // Sender
    const ch2 = await conn.createChannel();

    let i = 0;
    const DELAY_MS = +process.env.DELAY_MS;
    const intervalDelay = isNaN(DELAY_MS) ? 100 : DELAY_MS;
    console.log('intervalDelay', intervalDelay);
    setInterval(() => {
        const x = 28 + (+Math.random().toFixed(7))
        const y = 41 + (+Math.random().toFixed(7))
        const data = {
            id: '62dbaaa1923af1d368b28a8a',
            date: new Date(),
            location: [x, y]
        }
        ch2.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        i++;
    }, intervalDelay);
    setInterval(() => {
        console.log('Send', i);
    }, 1000)
}

start();