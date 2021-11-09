# Raspberry Pi installation description

This document present the installation details to have a running Rpi working with the current application.
The following technologies are used: 

- Raspberry Pi 3 Model B v1.2
- Image: 2018-06-27-raspbian-stretch-lite
- Installation with Etcher (from resin.io)
- SSH for configuration
- Mosquitto for MQTT 
- Node red

- ??? Audio player


## Default user/pwd

user: pi
password: raspberry

## General configurations with raspi-config
`sudo raspi-config`

- Keyboard configuration

`Localisation`
`Keyboard layout`
`German Switzerland`
`French Switzerland`

- Change password

- Enable SSH
`Interfacing Options`
`SSH`

- Wifi configuration

- Advanced Options -->  Expand Filesystem

- Update
`sudo apt-get update`
`sudo apt-get upgrade`

In order to save the Node-red project in NBitbucket we need to install git

`sudo apt-get install git`

## Activate tmpfs file to save SD cart lifetime
`sudo nano /etc/fstab`

add the following lines:
```
tmpfs /tmp tmpfs defaults,noatime,nosuid,size=10m 0 0
tmpfs /var/tmp tmpfs defaults,noatime,nosuid,size=10m 0 0
tmpfs /var/log tmpfs defaults,noatime,nosuid,mode=0755,size=10m 0 0
```

## Ethernet fix IP address configuration

- the IP address is 10.0.0.3
sudo nano /etc/dhcpcd.conf

interface eth0
inform 10.0.0.3
static routers=10.0.0.1
static domaine_name_servers=10.0.0.1 8.8.8.8

interface wlan0
inform 192.168.0.3
static routers=192.168.0.1
static domaine_name_servers=192.168.0.1 8.8.8.8

## Wifi fix IP address
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

	network={
    		ssid=YourSID"
    		psk="XXXX"
	}


## SSH configuration
In order to have access to the Rpi remotely we activate the ssh service with password (no key needed)
The basic configuration is kept as is.

## Install Mosquitto
 
`sudo apt-get install mosquitto mosquitto-clients`
 
The MQTT broker is now operating on your Pi’s TCP port 1883


A cause de l’usage de tempfs, il faut modifier le fichier /etc/init.d/mosquitto exécuter au démarrage du service et ajouter les 2 dernière lignes 
 ``` 
  start)
        if init_is_upstart; then
            exit 1
        fi
        log_daemon_msg "Starting network daemon:" "mosquitto"
        mkdir -p /var/log/mosquitto
        chown mosquitto:mosquitto /var/log/mosquitto
```

### Add password and users to mosquitto brocker

`sudo mosquitto_passwd -c /etc/mosquitto/passwd yourusernamehere`

Then create a new (empty) configuration file which tells Mosquitto to use the passwords file:

`sudo nano /etc/mosquitto/conf.d/default.conf`

In the file, copy and paste the following two lines:

```
allow_anonymous false
password_file /etc/mosquitto/passwd
require_certificate false
```

Save the file and restart the broker:

`sudo systemctl restart mosquitto`


## Install node red
First install NodeJS and NPM: 
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- npm -v : 6.4.1
- node -v : 8.12.0

Then install Node-RED (https://nodered.org/docs/hardware/raspberrypi)
``` 
bash <(curl -sL https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/update-nodejs-and-nodered)
sudo apt-get install build-essential
```
node-red -v : 0.19.4 

To start: `node-red-start`
Autostart on boot:  

```
sudo wget https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/nodered.service -O /lib/systemd/system/nodered.service
sudo wget https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/node-red-start -O /usr/bin/node-red-start
sudo wget https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/node-red-stop -O /usr/bin/node-red-stop
sudo chmod +x /usr/bin/node-red-st*
sudo systemctl daemon-reload

sudo systemctl enable nodered.service
```
Start is a first time in order to create default files in `/home/pi/.node-red`

`sudo service nodered start`

 Check if correctly started: sudo journalctl -f -u nodered -o cat

stop the service :  `sudo service nodered stop`

THIS IS NOT DONE CURRENTLY: In order to have the node-red interface visible only locally : pen the file /home/pi/.node-red/settings.js and uncomment the following line

`// uiHost: "127.0.0.1"`

Node red flow is available on port 1180


### Add a password to node-red editor TODO 

To generate a new password hash, install the ‘node-red-admin’ tool:
`npm install -g node-red-admin`

And generate a new hash:
`node-red-admin hash-pw`

`nano /home/pi/.node-red/settings.js`

```
adminAuth: {
 type: "credentials",
 users: [{
 username: "[your new username here]",
 password: "[your new password hash here]",
 permissions: "*"
 }]
 },
```

## Rapsberry pi OMX player

`sudo apt-get install omxplayer`



