import express from 'express';
import { createServer } from 'node:http';


import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import field from './field.mjs';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, "dist", 'index.html'));
});


app.use(express.static("dist"))

const range = N => {
    const r = [];
    for (let i = 0; i < N; i++) {
        r.push(i);
    }
    return r;
};

const randomInt = N => Math.trunc(Math.random() * N);

const use = (v, f) => f(v);

const shuffle = (arr, r = []) =>
    use(arr.map(e => e), a => range(arr.length).map(i =>
        a.splice(randomInt(a.length), 1)[0]
    ));

const users = [];
const games = [];

io.on('connection', (socket) => {
    users.push(socket.id)
    io.emit("hi", { id: socket.id, users })
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        users.splice(users.indexOf(socket.id))
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        io.emit("field", { field: (field.initialField) })
    });

    socket.on('enter', msg =>
        socket.join(msg)
    );


});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
