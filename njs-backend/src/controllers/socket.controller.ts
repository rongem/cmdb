import { Server } from 'http';
import socket from 'socket.io';


export class Socket {
    io!: socket.Server;
    init = (httpServer: Server) => {
        this.io = socket(httpServer);
        return this.io;
    }

    get instance() {
        if (!this.io) {
            // throw new Error('Socket.io not initialized!');
            return {
                emit: () => {},
            };
        }
        return this.io;
    }

    emit = (action: string, context: string, data: any) => {
        this.instance.emit(context + '.' + action, {
            action,
            context,
            data
        });
    }
}

const s = new Socket();

export default s;
