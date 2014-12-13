///<reference path="../../def/phaser.d.ts"/>

import ServerSocket = require('./ServerSocket');

class Blobby {

    private static SERVER_ADDRESS : string = 'localhost:3000';
    private game: Phaser.Game;
    private server : ServerSocket;


    constructor() {
        this.server = new ServerSocket(Blobby.SERVER_ADDRESS);
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    private preload() {

    }

    private create() {
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);
    }

}

export = Blobby;