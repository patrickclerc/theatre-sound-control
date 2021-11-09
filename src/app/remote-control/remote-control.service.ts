import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SoundModel} from "../sounds-board/sound.model";
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {
  isConnected = new BehaviorSubject<boolean>(true);
  volumeUpdated = new Subject<number>();
  private runningSounds: SoundModel[] = [];

  constructor() {
    this.isConnected.next(true);
    const socket = io.connect('http://localhost:5000');
    socket.on('mqtt-disconnected', this.onMqttDisconnected.bind(this));
    socket.on('mqtt-connected', this.onMqttConnected.bind(this));
  }

  onMqttDisconnected() {
    console.log('remote-control-service: mqtt-disconnected');
    this.isConnected.next(false);
  }

  onMqttConnected() {
    console.log('remote-control-service: mqtt-connected');
    this.isConnected.next(true);
  }

  addRunningSound(sound: SoundModel) {
    if (this.runningSounds.length == 0) {
      this.volumeUpdated.next(sound.volume);
    }
    this.runningSounds.push(sound);
  }

  removeRunningSound(sound: SoundModel) {
    this.runningSounds = this.runningSounds.filter((runningSound) => {
      return runningSound.id !== sound.id
    });
  }
}
