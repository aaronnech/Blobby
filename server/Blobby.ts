///<reference path="../def/socket.io.d.ts"/>

import Constants = require('./Constants');
import Blob = require('./Blob');

class Blobby {
    private static EVENTS : any = {
        CLIENT_JOIN : 'connection',
        CLIENT_DISCONNECT : 'disconnect',
        START : 'start',
        UPDATE : 'update',
        CLICK : 'click'
    };


    private blobs : Blob[];
    private socket : SocketIO.Server;

    constructor(socket : SocketIO.Server) {
        this.socket = socket;
        this.blobs = [];

        this.bindSocketEvents();
    }

    private bindSocketEvents() {
        this.socket.on(Blobby.EVENTS.CLIENT_JOIN, (client : SocketIO.Socket) => {
            this.onJoinClient(client);
        });
        this.socket.on(Blobby.EVENTS.CLICK, (client : SocketIO.Socket) => {
            this.onClickAction(client);
        });
    }

    public update() {
        // Do update
        for (var i : number = 0; i < this.blobs.length; i++) {
            var newBlobs : Blob[] = this.blobs[i].update([]);
            this.blobs.concat(newBlobs);
        }

        // Notify clients
        this.socket.sockets.emit(Blobby.EVENTS.UPDATE, this.blobs.map((blob) => {
            return blob.toJSON();
        }));
    }

    private onJoinClient(client : SocketIO.Socket) {
        console.log('CLIENT JOINED: ' + client);

        var blob : Blob = new Blob(Constants.BLOB_TYPE.USER, client.id);
        client['blobObject'] = blob;

        this.blobs.push(blob);
        client.emit(Blobby.EVENTS.START, {'blob' : blob.toJSON()});

        // Setup disconnect hook
        client.on(Blobby.EVENTS.CLIENT_DISCONNECT, (client : SocketIO.Socket) => {
            this.onExitClient(client);
        });
    }

    private onClickAction(client : SocketIO.Socket) {
        console.log('CLICK ACTION: ' + client);
    }

    private onExitClient(client : SocketIO.Socket) {
        console.log('CLIENT LEFT: ' + client);
    }
}


export = Blobby;