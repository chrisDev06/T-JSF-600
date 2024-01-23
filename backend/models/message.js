let MongoClient = require('mongodb').MongoClient;
const mongoDB = "mongodb+srv://maximeparisi:4nloXstxn8UHz1L7@cluster0.bbwhcld.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(mongoDB, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});