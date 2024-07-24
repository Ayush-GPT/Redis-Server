const net = require('net');

// Connect to the server
const client = net.createConnection({ port: 8000 }, () => {
    console.log('Connected to server');

    // Send commands to the server
    client.write('*3\r\n$3\r\nSET\r\n$4\r\nkey1\r\n$5\r\nvalue\r\n');
    client.write('*2\r\n$3\r\nGET\r\n$4\r\nkey1\r\n');
});

// Handle data received from the server
client.on('data', (data) => {
    console.log('Server response:', data.toString());
});

// Handle connection end
client.on('end', () => {
    console.log('Disconnected from server');
});

// Handle connection error
client.on('error', (err) => {
    console.error('Connection error:', err);
});
