const { MongoClient } = require("mongodb");
module.exports = async (data, uri, database, collection, password) => {
  const CONNECTION_URL = uri + "/" + database;
  const client = new MongoClient(CONNECTION_URL);
  await client.connect();
  const coll = client.db().collection(collection);
  try {
    await coll.insertOne(data); // duplicate key error
  } catch (error) {
    log(error);
    process.exit();
  }
};
