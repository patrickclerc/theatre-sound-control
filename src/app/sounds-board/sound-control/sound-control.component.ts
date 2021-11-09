import {Component, Input, OnInit} from '@angular/core';
import {SoundsService} from "../sounds.service";
import {SoundModel} from "../sound.model";
import * as io from 'socket.io-client';
import {RemoteControlService} from "../../remote-control/remote-control.service";

@Component({
  selector: 'app-sound-control',
  templateUrl: './sound-control.component.html',
  styleUrls: ['./sound-control.component.css']
})
export class SoundControlComponent implements OnInit {
  @Input()
  sound: SoundModel;
  localAudio: HTMLAudioElement;
  isRemoteConnected: boolean;

  constructor(private soundsService: SoundsService,
              private remoteControlService: RemoteControlService) {
  }

  ngOnInit() {
    //TODO refactor this in the sound service
    const socket = io.connect('http://localhost:5000');
    socket.on('sound-finished', this.onSoundFinished.bind(this));

    this.remoteControlService.isConnected.subscribe((connected: boolean) => {
      this.isRemoteConnected = connected;
    });
  }

  onSoundFinished(data) {
    if (this.sound.id === data.id) {
      this.remoteControlService.removeRunningSound(this.sound);
      this.sound.active = false;
    }
  }

  onPlaySound() {
    if (this.sound.active) {
      (this.sound.remote && this.isRemoteConnected) ? this.soundsService.stopRemote(this.sound) : this.stopLocalSound()
    } else {
      this.sound.active = true;
      (this.sound.remote && this.isRemoteConnected) ? this.soundsService.playRemote(this.sound) : this.playLocalSound()
    }
  }

  playLocalSound() {
    if (this.localAudio == null) {
      this.localAudio = new Audio('/api/soundFile/' + this.sound.id);
      this.localAudio.onended = () => {
        this.sound.active = false;
      };
    }

    this.localAudio.loop = this.sound.loop;
    this.localAudio.volume = this.sound.volume / 100.0;
    this.localAudio.play();
  }

  stopLocalSound() {
    this.localAudio.pause();
    this.localAudio.currentTime = 0.0;
    this.sound.active = false;
  }

  onToggleLoop() {
    this.sound.loop = !this.sound.loop;
    if (this.localAudio) {
      this.localAudio.loop = this.sound.loop;
    }
  }
}
