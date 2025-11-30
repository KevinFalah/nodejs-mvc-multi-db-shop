const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const pw = '5IqJsiVLh7etjMQe';
const uri =
  `mongodb+srv://dewanacreator_db_user:${pw}@cluster0.246kbps.mongodb.net/shop?appName=Cluster0`;

let _db;

const mongoConnect = callback => {
  console.log('MONGO CONNECT FUNCTION...')
  mongoClient
    .connect(uri)
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db
  }

  throw "No Database Found!"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
