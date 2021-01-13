import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';


export class Socket {
    private dontEmitWhenConfigurationIsMissing = true;
    io!: Server;
    init = (httpServer: HttpServer, ignoreMissingConfiguration = false) => {
        this.io = new Server(httpServer);
        this.dontEmitWhenConfigurationIsMissing = ignoreMissingConfiguration;
        return this.io;
    }

    get instance(): Server {
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
