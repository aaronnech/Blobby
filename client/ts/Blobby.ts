///<reference path="../../def/phaser.d.ts"/>

import ServerSocket = require('./ServerSocket');

class Blobby {

    private static SERVER_ADDRESS : string = 'localhost:3000';
    private game: Phaser.Game;
    private server : ServerSocket;
    private id : string;
    private blobs : any;

    constructor() {
        this.server = new ServerSocket(Blobby.SERVER_ADDRESS);
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.onPreload, create: this.onCreate, update: this.onUpdate });
        this.blobs = {};
        this.bindSocketEvents();
    }

    private bindSocketEvents() {
        this.server.bindEvent(ServerSocket.EVENTS.START, (data) => {
            this.onStartGame(data);
        });
        this.server.bindEvent(ServerSocket.EVENTS.UPDATE, (data) => {
            this.onDraw(data);
        });
    }

    private onPreload() {

    }

    private onCreate() {

    }

    private onUpdate() {
        if (this.game.input['activePointer'].isDown) {
            this.server.sendClickEvent(
                {dx : this.game.input['activePointer'].x - this.blobs[this.id].x,
                 dy : this.game.input['activePointer'].y - this.blobs[this.id].y});
        }
    }

    private onStartGame(data) {
        this.id = data.id;
        console.log('Game Started!');
    }

    private onDraw(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var blobData = data[i];
            this.blobs[blobData.id] = blobData;
            this.game['debug'].geom(
                new Phaser.Circle(blobData.x, blobData.y, 2.0 * Math.sqrt(blobData.mass/Math.PI)), blobData.color, true);
        }
    }

    private onConnect() {
        console.log('Connected');
    }
}

export = Blobby;