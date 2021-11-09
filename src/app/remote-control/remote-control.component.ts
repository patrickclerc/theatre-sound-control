import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SoundModel} from "../sounds-board/sound.model";
import {HttpClient} from '@angular/common/http';
import {ApiService} from "../api.service";
import {RemoteControlService} from "./remote-control.service";

@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.css']
})
export class RemoteControlComponent implements OnInit {
  @ViewChild('remoteVolumeSlider') sliderInput: ElementRef;
  min: number = null;
  max: number = null;
  currentVolume: number = null;
  isConnected: boolean;

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private remoteControlService: RemoteControlService) {
  }

  ngOnInit() {
    this.min = this.sliderInput.nativeElement.min;
    this.max = this.sliderInput.nativeElement.max;
    this.currentVolume = this.sliderInput.nativeElement.value;

    this.remoteControlService.volumeUpdated.subscribe((volume: number) => {
      this.currentVolume = volume;
      this.sliderInput.nativeElement.value = volume;
    });

    this.remoteControlService.isConnected.subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  volumeChange() {
    this.currentVolume = this.sliderInput.nativeElement.value;
    return this.http.post<SoundModel>(this.apiService.apiUrl + '/changeRemoteVolume', {volume: this.currentVolume}, this.apiService.httpOptions).subscribe(
      () => {
        console.log('Remote volume changed');
      },
      error => {
        console.log(error)
      }
    );
  }

}
