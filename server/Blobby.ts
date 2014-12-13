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


    private blobs : any;
    private eventQueue : any;
    private shrap : Blob[];
    private socket : SocketIO.Server;

    constructor(socket : SocketIO.Server) {
        this.socket = socket;
        this.blobs = {};
        this.eventQueue = {};
        this.shrap = [];

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

        var toClient : any = [];
        for (var id in this.blobs) {
            if (this.blobs.hasOwnProperty(id)) {
                var newBlobs : Blob[] = this.blobs[id].update([]);
                this.shrap.concat(newBlobs);
                toClient.push(this.blobs[id].toJSON());
            }
        }

        // Notify clients
        this.socket.sockets.emit(Blobby.EVENTS.UPDATE, toClient);
    }

    private onJoinClient(client : SocketIO.Socket) {
        console.log('CLIENT JOINED: ' + client);

        var blob : Blob = new Blob(Constants.BLOB_TYPE.USER, client.id);
        client['blobObject'] = blob;

        this.blobs[client.id] = blob;
        this.eventQueue[client.id] = [];
        client.emit(Blobby.EVENTS.START, {'blob' : blob.toJSON()});

        // Setup disconnect hook
        client.on(Blobby.EVENTS.CLIENT_DISCONNECT, () => {
            this.onExitClient(client);
        });
    }

    private onClickAction(data, client : SocketIO.Socket) {
        console.log('CLICK ACTION: ' + client);

        this.eventQueue[client.id].push(new BlobAction(data.dx, data.dy, 2));
    }

    private onExitClient(client : SocketIO.Socket) {
        console.log('CLIENT LEFT: ' + client);
        delete this.blobs[client.id];
        delete this.eventQueue[client.id];
    }
}


export = Blobby;