///<reference path="../../def/socket.io-client.d.ts"/>

class ServerSocket {
    private address : string;
    private socket : SocketIOClient.Socket;

    constructor(address : string) {
        console.log('CONNECTING TO SERVER...');
        this.address = address;
        this.socket = io.connect(this.address, this.onConnect);

        this.bindSocketEvents();
    }

    private bindSocketEvents() {
        //....
    }

    public sendClickEvent(data : any) {

    }

    private onConnect() {
        console.log('CONNECTED!');
    }

}

export = ServerSocket;