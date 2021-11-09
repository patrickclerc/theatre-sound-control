var mqtt = require('mqtt');
const io = require("../utils/websocket.js");
const host = 'mqtt://192.168.105.3';
const options = {
  port: 1883,
  host: host,
  clientId: 'theaterSoundControl',
  username: 'patrick',
  password: 'RVD3Wyd2LQvqZJ7G',
  clean: true,
  encoding: 'utf8',
  reconnectPeriod: 1000,
  keepalive: 2

};
var client = mqtt.connect(host, options);

client.on("connect", function () {
  console.log("MQTT client connected");
  io.emit('mqtt-connected');
});

client.on("reconnect", function () {
  console.log("MQTT client reconnecting");
});

client.on("error", function (error) {
  console.log("Can't connect" + error);
  io.emit('mqtt-disconnected');
});

client.on("close", function (error) {
  console.log("End of MQTT connection");
  io.emit('mqtt-disconnected');
});

client.on("disconnect", function (error) {
  console.log("Disconnect from MQTT");
  io.emit('mqtt-disconnected');
});

module.exports = client;
