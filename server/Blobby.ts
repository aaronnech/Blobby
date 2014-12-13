///<reference path="../def/socket.io.d.ts"/>

import Constants = require('./Constants');
import Blob = require('./Blob');
import BlobAction = require('./BlobAction');

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
        console.log('binding ' + Blobby.EVENTS.CLIENT_JOIN);
        this.socket.on(Blobby.EVENTS.CLIENT_JOIN, (client : SocketIO.Socket) => {
            this.onJoinClient(client);
        });
    }

    private bindSocketEvents(client : SocketIO.Socket) {
        client.on(Blobby.EVENTS.CLIENT_DISCONNECT, () => {
            this.onExitClient(client);
        });

        client.on(Blobby.EVENTS.CLICK, (data) => {
            console.log('CLICK EVENT ON SERVER');
            this.onClickAction(data, client);
        });

    }

    public update() {
        // Do update

        var toClient : any = [];
        for (var id in this.blobs) {
            if (this.blobs.hasOwnProperty(id)) {
                var newBlobs : Blob[] = this.blobs[id].update(this.eventQueue[id]);
                for (var i : number = 0; i < newBlobs.length; i++) {
                    this.shrap.push(newBlobs[i]);
                }
                toClient.push(this.blobs[id].toJSON());
                this.eventQueue[id] = [];
            }
        }

        for (var i = 0; i < this.shrap.length; i++) {
            this.shrap[i].update([]);
        }

        // Notify clients
        this.socket.sockets.emit(Blobby.EVENTS.UPDATE, {blobs : toClient, shrap : this.shrap});
    }

    private onJoinClient(client : SocketIO.Socket) {
        console.log('CLIENT JOINED: ' + client);

        var blob : Blob = new Blob(Constants.BLOB_TYPE.USER, client.id);
        client['blobObject'] = blob;

        this.blobs[client.id] = blob;
        this.eventQueue[client.id] = [];
        client.emit(Blobby.EVENTS.START, blob.toJSON());


        this.bindSocketEvents(client);
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