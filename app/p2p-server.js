const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer{
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', sockets=> this.connectSocket(sockets));
        this.connectPeers();
        console.log('Listening for peer-to-peer connections on: ',P2P_PORT);
    }

    connectPeers() {
        peers.forEach(peer =>{
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('socket connected');

        this.messageHandler(socket);

        this.sendChian(socket)
    }

    sendChian(socket) {
        socket.send(JSON.stringify(this.blockchain.chain))
    }

    messageHandler(socket) {
        socket.on('message', message =>{
            const data = JSON.parse(message);
            console.log('data', data);

            this.blockchain.replaceChain(data)
        })
    }

    syncChain() {
        this.sockets.forEach(socket  => this.sendChian(socket));
    }
}

module.exports = P2pServer;