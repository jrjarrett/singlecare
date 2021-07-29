var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = "";
let cachedDb = null;

var main = function () {

    // connectToDatabase(MONGODB_URI)
    //   .then(db => queryDatabase(db))
    //   //.then(result => sendCw(result))
    //   .then(result => {
    //       console.log('=> returning result: ', result);
    //       Promise.resolve(result);
    //       //callback(null, result.length);
    //   })
    //   .catch(err => {
    //       console.log('=> an error occurred: ', err);
    //       //callback(err);
    //   });

    let totalSingleCareNumbers;
    MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
      if (err) {
        console.error('An error occurred connecting to the database: ' + err);
        process.exit(1);
      } else {
        console.log('=> query database');
        let dbString = "";
        if (process.env.ENVIRONMENT == 'stage'){
          dbString = 'Fetch_V2_Staging';
        }
        else if (process.env.ENVIRONMENT == 'prod'){
          dbString = 'Fetch_V2_Production';
        } else {
          dbString = 'Fetch_V2_Dev';
        }
        console.log('=======> connecting to ' + dbString);
        var db2 = db.db(dbString);
        console.log('=======> running query');

        var x = db2.collection('UserSingleCareNumber').countDocuments({"assignedDate":{$exists:false}},{}, function (err, docCount) {
          if (err) {
            console.log('Error in countDocuments '+ err);
            return null;
          }
          if (docCount) {
            console.log('The number of Sc numbers is ' + docCount);
            totalSingleCareNumbers = docCount;
            db.close();
          }
        });
        console.log('At bottom of countDocument x is ' + x);
      }
    });
    return totalSingleCareNumbers;
}

if (require.main === module) {
  main()
}
