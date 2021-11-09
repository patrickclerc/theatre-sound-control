import { Component, OnInit, OnDestroy } from '@angular/core';
import {SoundModel} from "./sound.model";
import {SoundsService} from "./sounds.service";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sounds-board',
  templateUrl: './sounds-board.component.html',
  styleUrls: ['./sounds-board.component.css']
})
export class SoundsBoardComponent implements OnInit, OnDestroy {
  soundList: SoundModel[];
  private subscription: Subscription;

  constructor(private soundsService: SoundsService) {
  }

  ngOnInit() {
    this.subscription = this.soundsService.soundsUpdated.subscribe(
      (soundList: SoundModel[]) => {
        this.soundList = soundList;
      }
    );
    this.soundsService.getAllSounds();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
