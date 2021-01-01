import { Server } from 'http';
import socket from 'socket.io';


export class Socket {
    private dontEmitWhenConfigurationIsMissing = true;
    io!: socket.Server;
    init = (httpServer: Server, ignoreMissingConfiguration = false) => {
        this.io = socket(httpServer);
        this.dontEmitWhenConfigurationIsMissing = ignoreMissingConfiguration;
        return this.io;
    }

    get instance(): socket.Server {
        if (!this.io) {
            throw new Error('Socket.io not initialized!');
        }
        return this.io;
    }

    emit = (action: string, context: string, data: any) => {
        if (this.dontEmitWhenConfigurationIsMissing && !this.io) {
            return;
        }
        this.instance.emit(context + '.' + action, {
            action,
            context,
            data
        });
    }
}

const s = new Socket();

export default s;
