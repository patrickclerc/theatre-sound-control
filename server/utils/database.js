const sqlite3 = require('sqlite3').verbose();
const databasePath = '/home/patrick/Documents/theater-sound-control/db/TheaterSoundControl.db';

let db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the TheaterSoundControl database.');
  }
});


module.exports = db;
