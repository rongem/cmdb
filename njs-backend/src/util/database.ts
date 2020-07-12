import mongodb from 'mongodb';
import endpoint from './endpoint.config'

const MongoClient = mongodb.MongoClient;
let _db: mongodb.Db;

export const mongoConnect = (callback: () => void) => {
  MongoClient.connect(endpoint.databaseUrl(), { useUnifiedTopology: true })
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

