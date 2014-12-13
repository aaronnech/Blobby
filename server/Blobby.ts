///<reference path="../def/socket.io.d.ts"/>

import Constants = require('./Constants');

class Blobby {
    private static EVENTS : any = {
        CLIENT_JOIN : 'connection',
        START : 'start',
        UPDATE : 'update'
    };


    private blobs : Blob[];
    private socket : SocketIO.Server;

    constructor(socket : SocketIO.Server) {
        this.socket = socket;
        this.blobs = [];

        this.bindSocketEvents();
    }

    private bindSocketEvents() {
        this.socket.on(Blobby.EVENTS.CLIENT_JOIN, this.joinClient);
    }

    public update() {
        this.socket.sockets.emit(Blobby.EVENTS.UPDATE, this.blobs);
    }

    private joinClient(client : SocketIO.Socket) {
        console.log('CLIENT JOINED: ' + client);
        client.emit(Blobby.EVENTS.START, {'startX' : 200, 'startY' : 200});
    }
}


export = Blobby;