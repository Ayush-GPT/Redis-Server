const net = require('net');
const Parser = require('redis-parser');

const Store = {};

const server = net.createServer((connection) => {
    console.log('Client connected');

    const parser = new Parser({
        returnReply: (reply) => {
            const command = reply[0].toLowerCase(); // Convert command to lowercase for case insensitivity
            switch (command) {
                case 'set': {
                    const key = reply[1];
                    const value = reply[2];
                    Store[key] = value;
                    connection.write('+OK\r\n'); // Acknowledge the SET command
                    break;
                }
                case 'get': {
                    const key = reply[1];
                    const value = Store[key];
                    if (value !== undefined) {
                        connection.write(`$${value.length}\r\n${value}\r\n`);
                    } else {
                        connection.write('$-1\r\n'); // Key not found
                    }
                    break;
                }
                default: {
                    connection.write('-ERR unknown command\r\n'); // Invalid command
                    break;
                }
            }
        },
        returnError: (err) => {
            console.log('=>', err);
            connection.write(`-ERR ${err}\r\n`); // Handle errors
        }
    });

    connection.on('data', (data) => {
        parser.execute(data);
    });

    connection.on('end', () => {
        console.log('Client disconnected');
    });

    connection.on('error', (err) => {
        console.error('Connection error:', err);
    });
});

server.listen(8000, () => {
    console.log('Server started on port 8000');
});
