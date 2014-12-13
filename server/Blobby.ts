///<reference path="../def/socket.io.d.ts"/>

import Constants = require('./Constants');
import Blob = require('./Blob');
import BlobAction = require('./BlobAction');
import CollisionManager = require('./CollisionManager');

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

        // Update the client blobs
        var toClient : any = [];
        for (var id in this.blobs) {
            if (this.blobs.hasOwnProperty(id)) {
                var currentBlob : Blob = this.blobs[id];

                // Update and get shrapnel
                var newBlobs : Blob[] = currentBlob.update(this.eventQueue[id]);
                for (var i : number = 0; i < newBlobs.length; i++) {
                    this.shrap.push(newBlobs[i]);
                }

                // All events have been processed so empty the queue
                this.eventQueue[id] = [];

                // Check each shrapnel and eat if necessary
                for (var i = 0; i < this.shrap.length; i++) {
                    if (CollisionManager.isCollision(currentBlob, this.shrap[i])) {
                        // Collision occurred, transfer mass
                        currentBlob.setMass(currentBlob.getMass() + this.shrap[i].getMass());
                        this.shrap.splice(i, 1);
                    }
                }

                // Check all other blobs and kill this blob if necessary
                for (var otherId in this.blobs) {
                    if (this.blobs.hasOwnProperty(otherId) && otherId != id) {
                        var otherBlob : Blob = this.blobs[otherId];
                        if (CollisionManager.isCollision(currentBlob, otherBlob)) {
                            if (currentBlob.getMass() > otherBlob.getMass()) {
                                // currentBlob eats otherBlob
                                currentBlob.setMass(currentBlob.getMass() + otherBlob.getMass());
                                delete this.blobs[otherId];
                                this.blobs[otherId] = new Blob(Constants.BLOB_TYPE.USER, id);
                            } else {
                                // otherBlob eats currentBlob
                                otherBlob.setMass(currentBlob.getMass() + otherBlob.getMass());
                                delete this.blobs[id];
                                this.blobs[id] = new Blob(Constants.BLOB_TYPE.USER, id);
                            }
                        }
                    }
                }

                // Push a client version into an array to render if we survived the gameloop
                toClient.push(this.blobs[id].toJSON());
            }
        }

        // Update their shrapnel
        for (var i = 0; i < this.shrap.length; i++) {
            this.shrap[i].update([]);
        }

        // Notify clients
        this.socket.sockets.emit(Blobby.EVENTS.UPDATE, {blobs : toClient, shrap : this.shrap});
    }

    private onJoinClient(client : SocketIO.Socket) {
        console.log('CLIENT JOINED: ' + client);

        var blob : Blob = new Blob(Constants.BLOB_TYPE.USER, client.id);

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