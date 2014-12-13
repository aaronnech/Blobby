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
        this.game = new Phaser.Game(
            800, 600, Phaser.AUTO,
            'content', { preload: this.onPreload, create: () => { this.onCreate() } });
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
        this.game.input['onDown'].add(this.onMouseDown, this);
    }

    private onMouseDown() {
        console.log(this.game.input['mousePointer']);
        console.log(this.blobs[this.id]);
        this.server.sendClickEvent(
            {dx : this.game.input['mousePointer'].x - this.blobs[this.id].x,
             dy : this.game.input['mousePointer'].y - this.blobs[this.id].y});
    }

    private onStartGame(data) {
        this.id = data.id;
        this.blobs[this.id] = data;
        console.log('Game Started!');
    }

    private onDraw(data) {
        for (var i = 0; i < data.blobs.length; i++) {
            var blobData = data.blobs[i];
            this.blobs[blobData.id] = blobData;
            var color = (this.id == blobData.id) ? '#1111FF' : '#444444';
            this.game['debug'].geom(
                new Phaser.Circle(blobData.x, blobData.y, 2.0 * Math.sqrt(blobData.mass/Math.PI)), color, true);
        }

        for (var i = 0; i < data.shrap.length; i++) {
            var shrapData = data.shrap[i];
            this.game['debug'].geom(
                new Phaser.Circle(shrapData.x, shrapData.y, 2.0 * Math.sqrt(shrapData.mass/Math.PI)), '#444444', true);
        }
    }

    private onConnect() {
        console.log('Connected');
    }
}

export = Blobby;