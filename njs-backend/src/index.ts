import mongoose from 'mongoose';
// import socket from './controllers/socket.controller';
import { HouseKeeping } from './models/abstraction-layer/housekeeping';
import endpoint from './util/endpoint.config';
import { app } from './app';

mongoose.connect(endpoint.databaseUrl()).then(() => {
    const server = app.listen(8000);
    // const io = socket.init(server);
    // io.of('/rest').use((s, next) => {
    //   console.log('Client connected:', s.client.conn);
    // });
    HouseKeeping.getInstance().start();
  }).catch(reason => console.log(reason));
  
  