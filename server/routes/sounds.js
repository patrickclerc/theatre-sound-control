const fs = require('fs');
const db = require('../utils/database.js');
const mqttClient = require('../utils/mqttClient.js');
const io = require('../utils/websocket.js');

mqttClient.subscribe('sound-finished', function (err) {
  if (err) {
    throw  err;
  }
});

mqttClient.on('message', function (topic, message) {
  if (topic === 'sound-finished') {
    console.log('Sound has finished playing!');
    let sql = 'SELECT * FROM sounds WHERE id = ?';
    var sound = JSON.parse(message.toString());
    db.get(sql, [sound.id], (err, row) => {
      io.emit('sound-finished', row);
    });
  }
});

var soundsController = {
  /* GET sounds list */
  getList: function (req, res, next) {
    let sql = 'SELECT * FROM sounds ORDER BY rank';
    db.all(sql, (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.end(JSON.stringify(rows));
    });
  },

  getSoundFile: function (req, res) {
    let sql = 'SELECT * FROM sounds WHERE id = ?';
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      const file = row.localSoundPath;
      fs.exists(file, function (exists) {
        if (exists) {
          const rstream = fs.createReadStream(file);
          rstream.pipe(res);
        } else {
          res.send("File " + file + ' not found !');
          res.end();
        }
      });
    });
  },

  playRemoteSound: function (req, res) {
    let sql = 'SELECT * FROM sounds WHERE id = ?';
    db.get(sql, [req.body.id], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      mqttClient.publish('play-sound', JSON.stringify(row));
      res.end();
    });
  },

  stopRemoteSound: function (req, res) {
    let sql = 'SELECT * FROM sounds WHERE id = ?';
    db.get(sql, [req.body.id], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      mqttClient.publish('stop-sound', JSON.stringify(row));
      res.end();
    });
  },

  changeRemoteVolume: function (req, res) {
    mqttClient.publish('change-volume', req.body.volume);
    res.end();
  }
};

module.exports = soundsController;
