///<reference path="../../def/phaser.d.ts"/>

import ServerSocket = require('./ServerSocket');

class Blobby {

    private static SERVER_ADDRESS : string = 'localhost:3000';
    private game: Phaser.Game;
    private server : ServerSocket;

    constructor() {
        this.server = new ServerSocket(Blobby.SERVER_ADDRESS);
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.onPreload, create: this.onCreate });

        this.bindSocketEvents();
    }

    private bindSocketEvents() {
        this.server.bindEvent(ServerSocket.EVENTS.START, this.onStartGame);
        this.server.bindEvent(ServerSocket.EVENTS.UPDATE, this.onDraw);
    }

    private onPreload() {

    }

    private onCreate() {

    }

    private onStartGame() {
        console.log('Game Started!');
    }

    private onDraw(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {

        }
    }

    private onConnect() {
        console.log('Connected');
    }
}

export = Blobby;