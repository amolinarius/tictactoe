import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';
    
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const sockets = [];
var cells = [];
for (let i = 0; i<9; i++) {cells.push(null)}

io.on('connection', socket => {
    if (sockets.length <= 1) {
        sockets.push(socket);
        socket.emit('board', cells);
        socket.emit('symbol', sockets.length==1?"X":"O");
        socket.on('disconnect', () => {
            sockets.splice(sockets.indexOf(socket));
            if (sockets.length == 0) {
                cells = [];
                for (let i = 0; i<9; i++) {cells.push(null)}
            }
        });
        socket.on('click', cell => {
            if (cell >= 0 && cell <= 8) {
                cells[cell] = sockets.indexOf(socket)==0?"X":"O";
                io.emit('click', sockets.indexOf(socket)==0?"X":"O", cell);
            }
        })
    }
    else { socket.emit('symbol', null); }
})

app.use(express.static(__dirname + '/client'));

server.listen(3000); // SERVER PORT