import {Injectable} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiService} from "../api.service";
import {SoundModel} from "./sound.model";
import {RemoteControlService} from "../remote-control/remote-control.service";


@Injectable()
export class SoundsService {
  url = this.apiService.apiUrl + '/sounds/';
  soundsUpdated = new Subject<SoundModel[]>();
  private soundList: SoundModel[] = [];
  private httpSubscription: Subscription;

  websocketMsg: Subject<any>;

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private remoteControlService: RemoteControlService) {
  }

  getAllSounds() {
    this.httpSubscription = this.http.get(this.url, this.apiService.httpOptions)
    .subscribe(
      (data: SoundModel[]) => {
        this.soundList = data;
        this.soundsUpdated.next(this.soundList.slice());
      },
      error => {
        console.log(error)
      }
    );
  }

  getSoundList() {
    return this.soundList.slice();
  }

  getSound(name: string): Observable<SoundModel> {
    return this.http.get<SoundModel>(this.url + name);
  }

  insertSound(soundModel: SoundModel): Observable<SoundModel> {
    return this.http.post<SoundModel>(this.url, soundModel);
  }

  updateSound(soundModel: SoundModel): Observable<void> {
    return this.http.put<void>(this.url, soundModel);
  }

  deleteSound(name: string) {
    return this.http.delete(this.url + name);
  }

  playRemote(sound: SoundModel) {

    return this.http.post<SoundModel>(this.apiService.apiUrl + '/playRemoteSound', {id: sound.id}, this.apiService.httpOptions).subscribe(
      () => {
        this.remoteControlService.addRunningSound(sound);
        console.log('Sound launched remotely');
      },
      error => {
        console.log(error)
      }
    );
  }

  stopRemote(sound: SoundModel) {
    return this.http.post<SoundModel>(this.apiService.apiUrl + '/stopRemoteSound', {id: sound.id}, this.apiService.httpOptions).subscribe(
      () => {
      },
      error => {
        console.log(error)
      }
    );
  }

}
