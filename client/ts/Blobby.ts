///<reference path="../../def/phaser.d.ts"/>

import ServerSocket = require('./ServerSocket');

class Blobby {

    private static SERVER_ADDRESS : string = 'localhost:3000';
    private game: Phaser.Game;
    private server : ServerSocket;

    constructor() {
        this.server = new ServerSocket(Blobby.SERVER_ADDRESS, this.onConnect);
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
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);
    }

    private onStartGame() {
        console.log('Game Started!');
    }

    private onDraw(data) {
        for (var i = 0; i < data.length; i++) {

        }
    }

    private onConnect() {
        console.log('Connected');
    }
}

export = Blobby;