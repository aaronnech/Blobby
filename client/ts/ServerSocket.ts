///<reference path="../../def/socket.io-client.d.ts"/>

class ServerSocket {
    public static EVENTS : any = {
        CONNECT : 'connect',
        CLICK : 'click',
        UPDATE : 'update',
        START : 'start'
    };


    private address : string;
    private socket : SocketIOClient.Socket;

    constructor(address : string) {
        console.log('CONNECTING TO SERVER...');
        this.address = address;
        this.socket = io.connect(this.address);
        // Add a connect listener
        this.socket.on(ServerSocket.EVENTS.CONNECT, () => {
            console.log("Connected");
        });
    }

    public bindEvent(event : string, fn : Function) {
        this.socket.on(event, fn);
    }

    public sendClickEvent(data : any) {
        console.log('CLICK');
        console.log(data);
        this.socket.emit(ServerSocket.EVENTS.CLICK, data);
    }
}

export = ServerSocket;